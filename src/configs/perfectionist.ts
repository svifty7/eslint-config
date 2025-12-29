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
              'builtin',
              'external',
              'internal',
              'tsconfig-path',
              'subpath',
              'parent',
              'sibling',
              'index',
              'unknown',
              'type-builtin',
              'type-external',
              ['type-internal', 'type-tsconfig-path', 'type-subpath'],
              ['type-parent', 'type-sibling', 'type-index'],
              'side-effect',
              'side-effect-style',
              'style',
            ],
            internalPattern: ['^~/.+', '^@/.+'],
            newlinesBetween: 1,
            order: 'asc',
            type: 'natural',
            tsconfig: {
              rootDir: process.cwd(),
            },
            fallbackSort: { type: 'unsorted' },
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
