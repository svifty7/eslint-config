import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';

import type { TypedFlatConfigItem } from '../types';

import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

/**
 * Code style shared with Prettier. Formatting itself is done by Prettier,
 * so only rules Prettier doesn't cover are enabled below.
 */
export const StylisticConfigDefaults: Required<
  Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'semi'>
> = {
  indent: 2,
  quotes: 'single',
  semi: true,
};

const MULTILINE_STATEMENTS = [
  'multiline-const',
  'multiline-expression',
  'multiline-let',
  'multiline-var',
] as const;

const STATEMENTS_WITHOUT_PADDING = [
  'singleline-const',
  'singleline-let',
  'singleline-var',
  'directive',
  'import',
  'export',
  'cjs-import',
  'cjs-export',
] as const;

export async function stylistic(): Promise<TypedFlatConfigItem[]> {
  const pluginStylistic = await interopDefault(
    import('@stylistic/eslint-plugin'),
  );

  return [
    {
      name: 'svifty7/stylistic/rules',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        'antfu/consistent-chaining': 'error',
        'antfu/top-level-function': 'error',

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
            next: [...MULTILINE_STATEMENTS],
          },
          {
            blankLine: 'always',
            prev: [...MULTILINE_STATEMENTS],
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
          ...STATEMENTS_WITHOUT_PADDING.map((statement) => ({
            blankLine: 'any' as const,
            prev: statement,
            next: statement,
          })),
        ],
        'style/spaced-comment': ['error', 'always'],
      },
    },
  ];
}
