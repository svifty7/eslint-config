import { pluginNode } from '../plugins';

import type { TypedFlatConfigItem } from '../types';

export function node(): TypedFlatConfigItem[] {
  return [
    {
      name: 'svifty7/node/rules',
      plugins: {
        node: pluginNode,
      },
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/prefer-global/buffer': ['error', 'always'],
        'node/prefer-global/process': ['error', 'always'],
        'node/process-exit-as-throw': 'error',
      },
    },
  ];
}
