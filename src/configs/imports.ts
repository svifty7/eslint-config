import { pluginAntfu, pluginImport } from '../plugins';

import type { TypedFlatConfigItem } from '../types';

export function imports(): TypedFlatConfigItem[] {
  return [
    {
      name: 'svifty7/imports/rules',
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/no-import-node-modules-by-path': 'error',

        'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/newline-after-import': ['error', { count: 1 }],
        'import/no-named-as-default-member': 'off',
      },
    },
  ];
}
