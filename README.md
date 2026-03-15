# @svifty7/eslint-config

Thanks to Anthony Fu for creating the original plugin [@antfu/eslint-config](https://github.com/antfu/eslint-config) which served as the basis for this project.

![npm](https://img.shields.io/npm/v/%40svifty7%2Feslint-config?style=flat&logo=npm&logoColor=%23CB3837)

A thin wrapper around [@antfu/eslint-config](https://github.com/antfu/eslint-config), tailored to my personal preferences and coding style. Supports Vue 3, TypeScript, JSON, YAML, TOML, Markdown, and other formats out of the box — everything that `@antfu/eslint-config` supports.

> [!WARNING]
>
> This config is opinionated and tailored to my personal preferences. It may not align with your expectations.
> If you use this config, carefully review it when installing or updating. As with the original plugin, you can customize it or fork it to tailor it to your needs.

## What's Different from @antfu/eslint-config

This config is a thin wrapper over `@antfu/eslint-config` that applies a set of opinionated overrides:

| Config | What's overridden |
| --- | --- |
| `javascript` | Enables `camelcase`, `curly` (all), `default-param-last`, `guard-for-in`, `no-param-reassign`, `require-await`, `class-methods-use-this`; disables several `no-*` rules |
| `typescript` | Stricter `ts/ban-ts-comment`, adds `ts/no-dynamic-delete`, `ts/no-extraneous-class`, `ts/no-shadow`, `ts/explicit-member-accessibility` |
| `stylistic` | `style/indent` (2 spaces, 1tbs), `style/padding-line-between-statements`, `style/brace-style`, `antfu/top-level-function`, `antfu/consistent-chaining`, and more |
| `perfectionist` | Custom `sort-imports` groups with tsconfig path resolution; `sort-exports` with `newlinesBetween` |
| `imports` | `import/consistent-type-specifier-style` (prefer-top-level), disables `import/no-named-as-default-member` |
| `node` | Enforces `node/prefer-global/buffer` and `node/prefer-global/process` (always) |
| `unicorn` | A curated set of unicorn rules (`error-message`, `escape-case`, `prefer-node-protocol`, `no-nested-ternary`, `template-indent`, and more) |
| `vue` | Strict Vue 3 rules: `block-order`, `component-api-style` (script-setup only), `block-lang` (ts), `define-props-declaration` (type-based), `max-attributes-per-line: 1`, and many more; includes essential `vue-a11y` accessibility rules |

> Support for React, Svelte, Astro, Solid, Slidev, and Angular is not removed — it's inherited from `@antfu/eslint-config` and can be enabled following antfu's documentation.

## Usage

### Install

```bash
pnpm add -D eslint @svifty7/eslint-config
```

And create `eslint.config.js` (or `eslint.config.ts`) in your project root:

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure();
```

<details>
<summary>
Combined with legacy config:
</summary>

If you still use some configs from the legacy eslintrc format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

```js
// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';

import configure from '@svifty7/eslint-config';

const compat = new FlatCompat();

export default configure(
  {
    ignores: [],
  },

  // Legacy config
  ...compat.config({
    extends: [
      'eslint:recommended',
      // Other extends…
    ],
  }),

  // Other flat configs…
);
```

> Note that `.eslintignore` no longer works in Flat config, see [customization](#customization) for more details.

</details>

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## IDE Support (auto fix on save)

<details>
<summary>🟦 VS Code support</summary>

<br>

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue",
    "html",
    "markdown",
    "json",
    "json5",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

</details>

## Customization

Since this is a thin wrapper around `@antfu/eslint-config`, the `configure` function accepts **all the same options** as `antfu()`. Refer to [@antfu/eslint-config documentation](https://github.com/antfu/eslint-config) for the full options reference.

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure({
  gitignore: {
    strict: true, // Throw an error if gitignore file not found.
  },

  // Type of the project. 'lib' for libraries, the default is 'app'
  type: 'lib',

  // Stylistic rules enabled by default, you can only customize them:
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript and Vue are autodetected, you can also configure them:
  typescript: {
    tsconfigPath: 'path/to/tsconfig.json', // Path to tsconfig.json
  },
  vue: {
    files: ['**/*.CustomFileFormat'],
  },

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    '**/custom-ignore-folder',
    /* ...globs */
  ],
});
```

The `configure` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure(
  {
    // Options for @antfu/eslint-config (and svifty7 overrides)
  },

  // From the second argument onwards, these are ESLint Flat Configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
);
```

### Config Composer

The factory function `configure()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure()
  // some configs before the main config
  .prepend()
  // overrides any named configs
  .override('svifty7/import/rules', {
    rules: {
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    },
  })
  // rename plugin prefixes
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  });
// ...
```

### Plugins Renaming

Since flat config requires us to explicitly provide plugin prefixes (instead of relying on npm package naming conventions), this config (via `@antfu/eslint-config`) renames some plugins:

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-x/*`           | [eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x)                  |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### Vue Accessibility

`eslint-plugin-vuejs-accessibility` rules are enabled by default when Vue is detected in your project. A subset of essential rules is enabled, while overly strict rules (e.g. `click-events-have-key-events`, `anchor-has-content`) are disabled.

### Rules Overrides

Certain rules are only enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure(
  {},
  {
    // Specify the file glob to prevent the Vue plugin from processing non-Vue files.
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'style/semi': ['error', 'never'],
    },
  },
);
```

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config:

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
});
```

### Optional Rules

#### `command`

Powered by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command). It is not a typical rule for linting, but an on-demand micro-codemod tool that triggers by specific comments.

For a few triggers, for example:

- `/// to-function` - converts an arrow function to a normal function
- `/// to-arrow` - converts a normal function to an arrow function
- `/// to-for-each` - converts a for-in/for-of loop to `.forEach()`
- `/// to-for-of` - converts a `.forEach()` to a for-of loop
- `/// keep-sorted` - sorts an object/array/interface
- … etc. — refer to the [documentation](https://github.com/antfu/eslint-plugin-command#built-in-commands)

You can add the trigger comment one line above the code you want to transform, for example (note the triple slash):

<!-- eslint-skip -->

```ts
/// to-function
const foo = (msg: string): void => {
  console.log(msg)
}
```

Will be transformed to this when you hit save with your editor or run `eslint --fix`:

```ts
function foo(msg: string): void {
  console.log(msg);
}
```

The command comments are usually one-off and will be removed along with the transformation.

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

and then

```bash
pnpm add -D lint-staged simple-git-hooks

# to active the hooks
pnpx simple-git-hooks
```

## View what rules are enabled

[Anthony Fu](https://github.com/antfu) built a visual tool to help you view what rules are enabled in your project and apply them to what files, [@eslint/config-inspector](https://github.com/eslint/config-inspector)

Go to your project root that contains `eslint.config.js` and run:

```bash
pnpx @eslint/config-inspector
```

## FAQ

### I prefer XXX...

Sure, you can configure and override rules locally in your project to fit your needs. If that still does not work for you, you can always fork this repo and maintain your own.

## License

[MIT](./LICENSE) License &copy; 2025-PRESENT [svifty7](https://github.com/svifty7)
