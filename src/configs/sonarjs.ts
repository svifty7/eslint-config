import type { TypedFlatConfigItem } from '../types';

import { GLOB_SRC, GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

/**
 * Curated subset of SonarJS for redundant and duplicated code, no type information required.
 *
 * @see https://github.com/SonarSource/SonarJS
 */
export async function sonarjs(): Promise<TypedFlatConfigItem[]> {
  await ensurePackages(['eslint-plugin-sonarjs']);

  const pluginSonarjs = await interopDefault(import('eslint-plugin-sonarjs'));

  return [
    {
      name: 'svifty7/sonarjs/setup',
      plugins: {
        sonarjs: pluginSonarjs,
      },
    },
    {
      files: [GLOB_SRC, GLOB_VUE],
      name: 'svifty7/sonarjs/rules',
      rules: {
        'sonarjs/cognitive-complexity': ['error', 15],
        'sonarjs/no-all-duplicated-branches': 'error',
        'sonarjs/no-collapsible-if': 'error',
        'sonarjs/no-commented-code': 'error',
        'sonarjs/no-dead-store': 'error',
        'sonarjs/no-duplicated-branches': 'error',
        'sonarjs/no-element-overwrite': 'error',
        'sonarjs/no-empty-collection': 'error',
        'sonarjs/no-gratuitous-expressions': 'error',
        'sonarjs/no-identical-conditions': 'error',
        'sonarjs/no-identical-expressions': 'error',
        'sonarjs/no-identical-functions': 'error',
        'sonarjs/no-invariant-returns': 'error',
        'sonarjs/no-inverted-boolean-check': 'error',
        'sonarjs/no-redundant-boolean': 'error',
        'sonarjs/no-redundant-jump': 'error',
        'sonarjs/no-unused-collection': 'error',
        'sonarjs/no-use-of-empty-return-value': 'error',
        'sonarjs/prefer-single-boolean-return': 'error',
      },
    },
  ];
}
