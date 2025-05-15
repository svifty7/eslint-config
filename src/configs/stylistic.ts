import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

import type { TypedFlatConfigItem } from '../types';

export const StylisticConfigDefaults: Required<StylisticCustomizeOptions> = {
  indent: 2,
  quotes: 'single',
  semi: true,
  jsx: true,
  arrowParens: true,
  braceStyle: '1tbs',
  blockSpacing: true,
  quoteProps: 'consistent-as-needed',
  commaDangle: 'always-multiline',
  pluginName: 'style',
};
export async function stylistic(
  options: Omit<StylisticCustomizeOptions, 'pluginName'> = {},
): Promise<TypedFlatConfigItem[]> {
  const stylisticConfig = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const pluginStylistic = await interopDefault(
    import('@stylistic/eslint-plugin'),
  );

  const config = pluginStylistic.configs.customize(stylisticConfig);

  return [
    {
      name: 'svifty7/stylistic/rules',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        'antfu/consistent-chaining': 'error',
        'antfu/consistent-list-newline': 'off',
        'antfu/curly': 'off',
        'antfu/if-newline': 'off',
        'antfu/top-level-function': 'error',

        'style/jsx-curly-brace-presence': 'off', // ts(7027)
        'style/jsx-self-closing-comp': 'off',
        'style/jsx-sort-props': 'off',
        'style/lines-between-class-members': [
          'error',
          'always',
          { exceptAfterSingleLine: false },
        ],
        'style/padding-line-between-statements': [
          'error',
          {
            blankLine: 'always',
            prev: [
              'block-like',
              'break',
              'class',
              'const',
              'debugger',
              'directive',
              'throw',
              'try',
              'function',
              'import',
              'cjs-import',
              'return',
              'continue',
            ],
            next: '*',
          },
          {
            blankLine: 'always',
            prev: '*',
            next: [
              'block-like',
              'break',
              'class',
              'const',
              'continue',
              'debugger',
              'directive',
              'return',
              'throw',
              'try',
              'export',
              'cjs-export',
              'function',
              'import',
              'cjs-import',
            ],
          },
          {
            blankLine: 'always',
            prev: '*',
            next: [
              'multiline-const',
              'multiline-expression',
              'multiline-let',
              'multiline-var',
            ],
          },
          {
            blankLine: 'always',
            prev: [
              'multiline-const',
              'multiline-expression',
              'multiline-let',
              'multiline-var',
            ],
            next: '*',
          },
          {
            blankLine: 'always',
            prev: 'block',
            next: 'block',
          },
          {
            blankLine: 'never',
            prev: 'break',
            next: ['case', 'default'],
          },
          {
            blankLine: 'never',
            prev: ['case', 'default'],
            next: ['case', 'default'],
          },
          {
            blankLine: 'any',
            prev: 'singleline-const',
            next: 'singleline-const',
          },
          {
            blankLine: 'any',
            prev: 'singleline-let',
            next: 'singleline-let',
          },
          {
            blankLine: 'any',
            prev: 'singleline-var',
            next: 'singleline-var',
          },
          {
            blankLine: 'any',
            prev: 'directive',
            next: 'directive',
          },
          {
            blankLine: 'any',
            prev: 'import',
            next: 'import',
          },
          {
            blankLine: 'any',
            prev: 'export',
            next: 'export',
          },
          {
            blankLine: 'any',
            prev: 'cjs-import',
            next: 'cjs-import',
          },
          {
            blankLine: 'any',
            prev: 'cjs-export',
            next: 'cjs-export',
          },
        ],
        'style/spaced-comment': 'off',
      },
    },
  ];
}
