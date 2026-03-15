import type { TypedFlatConfigItem } from '@antfu/eslint-config';

export function node(): TypedFlatConfigItem {
  return {
    name: 'svifty7/node/rules',
    rules: {
      'node/prefer-global/buffer': ['error', 'always'],
      'node/prefer-global/process': ['error', 'always'],
    },
  };
}
