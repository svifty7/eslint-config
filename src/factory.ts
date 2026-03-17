import type { Linter } from 'eslint';

import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from './types';

import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { findUpSync } from 'find-up-simple';
import { isPackageExists } from 'local-pkg';

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
  unocss,
  vue,
  yaml,
} from './configs';
import { interopDefault, isInEditorEnv } from './utils';

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
  'import-lite': 'import',
  'n': 'node',
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
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files' | 'ignores'> = {},
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    gitignore: enableGitignore = true,
    jsx: enableJsx = true,
    unocss: enableUnoCSS,
    pnpm: enableCatalogs = !!findUpSync('pnpm-lock.yaml'),
    vue: enableVue = VuePackages.some((i) => isPackageExists(i))
      ? true
      : undefined,
    typescript: enableTypeScript = isPackageExists('typescript') ||
    isPackageExists('@typescript/native-preview')
      ? true
      : undefined,
  } = options;

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

  // Always enabled configs
  configs.push(
    ignores(options.ignores, !enableTypeScript),
    javascript({ isInEditor }),
    comments(),
    node(),
    jsdoc(),
    imports(),
    command(),
    perfectionist(),
    unicorn(),
  );

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

  configs.push(stylistic());
  configs.push(regexp());

  if (options.test ?? true) {
    configs.push(test({ isInEditor }));
  }

  if (enableVue) {
    componentExts.push('vue');

    configs.push(vue(!!enableTypeScript));
  }

  if (enableUnoCSS) {
    configs.push(unocss());
  }

  if (options.jsonc ?? true) {
    configs.push(jsonc(), sortPackageJson(), sortTsconfig());
  }

  if (enableCatalogs) {
    configs.push(pnpm());
  }

  if (options.yaml ?? true) {
    configs.push(yaml());
  }

  if (options.toml ?? true) {
    configs.push(toml());
  }

  if (options.markdown ?? true) {
    configs.push(markdown({ componentExts }));
  }

  if (typeof options.prettier === 'object') {
    configs.push(
      formatters({
        prettier: options.prettier,
        vue: !!enableVue,
      }),
    );
  } else if (options.prettier ?? true) {
    configs.push(formatters({ vue: !!enableVue }));
  }

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
  return typeof options[key] === 'boolean'
    ? ({} as any)
    : options[key] || ({} as any);
}
