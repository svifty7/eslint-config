import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { ConfigWithExtends } from 'eslint-flat-config-utils';
import type { ESLintRules } from 'eslint/rules';

import type { RuleOptions as PluginRuleOptions } from './typegen';

export type Awaitable<T> = T | Promise<T>;

export type RuleOptions = PluginRuleOptions & Partial<ESLintRules>;

export type Rules = Record<string, Linter.RuleEntry<any> | undefined>
  & RuleOptions;

export type { ConfigNames } from './typegen';

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<
  ConfigWithExtends,
  'plugins' | 'rules'
> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules;
};

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsTypescript {
  /**
   * Path to tsconfig file for type aware rules.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string;
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib';
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsConfig
  extends OptionsComponentExts, OptionsProjectType {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Extend the global ignores.
   *
   * Passing an array to extends the ignores.
   * Passing a function to modify the default ignores.
   *
   * @default []
   */
  ignores?: string[] | ((originals: string[]) => string[]);

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable type aware rules.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript;

  /**
   * Enable JSX related rules.
   *
   * @default true
   */
  jsx?: boolean;

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean;

  /**
   * Enable Vue support. Accessibility rules are always enabled.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean;

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean;

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean;

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean;

  /**
   * Enable linting for **code snippets** in Markdown and the markdown content itself (GFM).
   *
   * @default true
   */
  markdown?: boolean;

  /**
   * Enable unocss rules.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default false
   */
  unocss?: boolean;

  /**
   * Enable pnpm (workspace/catalogs) support.
   *
   * @see https://github.com/antfu/pnpm-workspace-utils
   * @default auto-detect based on the existence of `pnpm-lock.yaml`
   */
  pnpm?: boolean;

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean;

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean;

  /**
   * Format files with Prettier. Passing an object to configure the XML and Tailwind CSS plugins.
   *
   * @default true
   */
  prettier?: boolean | PrettierConfig;
}

export type PrettierConfig = XmlPrettierConfig & TailwindPluginOptions;

export interface TailwindPluginOptions {
  /**
   * Path to the Tailwind config file.
   */
  tailwindConfig?: string;
  /**
   * Path to the CSS stylesheet used by Tailwind CSS (v4+)
   */
  tailwindStylesheet?: string;
  /**
   * List of custom function and tag names that contain classes.
   */
  tailwindFunctions?: string[];
  /**
   * List of custom attributes that contain classes.
   */
  tailwindAttributes?: string[];
  /**
   * Preserve whitespace around Tailwind classes when sorting.
   */
  tailwindPreserveWhitespace?: boolean;
  /**
   * Preserve duplicate classes inside a class list when sorting.
   */
  tailwindPreserveDuplicates?: boolean;
}

export interface XmlPrettierConfig {
  /**
   * How to handle whitespaces in XML.
   * @default "preserve"
   */
  xmlQuoteAttributes?: 'single' | 'double' | 'preserve';
  /**
   * Whether to put a space inside the brackets of self-closing XML elements.
   * @default true
   */
  xmlSelfClosingSpace?: boolean;
  /**
   * Whether to sort attributes by key in XML elements.
   * @default false
   */
  xmlSortAttributesByKey?: boolean;
  /**
   * How to handle whitespaces in XML.
   * @default "ignore"
   */
  xmlWhitespaceSensitivity?: 'ignore' | 'strict' | 'preserve';
}
