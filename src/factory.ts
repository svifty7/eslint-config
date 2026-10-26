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
  e18e,
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
  sonarjs,
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
import { GLOB_MARKDOWN } from './globs';
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

type UserConfig = Awaitable<
  | TypedFlatConfigItem
  | TypedFlatConfigItem[]
  | FlatConfigComposer<any, any>
  | Linter.Config[]
>;

type FactoryOptions = OptionsConfig
  & Omit<TypedFlatConfigItem, 'files' | 'ignores'>;

function resolveIsInEditor(options: OptionsConfig): boolean {
  if (options.isInEditor != null) {
    return options.isInEditor;
  }

  const isInEditor = isInEditorEnv();

  if (isInEditor) {
    console.warn(
      '[@svifty7/eslint-config] Detected running in editor, some rules are disabled.',
    );
  }

  return isInEditor;
}

function gitignore(
  options: OptionsConfig['gitignore'],
): Awaitable<TypedFlatConfigItem[]> {
  if (!options) {
    return [];
  }

  return interopDefault(import('eslint-config-flat-gitignore')).then((r) => [
    r({
      name: 'svifty7/gitignore',
      ...(typeof options === 'boolean' ? { strict: false } : options),
    }),
  ]);
}

function prettier(
  options: OptionsConfig['prettier'],
  hasVue: boolean,
): Awaitable<TypedFlatConfigItem[]> {
  if (typeof options === 'object') {
    return formatters({ prettier: options, vue: hasVue });
  }

  return (options ?? true) ? formatters({ vue: hasVue }) : [];
}

/**
 * User can optionally pass a flat config item to the first argument.
 * We pick the known keys as ESLint would do schema validation.
 */
function fusedConfig(options: FactoryOptions): TypedFlatConfigItem[] {
  if ('files' in options) {
    throw new Error(
      '[@svifty7/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    );
  }

  const config = flatConfigProps.reduce((acc, key) => {
    if (key in options) {
      acc[key] = options[key] as any;
    }

    return acc;
  }, {} as TypedFlatConfigItem);

  return Object.keys(config).length ? [config] : [];
}

function compose(
  configs: Awaitable<TypedFlatConfigItem[]>[],
  userConfigs: UserConfig[],
  options: {
    autoRenamePlugins: boolean;
    isInEditor: boolean;
    markdown: boolean;
  },
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(...configs, ...(userConfigs as any));

  // `markdown/gfm` SourceCode lacks JS-only methods like `getAllComments`,
  // so user rules without `files` must not reach `.md` files.
  // See https://github.com/antfu/eslint-config/issues/837
  if (options.markdown) {
    composer = composer.setDefaultIgnores((prev) => [...prev, GLOB_MARKDOWN]);
  }

  if (options.autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }

  if (options.isInEditor) {
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
  options: FactoryOptions = {},
  ...userConfigs: UserConfig[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    jsonc: enableJsonc = true,
    jsx: enableJsx = true,
    markdown: enableMarkdown = true,
    pnpm: enableCatalogs = !!findUpSync('pnpm-lock.yaml'),
    test: enableTest = true,
    toml: enableToml = true,
    typescript: enableTypeScript = isPackageExists('typescript')
      || isPackageExists('@typescript/native-preview'),
    unocss: enableUnoCSS = false,
    vue: enableVue = VuePackages.some((i) => isPackageExists(i)),
    yaml: enableYaml = true,
  } = options;

  const isInEditor = resolveIsInEditor(options);

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [
    gitignore(options.gitignore ?? true),
    ignores(options.ignores, !enableTypeScript),
    javascript({ isInEditor }),
    comments(),
    node(),
    jsdoc(),
    imports(),
    command(),
    perfectionist(),
    unicorn(),
    e18e(),
    enableJsx ? jsx() : [],
    enableTypeScript
      ? typescript({
          ...resolveSubOptions(options, 'typescript'),
          componentExts,
          type: options.type,
        })
      : [],
    sonarjs(),
    stylistic(),
    regexp(),
    enableTest ? test({ isInEditor }) : [],
  ];

  if (enableVue) {
    componentExts.push('vue');
    configs.push(vue(!!enableTypeScript));
  }

  configs.push(
    enableUnoCSS ? unocss() : [],
    ...(enableJsonc ? [jsonc(), sortPackageJson(), sortTsconfig()] : []),
    enableCatalogs
      ? pnpm({ isInEditor, json: enableJsonc, yaml: enableYaml })
      : [],
    enableYaml ? yaml() : [],
    enableToml ? toml() : [],
    enableMarkdown ? markdown({ componentExts }) : [],
    prettier(options.prettier, !!enableVue),
    disables(),
    fusedConfig(options),
  );

  return compose(configs, userConfigs, {
    autoRenamePlugins,
    isInEditor,
    markdown: enableMarkdown,
  });
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
