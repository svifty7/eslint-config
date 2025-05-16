# @svifty7/eslint-config

Thanks to Anthony Fu for creating the original plugin [@antfu/eslint-config](https://github.com/antfu/eslint-config) which served as the basis for this project.

![npm](https://img.shields.io/npm/v/%40svifty7%2Feslint-config?style=flat&logo=npm&logoColor=%23CB3837)

An ESLint configuration based on [@antfu/eslint-config](https://github.com/antfu/eslint-config), tailored to my personal preferences and coding style. This configuration is integrated with Prettier. It supports Vue 3, TypeScript, JSON, YAML, TOML, Markdown, and other formats out of the box.

> [!WARNING]
>
> Unlike the original package, I’ve removed functionality related to the automatic installation of packages upon auto-detection. Instead, dependencies are included by default (except for `eslint` and `vue`, which need to be installed separately). Support for React, Svelte, Astro, Solid, and Slidev has been removed, as they are not used in my projects.
>
> Instead of relying **solely on ESLint**, I’ve **added Prettier** because I prefer the code output it produces, and conflicting rules have been disabled as a result. Some rules have also been disabled, modified, or added, such as enforcing semicolons.
>
> These changes suit my preferences but may not align with your expectations. If you use this config, carefully review it when installing or updating the plugin. As with the original plugin, you can customize it or fork it to tailor it to your needs.

## Key Features

- Uses Prettier for code formatting
- Out-of-the-box support for Vue 3
- Works with TypeScript, JSX, JSON, YAML, TOML, Markdown, and more
- Built on ESLint Flat Config for flexible composition
- Auto-fixing for most rules
- Respects .gitignore by default
- Requires ESLint v9.26.0+. Earlier versions may work with modifications, but they are untested.
- Styling rules:
  - Enforced semicolons, single quotes, trailing commas
  - Uses ESLint Stylistic
- Simple setup: one line for basic configuration
- Highly customizable for specific needs

## Usage

### Install

Install eslint with this config:

```bash
pnpm add -D eslint @svifty7/eslint-config
```

And create `eslint.config.js` in your project root:

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

Normally you only need to import the `configure` preset:

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure();
```

And that's it! Or you can configure each integration individually, for example:

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
    // Configures for svifty7's config
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
);
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

Anthony Fu [don't recommend](https://github.com/antfu/eslint-config/blob/main/README.md#customization) using this style unless you know exactly what you're doing, as shared options between configs may require extra care to ensure consistency.

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from '@svifty7/eslint-config';

export default combine(
  ignores(),
  javascript(),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  vue(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
);
```

</details>

Check out the [configs](https://github.com/svifty7/eslint-config/blob/main/src/configs) and [factory](https://github.com/svifty7/eslint-config/blob/main/src/factory.ts) or [original package](https://github.com/antfu/eslint-config) for more details.

> Thanks to [antfu/eslint-config](https://github.com/antfu/eslint-config) and [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Plugins Renaming

Since flat config requires us to explicitly provide plugin prefixes (instead of relying on npm package naming conventions).

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

> [!NOTE]
>
> About plugin renaming - it is actually rather a dangrous move that might leading to potential naming collisions, pointed out [here](https://github.com/eslint/eslint/discussions/17766) and [here](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat).
>
> As this config also very personal and opinionated, I share Anthony's point of view and position this config as the only "top-level" config per project.

This preset will automatically rename the plugins also for your custom configs. You can use the original prefix to override the rules directly.

<details>
<summary>Change back to original prefix</summary>

If you really want to use the original prefix, you can revert the plugin renaming by:

```ts
import configure from '@svifty7/eslint-config';

export default configure().renamePlugins({
  ts: '@typescript-eslint',
  yaml: 'yml',
  node: 'n',
  // ...
});
```

</details>

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

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

### Config Composer

The factory function `configure()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure()
  // some configs before the main config
  .prepend()
  // overrides any named configs
  .override('svifty7/imports', {
    rules: {
      'import/order': ['error', { 'newlines-between': 'always' }],
    },
  })
  // rename plugin prefixes
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  });
// ...
```

### Vue

Vue support is detected automatically by checking if `vue` is installed in your project.

#### Vue 2

Vue 2 is not supported in this config.

#### Vue Accessibility

vue-accessibility is enabled by default when vue was detected in your project.

#### Formatters

Prettier formatter is enabled by default to format files that ESLint cannot handle yet (`.css`, `.html`, etc), but you can disable it for some format files. Powered by [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format).

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure({
  formatters: {
    /**
     * Format Markdown files
     * @default true
     */
    markdown: false,
  },
});
```

### Optional Rules

This config also provides some optional plugins/rules for extended usage.

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

### Editor Specific Disables

Auto-fixing for the following rules are disabled when ESLint is running in a code editor:

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)

They are made non-fixable using the `disableRulesFix` utility from `eslint-flat-config-utils` (see [documentation](https://github.com/antfu/eslint-flat-config-utils#composerdisablerulesfix)).

This is to prevent unused imports from getting removed by the editor during refactoring to get a better developer experience. Those rules will be applied when you run ESLint in the terminal or [Lint Staged](#lint-staged). If you don't want this behavior, you can disable them:

```js
// eslint.config.js
import configure from '@svifty7/eslint-config';

export default configure({
  isInEditor: false,
});
```

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
