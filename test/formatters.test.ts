import type { TypedFlatConfigItem } from '../src/types';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatters } from '../src/configs/formatters';

const mocks = vi.hoisted(() => ({
  resolveModule: vi.fn((name: string) => `/resolved/${name}`),
}));

vi.mock('local-pkg', async (importOriginal) => ({
  ...(await importOriginal<typeof import('local-pkg')>()),
  resolveModule: mocks.resolveModule,
}));

function prettierOptions(
  configs: TypedFlatConfigItem[],
  name: string,
): Record<string, any> {
  const config = configs.find((i) => i.name === `svifty7/formatter/${name}`);

  return (config?.rules?.['format/prettier'] as unknown[])[1] as Record<
    string,
    any
  >;
}

function names(configs: TypedFlatConfigItem[]): (string | undefined)[] {
  return configs.map((i) => i.name);
}

afterEach(() => {
  vi.restoreAllMocks();
  mocks.resolveModule.mockClear();
});

describe('formatters', () => {
  it('keeps the config order', async () => {
    expect(names(await formatters({ vue: true }))).toEqual(
      [
        'setup',
        'prettier',
        'css',
        'scss',
        'less',
        'html',
        'vue',
        'markdown',
        'graphql',
        'xml',
        'svg',
      ].map((i) => `svifty7/formatter/${i}`),
    );
  });

  it('leaves Vue out by default', async () => {
    expect(names(await formatters())).not.toContain('svifty7/formatter/vue');
  });

  it('defaults to the TypeScript parser and passes user options', async () => {
    const configs = await formatters({
      prettier: { tailwindConfig: 'tailwind.config.ts' },
    });

    expect(prettierOptions(configs, 'prettier')).toMatchObject({
      parser: 'typescript',
      plugins: ['/resolved/prettier-plugin-tailwindcss'],
      tailwindConfig: 'tailwind.config.ts',
    });

    expect(prettierOptions(configs, 'css').parser).toBe('css');
    expect(prettierOptions(configs, 'scss').plugins).toEqual([]);
  });

  it('builds XML options only from XML settings', async () => {
    const configs = await formatters({
      prettier: { xmlQuoteAttributes: 'single' },
    });

    expect(prettierOptions(configs, 'xml')).toEqual({
      bracketSameLine: false,
      parser: 'xml',
      plugins: ['/resolved/@prettier/plugin-xml'],
      singleAttributePerLine: true,
      xmlQuoteAttributes: 'single',
      xmlSelfClosingSpace: true,
      xmlSortAttributesByKey: false,
      xmlWhitespaceSensitivity: 'ignore',
    });
  });

  it('works without the Tailwind plugin', async () => {
    mocks.resolveModule.mockImplementation((name) =>
      name === 'prettier-plugin-tailwindcss' ? '' : `/resolved/${name}`,
    );

    const configs = await formatters();

    expect(prettierOptions(configs, 'prettier').plugins).toEqual([]);
  });

  it('warns and skips XML when its plugin is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mocks.resolveModule.mockImplementation((name) =>
      name === '@prettier/plugin-xml' ? '' : `/resolved/${name}`,
    );

    const configs = await formatters();

    expect(warn).toHaveBeenCalledWith(
      '[@svifty7/eslint-config] Failed to resolve @prettier/plugin-xml',
    );

    expect(names(configs)).not.toContain('svifty7/formatter/xml');
    expect(names(configs)).not.toContain('svifty7/formatter/svg');
  });
});
