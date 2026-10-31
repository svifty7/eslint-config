import type { TypedFlatConfigItem } from '../types';

import packageJsonOrder from './order/package-json.json';
import compilerOptionsOrder from './order/tsconfig-compiler-options.json';

/**
 * Sort package.json
 *
 * Requires `jsonc` config
 */
export function sortPackageJson(): TypedFlatConfigItem[] {
  return [
    {
      files: ['**/package.json'],
      name: 'svifty7/sort/package-json',
      rules: {
        'jsonc/sort-array-values': [
          'error',
          {
            order: { type: 'asc' },
            pathPattern: '^files$',
          },
        ],
        'jsonc/sort-keys': [
          'error',
          {
            order: packageJsonOrder,
            pathPattern: '^$',
          },
          {
            order: ['cpu', 'os', 'libc', 'runtime', 'packageManager'],
            pathPattern: '^devEngines$',
          },
          {
            order: { type: 'asc' },
            pathPattern:
              '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$',
          },
          {
            order: { type: 'asc' },
            pathPattern: String.raw`^workspaces\.catalog$`,
          },
          {
            order: { type: 'asc' },
            pathPattern: String.raw`^workspaces\.catalogs\.[^.]+$`,
          },
          {
            order: ['types', 'import', 'require', 'default'],
            pathPattern: '^exports.*$',
          },
          {
            order: [
              // client hooks only
              'pre-commit',
              'prepare-commit-msg',
              'commit-msg',
              'post-commit',
              'pre-rebase',
              'post-rewrite',
              'post-checkout',
              'post-merge',
              'pre-push',
              'pre-auto-gc',
            ],
            pathPattern: '^(?:gitHooks|husky|simple-git-hooks)$',
          },
        ],
      },
    },
  ];
}

/**
 * Sort tsconfig.json
 *
 * Requires `jsonc` config
 */

export function sortTsconfig(): TypedFlatConfigItem[] {
  return [
    {
      files: ['**/[jt]sconfig.json', '**/[jt]sconfig.*.json'],
      name: 'svifty7/sort/tsconfig-json',
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'extends',
              'compilerOptions',
              'references',
              'files',
              'include',
              'exclude',
            ],
            pathPattern: '^$',
          },
          {
            order: Object.values(compilerOptionsOrder).flat(),
            pathPattern: '^compilerOptions$',
          },
        ],
      },
    },
  ];
}
