import { GLOB_EXCLUDE } from '../globs';

import type { TypedFlatConfigItem } from '../types';

export function ignores(userIgnores: string[] = []): TypedFlatConfigItem[] {
  return [
    {
      ignores: [...GLOB_EXCLUDE, ...userIgnores],
      name: 'svifty7/ignores',
    },
  ];
}
