import { GLOB_EXCLUDE, GLOB_TS, GLOB_TSX } from '../globs';

import type { TypedFlatConfigItem } from '../types';

export function ignores(
  userIgnores: string[] = [],
  ignoreTypeScript: boolean = false,
): TypedFlatConfigItem[] {
  const ignoresArray: string[] = [...GLOB_EXCLUDE, ...userIgnores];

  if (ignoreTypeScript) {
    ignoresArray.push(GLOB_TS, GLOB_TSX);
  }

  return [
    {
      ignores: ignoresArray,
      name: 'svifty7/ignores',
    },
  ];
}
