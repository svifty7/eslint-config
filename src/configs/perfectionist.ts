import { pluginPerfectionist } from '../plugins';

import type { TypedFlatConfigItem } from '../types';

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function perfectionist(): TypedFlatConfigItem[] {
  return [
    {
      name: 'svifty7/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-exports': [
          'error',
          { order: 'asc', type: 'natural' },
        ],
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'type',
              'internal',
              'parent',
              'sibling',
              'index',
              'side-effect',
              'unknown',
              ['parent-type', 'sibling-type', 'index-type', 'internal-type'],
              'object',
            ],
            internalPattern: ['^~/.+', '^@/.+'],
            newlinesBetween: 'always',
            order: 'asc',
            type: 'natural',
            tsconfigRootDir: process.cwd(),
          },
        ],
        'perfectionist/sort-named-exports': [
          'error',
          { order: 'asc', type: 'natural' },
        ],
        'perfectionist/sort-named-imports': [
          'error',
          { order: 'asc', type: 'natural' },
        ],
      },
    },
  ];
}
