import { configs } from 'eslint-plugin-regexp';

import type { OptionsRegExp, TypedFlatConfigItem } from '../types';

export function regexp(options: OptionsRegExp = {}): TypedFlatConfigItem[] {
  const config = configs['flat/recommended'] as TypedFlatConfigItem;

  if (!config || !config.rules) {
    return [
      {
        name: 'svifty7/regexp/rules',
        ...config,
      },
    ];
  }

  if (options.level === 'warn') {
    for (const key of Object.keys(config.rules)) {
      if (config.rules[key] === 'error') {
        config.rules[key] = 'warn';
      }
    }
  }

  return [
    {
      name: 'svifty7/regexp/rules',
      ...config,
    },
  ];
}
