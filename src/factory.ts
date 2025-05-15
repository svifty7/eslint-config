import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { isPackageExists } from 'local-pkg';

import type { Linter } from 'eslint';

import {
  command,
  comments,
  disables,
  formatters,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  perfectionist,
  pnpm,
  regexp,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  test,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from './configs';
import { interopDefault, isInEditorEnv } from './utils';

import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from './types';

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
] satisfies (keyof TypedFlatConfigItem)[];

const VuePackages = ['vue', 'nuxt', 'vitepress'];

export const defaultPluginRenaming = {
  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-x': 'import',
  'node': 'node',
  'vitest': 'test',
  'yml': 'yaml',
};

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function configure(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const defaultConfig: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {
    autoRenamePlugins: true,
    componentExts: [],
    gitignore: true,
    jsx: true,
    pnpm: true, // TODO: smart detect
    regexp: true,
    typescript: isPackageExists('typescript') ? {} : undefined,
    unicorn: true,
    vue: VuePackages.some((i) => isPackageExists(i)) ? {} : undefined,
  };

  const {
    autoRenamePlugins,
    componentExts = [],
    gitignore: enableGitignore,
    jsx: enableJsx,
    pnpm: enableCatalogs,
    regexp: enableRegexp,
    typescript: enableTypeScript,
    unicorn: enableUnicorn,
    vue: enableVue,
  } = Object.assign(defaultConfig, options);

  let isInEditor = options.isInEditor;

  if (isInEditor == null) {
    isInEditor = isInEditorEnv();

    if (isInEditor) {
      // eslint-disable-next-line no-console
      console.log(
        '[@svifty7/eslint-config] Detected running in editor, some rules are disabled.',
      );
    }
  }

  const stylisticOptions =
    typeof options.stylistic === 'object' ? options.stylistic : {};

  if (!('jsx' in stylisticOptions)) {
    stylisticOptions.jsx = enableJsx;
  }

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then((r) => [
          r({
            name: 'svifty7/gitignore',
            ...enableGitignore,
          }),
        ]),
      );
    } else {
      configs.push(
        interopDefault(import('eslint-config-flat-gitignore')).then((r) => [
          r({
            name: 'svifty7/gitignore',
            strict: false,
          }),
        ]),
      );
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript');

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({ isInEditor }),
    comments(),
    node(),
    jsdoc(),
    imports(),
    command(),
    perfectionist(),
  );

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableVue) {
    componentExts.push('vue');
  }

  if (enableJsx) {
    configs.push(jsx());
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        type: options.type,
      }),
    );
  }

  configs.push(
    stylistic({
      ...stylisticOptions,
    }),
  );

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp));
  }

  if (options.test ?? true) {
    configs.push(
      test({
        isInEditor,
      }),
    );
  }

  if (enableVue) {
    configs.push(
      vue({
        ...resolveSubOptions(options, 'vue'),
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (enableCatalogs) {
    configs.push(pnpm());
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        stylistic: stylisticOptions,
      }),
    );
  }

  if (options.toml ?? true) {
    configs.push(
      toml({
        stylistic: stylisticOptions,
      }),
    );
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown({
        componentExts,
      }),
    );
  }

  configs.push(formatters(stylisticOptions));

  configs.push(disables());

  if ('files' in options) {
    throw new Error(
      '[@svifty7/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) {
      acc[key] = options[key] as any;
    }

    return acc;
  }, {} as TypedFlatConfigItem);

  if (Object.keys(fusedConfig).length) {
    configs.push([fusedConfig]);
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(...configs, ...(userConfigs as any));

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }

  if (isInEditor) {
    composer = composer.disableRulesFix(
      [
        'unused-imports/no-unused-imports',
        'test/no-only-tests',
        'prefer-const',
      ],
      {
        builtinRules: () =>
          import(['eslint', 'use-at-your-own-risk'].join('/')).then(
            (r) => r.builtinRules,
          ),
      },
    );
  }

  return composer;
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean' ?
      ({} as any)
    : options[key] || ({} as any);
}
