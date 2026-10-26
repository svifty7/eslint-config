import type { Linter } from 'eslint';

import type { TypedFlatConfigItem } from '../types';

import { GLOB_SRC, GLOB_VUE } from '../globs';
import { pluginE18e } from '../plugins';

/**
 * Modern and faster native APIs.
 *
 * @see https://github.com/e18e/eslint-plugin
 */
export function e18e(): TypedFlatConfigItem[] {
  const configs = pluginE18e.configs as Record<string, Linter.Config>;

  return [
    {
      name: 'svifty7/e18e/setup',
      plugins: {
        e18e: pluginE18e,
      },
    },
    {
      files: [GLOB_SRC, GLOB_VUE],
      name: 'svifty7/e18e/rules',
      rules: {
        ...configs.modernization.rules,
        ...configs.performanceImprovements.rules,

        'e18e/prefer-includes': 'off', // covered by unicorn/prefer-includes
        'e18e/prefer-static-regex': 'off', // negligible gain in apps, noisy
      },
    },
  ];
}
