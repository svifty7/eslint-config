import type { TypedFlatConfigItem } from '../src/types';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  confirm: vi.fn(),
  installPackage: vi.fn(),
  isPackageExists: vi.fn(),
}));

vi.mock('local-pkg', () => ({ isPackageExists: mocks.isPackageExists }));
vi.mock('@clack/prompts', () => ({ confirm: mocks.confirm }));

vi.mock('@antfu/install-pkg', () => ({
  installPackage: mocks.installPackage,
}));

function loadUtils(cwdInScope = true): Promise<typeof import('../src/utils')> {
  vi.resetModules();

  mocks.isPackageExists.mockImplementation(
    (name: string) => name === '@svifty7/eslint-config' && cwdInScope,
  );

  return import('../src/utils');
}

const isTTY = process.stdout.isTTY;

beforeEach(() => {
  vi.clearAllMocks();

  for (const name of [
    'CI',
    'GIT_PARAMS',
    'JETBRAINS_IDE',
    'NVIM',
    'VIM',
    'VSCODE_CWD',
    'VSCODE_GIT_COMMAND',
    'VSCODE_PID',
    'ZED_ENVIRONMENT',
    'ZED_TERM',
    'npm_lifecycle_script',
  ]) {
    vi.stubEnv(name, '');
  }
});

afterEach(() => {
  vi.unstubAllEnvs();
  process.stdout.isTTY = isTTY;
});

describe('parserPlain', () => {
  it('returns an empty program spanning the whole code', async () => {
    const { parserPlain } = await loadUtils();

    const { ast, services } = parserPlain.parseForESLint('abc');

    expect(ast.range).toEqual([0, 3]);
    expect(ast.body).toEqual([]);
    expect(services.isPlain).toBe(true);
  });
});

describe('combine', () => {
  it('flattens plain and awaited configs in order', async () => {
    const { combine } = await loadUtils();
    const first: TypedFlatConfigItem = { name: 'first' };
    const second: TypedFlatConfigItem = { name: 'second' };
    const third: TypedFlatConfigItem = { name: 'third' };

    await expect(
      combine(first, Promise.resolve([second]), [third]),
    ).resolves.toEqual([first, second, third]);
  });

  it('rejects when a config rejects', async () => {
    const { combine } = await loadUtils();

    await expect(combine(Promise.reject(new Error('boom')))).rejects.toThrow(
      'boom',
    );
  });
});

describe('renameRules', () => {
  it('renames only full plugin prefixes', async () => {
    const { renameRules } = await loadUtils();

    expect(
      renameRules(
        { 'no-console': 'off', 'ts-extra/a': 'warn', 'ts/a': 'error' },
        { ts: 'typescript' },
      ),
    ).toEqual({
      'no-console': 'off',
      'ts-extra/a': 'warn',
      'typescript/a': 'error',
    });
  });
});

describe('renamePluginInConfigs', () => {
  it('renames rules and plugins without mutating the source', async () => {
    const { renamePluginInConfigs } = await loadUtils();
    const plugin = {};
    const other = {};

    const source: TypedFlatConfigItem = {
      plugins: { other, ts: plugin },
      rules: { 'ts/a': 'error' },
    };

    expect(renamePluginInConfigs([source], { ts: 'typescript' })).toEqual([
      {
        plugins: { other, typescript: plugin },
        rules: { 'typescript/a': 'error' },
      },
    ]);

    expect(Object.keys(source.plugins ?? {})).toEqual(['other', 'ts']);
  });

  it('keeps configs without rules and plugins', async () => {
    const { renamePluginInConfigs } = await loadUtils();

    expect(renamePluginInConfigs([{ name: 'empty' }], {})).toEqual([
      { name: 'empty' },
    ]);
  });
});

describe('toArray', () => {
  it('wraps a single value and keeps arrays', async () => {
    const { toArray } = await loadUtils();
    const array = [1];

    expect(toArray(1)).toEqual([1]);
    expect(toArray(array)).toBe(array);
  });
});

describe('interopDefault', () => {
  it('unwraps the default export', async () => {
    const { interopDefault } = await loadUtils();

    await expect(
      interopDefault(Promise.resolve({ default: 'value' })),
    ).resolves.toBe('value');
  });

  it('returns a module without a default export as is', async () => {
    const { interopDefault } = await loadUtils();
    const module = { named: true };

    await expect(interopDefault(module)).resolves.toBe(module);
  });
});

describe('ensurePackages', () => {
  it.each([
    ['in CI', 'true', true, true],
    ['without a TTY', '', false, true],
    ['outside the config scope', '', true, false],
  ])('skips the check %s', async (_, ci, tty, cwdInScope) => {
    vi.stubEnv('CI', ci);
    process.stdout.isTTY = tty;

    const { ensurePackages } = await loadUtils(cwdInScope);

    await ensurePackages(['missing']);

    expect(mocks.confirm).not.toHaveBeenCalled();
  });

  it('does not prompt when packages are installed', async () => {
    process.stdout.isTTY = true;

    const { ensurePackages } = await loadUtils();

    mocks.isPackageExists.mockReturnValue(true);

    await ensurePackages(['installed', undefined]);

    expect(mocks.confirm).not.toHaveBeenCalled();
  });

  it('installs a missing package after confirmation', async () => {
    process.stdout.isTTY = true;
    mocks.confirm.mockResolvedValue(true);

    const { ensurePackages } = await loadUtils();

    await ensurePackages(['missing']);

    expect(mocks.confirm).toHaveBeenCalledWith({
      message: expect.stringContaining('Package is required') as string,
    });

    expect(mocks.installPackage).toHaveBeenCalledWith(['missing'], {
      dev: true,
    });
  });

  it('does not install declined packages', async () => {
    process.stdout.isTTY = true;
    mocks.confirm.mockResolvedValue(false);

    const { ensurePackages } = await loadUtils();

    await ensurePackages(['first', 'second']);

    expect(mocks.confirm).toHaveBeenCalledWith({
      message: expect.stringContaining('Packages are required') as string,
    });

    expect(mocks.installPackage).not.toHaveBeenCalled();
  });
});

describe('isInEditorEnv', () => {
  it.each([
    'VSCODE_PID',
    'VSCODE_CWD',
    'JETBRAINS_IDE',
    'VIM',
    'NVIM',
    'ZED_ENVIRONMENT',
  ])('detects %s', async (name) => {
    vi.stubEnv(name, '1');

    const { isInEditorEnv } = await loadUtils();

    expect(isInEditorEnv()).toBe(true);
  });

  it('is off without editor variables', async () => {
    const { isInEditorEnv } = await loadUtils();

    expect(isInEditorEnv()).toBe(false);
  });

  it('ignores the terminal embedded in Zed', async () => {
    vi.stubEnv('ZED_ENVIRONMENT', '1');
    vi.stubEnv('ZED_TERM', '1');

    const { isInEditorEnv } = await loadUtils();

    expect(isInEditorEnv()).toBe(false);
  });

  it('is off in CI and git hooks', async () => {
    vi.stubEnv('VSCODE_PID', '1');

    const { isInEditorEnv } = await loadUtils();

    vi.stubEnv('CI', 'true');
    expect(isInEditorEnv()).toBe(false);

    vi.stubEnv('CI', '');
    vi.stubEnv('GIT_PARAMS', '1');
    expect(isInEditorEnv()).toBe(false);
  });
});

describe('isInGitHooksOrLintStaged', () => {
  it.each([
    ['GIT_PARAMS', '1'],
    ['VSCODE_GIT_COMMAND', 'commit'],
    ['npm_lifecycle_script', 'lint-staged'],
    ['npm_lifecycle_script', 'nano-staged --diff'],
  ])('detects %s=%s', async (name, value) => {
    vi.stubEnv(name, value);

    const { isInGitHooksOrLintStaged } = await loadUtils();

    expect(isInGitHooksOrLintStaged()).toBe(true);
  });

  it('ignores other scripts', async () => {
    vi.stubEnv('npm_lifecycle_script', 'eslint');

    const { isInGitHooksOrLintStaged } = await loadUtils();

    expect(isInGitHooksOrLintStaged()).toBe(false);
  });
});
