import type { TypedFlatConfigItem } from '../types';

import { GLOB_SRC } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function jsdoc(): Promise<TypedFlatConfigItem[]> {
  await ensurePackages(['eslint-plugin-jsdoc']);

  return [
    {
      name: 'svifty7/jsdoc/setup',
      plugins: {
        jsdoc: await interopDefault(import('eslint-plugin-jsdoc')),
      },
    },
    {
      files: [GLOB_SRC],
      name: 'svifty7/jsdoc/rules',
      rules: {
        'jsdoc/check-access': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/check-types': 'warn',
        'jsdoc/empty-tags': 'warn',
        'jsdoc/implements-on-classes': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/no-multi-asterisks': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/require-property': 'warn',
        'jsdoc/require-property-description': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns-check': 'warn',
        'jsdoc/require-returns-description': 'warn',
        'jsdoc/require-yields-check': 'warn',
        'jsdoc/check-alignment': 'warn',
        'jsdoc/multiline-blocks': 'warn',
      },
    },
  ];
}
