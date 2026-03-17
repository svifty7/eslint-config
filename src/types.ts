import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { ConfigWithExtends } from 'eslint-flat-config-utils';

import type { ConfigNames, RuleOptions } from './typegen';

export type Awaitable<T> = T | Promise<T>;

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> &
  RuleOptions;

export type { ConfigNames, RuleOptions };

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

export interface OptionsVue {
  /**
   * Vue accessibility plugin. Help check a11y issue in `.vue` files upon enabled
   *
   * @see https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/
   * @default false
   */
  a11y?: boolean;
}

export interface OptionsJSX {
  /**
   * Enable JSX accessibility rules.
   *
   * Requires installing:
   * - `eslint-plugin-jsx-a11y`
   *
   * @default false
   */
  a11y?: boolean;
}

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: boolean;

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: boolean;

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: boolean;

  /**
   * Enable formatting support for SVG.
   *
   * Currently only support Prettier.
   */
  svg?: boolean;

  /**
   * Enable formatting support for Markdown.
   *
   * Support only Prettier.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: boolean;

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: boolean;
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

export interface OptionsMarkdown {
  /**
   * Enable GFM (GitHub Flavored Markdown) support.
   *
   * @default true
   */
  gfm?: boolean;
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

export interface OptionsRegExp {
  /**
   * Override rule levels
   */
  level?: 'error' | 'warn';
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsPnpm extends OptionsIsInEditor {
  /**
   * Requires catalogs usage
   *
   * Detects automatically based if `catalogs` is used in the pnpm-workspace.yaml file
   */
  catalogs?: boolean;

  /**
   * Enable linting for package.json, will install the jsonc parser
   *
   * @default true
   */
  json?: boolean;

  /**
   * Enable linting for pnpm-workspace.yaml, will install the yaml parser
   *
   * @default true
   */
  yaml?: boolean;

  /**
   * Sort entries in pnpm-workspace.yaml
   *
   * @default false
   */
  sort?: boolean;
}

export interface OptionsUnoCSS {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean;
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean;
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
   * Enable JSDoc rules
   *
   * Always enabled.
   */
  jsdoc?: boolean;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript;

  /**
   * Enable JSX related rules.
   *
   * Passing an object to enable JSX accessibility rules.
   *
   * @default true
   */
  jsx?: boolean | OptionsJSX;

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
  vue?: boolean | OptionsVue;

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
   * Enable linting for **code snippets** in Markdown and the markdown content itself.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsMarkdown;

  /**
   * Enable unocss rules.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default false
   */
  unocss?: boolean | OptionsUnoCSS;

  /**
   * Enable pnpm (workspace/catalogs) support.
   *
   * Currently it's disabled by default, as it's still experimental.
   * In the future it will be smartly enabled based on the project usage.
   *
   * @see https://github.com/antfu/pnpm-workspace-utils
   * @experimental
   * @default false
   */
  pnpm?: boolean | OptionsPnpm;

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | OptionsFormatters;

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

  prettier?: boolean | PrettierConfig;

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
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
