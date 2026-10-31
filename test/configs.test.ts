import type { TypedFlatConfigItem } from '../src/types';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { ignores } from '../src/configs/ignores';
import { pnpm } from '../src/configs/pnpm';
import { sortPackageJson, sortTsconfig } from '../src/configs/sort';
import { stylistic } from '../src/configs/stylistic';
import { GLOB_EXCLUDE, GLOB_TS, GLOB_TSX } from '../src/globs';

const mocks = vi.hoisted(() => ({
  findUp: vi.fn(),
  readFile: vi.fn(),
}));

vi.mock('find-up-simple', async (importOriginal) => ({
  ...(await importOriginal<typeof import('find-up-simple')>()),
  findUp: mocks.findUp,
}));

vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs/promises')>();

  return {
    ...original,
    default: { ...original, readFile: mocks.readFile },
  };
});

function findConfig(
  configs: TypedFlatConfigItem[],
  name: string,
): TypedFlatConfigItem {
  const config = configs.find((i) => i.name === name);

  if (!config) {
    throw new Error(`Config ${name} not found`);
  }

  return config;
}

function ruleOptions(config: TypedFlatConfigItem, rule: string): any[] {
  return (config.rules?.[rule] as unknown[]).slice(1);
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('ignores', () => {
  it('uses the default globs', () => {
    expect(ignores()[0]?.ignores).toEqual(GLOB_EXCLUDE);
  });

  it('adds TypeScript globs and user globs', () => {
    expect(ignores(['custom'], true)[0]?.ignores).toEqual([
      ...GLOB_EXCLUDE,
      GLOB_TS,
      GLOB_TSX,
      'custom',
    ]);
  });

  it('lets a function replace the globs', () => {
    const userIgnores = vi.fn(() => ['only']);

    expect(ignores(userIgnores)[0]?.ignores).toEqual(['only']);
    expect(userIgnores).toHaveBeenCalledWith([...GLOB_EXCLUDE]);
  });
});

describe('pnpm', () => {
  it('skips the catalog rule without a workspace file', async () => {
    mocks.findUp.mockResolvedValue(undefined);

    const configs = await pnpm();

    expect(
      findConfig(configs, 'svifty7/pnpm/package-json').rules,
    ).not.toHaveProperty(['pnpm/json-enforce-catalog']);
  });

  it('skips the catalog rule for a workspace without catalogs', async () => {
    mocks.findUp.mockResolvedValue('pnpm-workspace.yaml');
    mocks.readFile.mockResolvedValue('packages:\n  - packages/*\n');

    const configs = await pnpm();

    expect(
      findConfig(configs, 'svifty7/pnpm/package-json').rules,
    ).not.toHaveProperty(['pnpm/json-enforce-catalog']);
  });

  it.each(['catalog:\n', 'catalogs:\n'])(
    'enforces catalogs for a workspace with %j',
    async (yaml) => {
      mocks.findUp.mockResolvedValue('pnpm-workspace.yaml');
      mocks.readFile.mockResolvedValue(yaml);

      const configs = await pnpm({ isInEditor: true });

      expect(
        ruleOptions(
          findConfig(configs, 'svifty7/pnpm/package-json'),
          'pnpm/json-enforce-catalog',
        ),
      ).toEqual([{ autofix: false, ignores: ['@types/vscode'] }]);
    },
  );

  it('orders workspace keys by group, ending with catalogs', async () => {
    mocks.findUp.mockResolvedValue(undefined);

    const configs = await pnpm();

    const [root] = ruleOptions(
      findConfig(configs, 'svifty7/pnpm/pnpm-workspace-yaml-sort'),
      'yaml/sort-keys',
    );

    const order = root.order as string[];

    expect(order[0]).toBe('dedupeInjectedDeps');
    expect(order.at(-1)).toBe('catalogs');
    expect(order.indexOf('packages')).toBeLessThan(order.indexOf('catalog'));
    expect(new Set(order).size).toBe(order.length);
  });
});

describe('sort', () => {
  it('orders package.json keys with name before scripts', () => {
    const [root] = ruleOptions(sortPackageJson()[0]!, 'jsonc/sort-keys');
    const order = root.order as string[];

    expect(order.indexOf('name')).toBeLessThan(order.indexOf('scripts'));
    expect(new Set(order).size).toBe(order.length);
  });

  it('matches the workspace catalog paths literally', () => {
    const patterns = ruleOptions(sortPackageJson()[0]!, 'jsonc/sort-keys').map(
      (i) => i.pathPattern as string,
    );

    expect(patterns).toContain('^workspaces\\.catalog$');
    expect(patterns).toContain('^workspaces\\.catalogs\\.[^.]+$');
  });

  it('flattens compiler option groups in order', () => {
    const [, compilerOptions] = ruleOptions(
      sortTsconfig()[0]!,
      'jsonc/sort-keys',
    );

    const order = compilerOptions.order as string[];

    expect(order[0]).toBe('incremental');
    expect(order.at(-1)).toBe('skipLibCheck');
    expect(new Set(order).size).toBe(order.length);
  });
});

describe('stylistic', () => {
  it('allows statements of one kind to stay together', async () => {
    const [config] = await stylistic();

    const options = ruleOptions(
      config!,
      'style/padding-line-between-statements',
    );

    expect(options).toContainEqual({
      blankLine: 'any',
      next: 'singleline-const',
      prev: 'singleline-const',
    });

    expect(options).toContainEqual({
      blankLine: 'any',
      next: 'cjs-export',
      prev: 'cjs-export',
    });
  });
});
