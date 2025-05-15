import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { ParserOptions } from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { Config as VendorPrettierConfig } from 'prettier';

import type { ConfigNames, RuleOptions } from './typegen';

export type Awaitable<T> = T | Promise<T>;

export interface Rules extends RuleOptions {}

export type { ConfigNames };

export type TypedFlatConfigItem = Omit<
  Linter.Config<Linter.RulesRecord & Rules>,
  'plugins'
> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;
};

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export type OptionsTypescript =
  | OptionsTypeScriptWithTypes
  | OptionsTypeScriptParserOptions;

export type DefaultPrettierConfig = Pick<
  VendorPrettierConfig,
  | 'semi'
  | 'singleQuote'
  | 'tabWidth'
  | 'useTabs'
  | 'quoteProps'
  | 'jsxSingleQuote'
  | 'trailingComma'
  | 'bracketSpacing'
  | 'bracketSameLine'
  | 'arrowParens'
  | 'requirePragma'
  | 'insertPragma'
  | 'proseWrap'
  | 'htmlWhitespaceSensitivity'
  | 'vueIndentScriptAndStyle'
  | 'endOfLine'
  | 'singleAttributePerLine'
  | 'objectWrap'
  | 'experimentalTernaries'
  | 'experimentalOperatorPosition'
  | 'printWidth'
>;

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

export type PrettierConfig = DefaultPrettierConfig & XmlPrettierConfig;

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsUnicorn {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`.
   *
   * @default false
   */
  allRecommended?: boolean;
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**']
   */
  ignoresTypeAware?: string[];
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string;

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules'];
}

export interface OptionsHasTypeScript {
  typescript?: boolean;
}

export interface OptionsStylistic {
  stylistic?: StylisticConfig;
}

export type StylisticConfig = Omit<StylisticCustomizeOptions, 'pluginName'>;

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib';
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: 'error' | 'warn';
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsConfig
  extends OptionsComponentExts,
    OptionsProjectType {
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
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: OptionsTypescript;

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn;

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean;

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: OptionsFiles;

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
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean;

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: StylisticConfig;

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | OptionsRegExp;

  /**
   * Enable pnpm (workspace/catalogs) support.
   *
   * Currently it's disabled by default, as it's still experimental.
   * In the future it will be smartly enabled based on the project usage.
   *
   * @see https://github.com/antfu/pnpm-workspace-utils
   * @experimental
   * @default true
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
}
