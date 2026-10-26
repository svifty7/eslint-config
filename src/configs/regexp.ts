import type { TypedFlatConfigItem } from '../types';

import { configs } from 'eslint-plugin-regexp';

export function regexp(): TypedFlatConfigItem[] {
  return [
    {
      ...(configs['flat/recommended'] as TypedFlatConfigItem),
      name: 'svifty7/regexp/rules',
    },
  ];
}
