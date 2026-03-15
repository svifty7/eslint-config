import type { TypedFlatConfigItem } from '@antfu/eslint-config';

import { GLOB_ASTRO_TS, GLOB_TS, GLOB_TSX, GLOB_VUE } from '@antfu/eslint-config';

export function typescript(): TypedFlatConfigItem {
  return {
    name: 'svifty7/typescript/rules',
    files: [GLOB_TS, GLOB_VUE, GLOB_TSX, GLOB_ASTRO_TS],
    rules: {
      'ts/no-dynamic-delete': 'error',
      'ts/no-extraneous-class': 'error',
      'ts/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
        },
      ],
      'ts/consistent-type-assertions': 'error',
      'ts/no-shadow': 'error',
      'ts/explicit-member-accessibility': ['error', {
        accessibility: 'no-public',
      }],
    },
  };
}
