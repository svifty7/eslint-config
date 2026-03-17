import type { TypedFlatConfigItem } from '../types';

import createCommand from 'eslint-plugin-command/config';

export function command(): TypedFlatConfigItem[] {
  return [
    {
      ...createCommand(),
      name: 'svifty7/command/rules',
    },
  ];
}
