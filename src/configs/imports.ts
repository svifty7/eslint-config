import type { TypedFlatConfigItem } from '@antfu/eslint-config';

export function imports(): TypedFlatConfigItem {
  return {
    name: 'svifty7/import/rules',
    rules: {
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/no-named-as-default-member': 'off',
    },
  };
}
