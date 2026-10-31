import { afterEach, describe, expect, it, vi } from 'vitest';

import { configure, resolveSubOptions } from '../src/factory';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const minimal = {
  jsonc: false,
  markdown: false,
  pnpm: false,
  prettier: false,
  test: false,
  toml: false,
  typescript: false,
  vue: false,
  yaml: false,
};

describe('configure', () => {
  it('detects an editor from the environment and warns', async () => {
    vi.stubEnv('CI', '');
    vi.stubEnv('GIT_PARAMS', '');
    vi.stubEnv('VSCODE_GIT_COMMAND', '');
    vi.stubEnv('npm_lifecycle_script', '');
    vi.stubEnv('VSCODE_PID', '1');

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await configure(minimal);

    expect(warn).toHaveBeenCalledWith(
      '[@svifty7/eslint-config] Detected running in editor, some rules are disabled.',
    );
  });

  it('stays quiet outside an editor', async () => {
    vi.stubEnv('CI', 'true');

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await configure(minimal);

    expect(warn).not.toHaveBeenCalled();
  });

  it('rejects "files" in the options', () => {
    expect(() => configure({ files: ['a'] } as any)).toThrow(
      'should not contain the "files" property',
    );
  });

  it('turns top-level rules into a config item', async () => {
    const configs = await configure({
      ...minimal,
      isInEditor: false,
      rules: { 'no-console': 'off' },
    });

    expect(configs.at(-1)?.rules).toEqual({ 'no-console': 'off' });
  });

  it('adds no config item without flat config options', async () => {
    const configs = await configure({ ...minimal, isInEditor: false });

    expect(configs.at(-1)?.name).toBe('svifty7/disables/prettier');
  });

  it('skips gitignore when it is off', async () => {
    const configs = await configure({
      ...minimal,
      gitignore: false,
      isInEditor: false,
    });

    expect(configs.map((i) => i.name)).not.toContain('svifty7/gitignore');
  });

  it('passes gitignore options through', async () => {
    const configs = await configure({
      ...minimal,
      gitignore: { files: [], strict: false },
      isInEditor: false,
    });

    expect(configs.map((i) => i.name)).toContain('svifty7/gitignore');
  });

  it('passes Prettier options to the formatters', async () => {
    const configs = await configure({
      ...minimal,
      isInEditor: false,
      prettier: { tailwindConfig: 'tailwind.config.ts' },
    });

    const config = configs.find((i) => i.name === 'svifty7/formatter/prettier');

    expect(config?.rules?.['format/prettier']).toMatchObject([
      'error',
      { tailwindConfig: 'tailwind.config.ts' },
    ]);
  });

  it('renames user plugins unless renaming is off', async () => {
    const userConfig = { name: 'user', plugins: { '@stylistic': {} } };

    const pluginNames = async (
      autoRenamePlugins: boolean,
    ): Promise<string[]> => {
      const configs = await configure(
        { ...minimal, autoRenamePlugins, isInEditor: false },
        userConfig,
      );

      return Object.keys(configs.at(-1)?.plugins ?? {});
    };

    await expect(pluginNames(true)).resolves.toEqual(['style']);
    await expect(pluginNames(false)).resolves.toEqual(['@stylistic']);
  });
});

describe('resolveSubOptions', () => {
  it('returns an object for boolean and missing options', () => {
    expect(resolveSubOptions({ typescript: true }, 'typescript')).toEqual({});
    expect(resolveSubOptions({}, 'typescript')).toEqual({});
  });

  it('returns the options object', () => {
    const typescript = { tsconfigPath: 'tsconfig.json' };

    expect(resolveSubOptions({ typescript }, 'typescript')).toBe(typescript);
  });
});
