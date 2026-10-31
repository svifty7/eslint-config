import { expect, it, vi } from 'vitest';

const writeFile = vi.hoisted(() => vi.fn());

vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:fs/promises')>();

  return { ...original, default: { ...original, writeFile } };
});

it('writes rule options and config names', async () => {
  await import('../scripts/typegen');

  expect(writeFile).toHaveBeenCalledOnce();

  const [path, dts] = writeFile.mock.calls[0] as [string, string];

  expect(path).toBe('src/typegen.d.ts');
  expect(dts).toContain('export interface RuleOptions');
  expect(dts).toContain("'ts/no-explicit-any'?:");
  expect(dts).toContain('export type ConfigNames =');
  expect(dts).toContain("'svifty7/javascript/rules'");
});
