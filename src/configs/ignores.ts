import type { TypedFlatConfigItem } from '../types';

import { GLOB_EXCLUDE, GLOB_TS, GLOB_TSX } from '../globs';

export function ignores(
  userIgnores: string[] | ((originals: string[]) => string[]) = [],
  ignoreTypeScript = false,
): TypedFlatConfigItem[] {
  let ignoresArray = [...GLOB_EXCLUDE];

  if (ignoreTypeScript) {
    ignoresArray.push(GLOB_TS, GLOB_TSX);
  }

  if (typeof userIgnores === 'function') {
    ignoresArray = userIgnores(ignoresArray);
  } else {
    ignoresArray = [...ignoresArray, ...userIgnores];
  }

  return [
    {
      ignores: ignoresArray,
      name: 'svifty7/ignores',
    },
  ];
}
