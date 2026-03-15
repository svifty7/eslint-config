import type { TypedFlatConfigItem } from '@antfu/eslint-config';

import { GLOB_MARKDOWN, GLOB_MARKDOWN_IN_MARKDOWN } from '@antfu/eslint-config';

export function perfectionist(): TypedFlatConfigItem[] {
  return [
    {
      name: 'svifty7/perfectionist/rules',
      rules: {
        'perfectionist/sort-exports': [
          'error',
          {
            order: 'asc',
            type: 'natural',
            newlinesBetween: 1,
            groups: [
              'type-export',
              { group: 'multiline-export', newlinesInside: 1 },
              'singleline-export',
            ],
          },
        ],
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              'type-builtin',
              'type-external',
              ['type-internal', 'type-tsconfig-path', 'type-subpath'],
              ['type-parent', 'type-sibling', 'type-index'],

              'value-builtin',
              'value-external',
              'value-internal',
              ['value-parent', 'value-sibling', 'value-index'],
              'side-effect',
              'ts-equals-import',
              'unknown',
            ],
            internalPattern: ['^~/.+', '^~.+', '^#.+', '^@/.+'],
            tsconfig: {
              rootDir: process.cwd(),
            },
            fallbackSort: { type: 'unsorted' },
          },
        ],
      },
    },
    {
      name: 'svifty7/markdown/disables/perfectionist',
      files: [GLOB_MARKDOWN, GLOB_MARKDOWN_IN_MARKDOWN],
      rules: {
        'perfectionist/sort-exports': 'off',
        'perfectionist/sort-imports': 'off',
      },
    },
  ];
}
