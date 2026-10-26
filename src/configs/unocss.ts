import type { TypedFlatConfigItem } from '../types';

import { ensurePackages, interopDefault } from '../utils';

export async function unocss(): Promise<TypedFlatConfigItem[]> {
  await ensurePackages(['@unocss/eslint-plugin']);

  const pluginUnoCSS = await interopDefault(import('@unocss/eslint-plugin'));

  return [
    {
      name: 'svifty7/unocss',
      plugins: {
        unocss: pluginUnoCSS,
      },
      rules: {
        'unocss/order': 'warn',
        'unocss/order-attributify': 'warn',
      },
    },
  ];
}
