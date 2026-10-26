import type { OptionsConfig, TypedFlatConfigItem } from '../src/types';

import fs from 'node:fs/promises';
import { join } from 'node:path';

import { ESLint } from 'eslint';
import { glob } from 'tinyglobby';
import { afterAll, beforeAll, it } from 'vitest';

import { configure } from '../src/factory';

const tempDir = '_fixtures';

beforeAll(async () => {
  await fs.rm(tempDir, { force: true, recursive: true });
});

afterAll(async () => {
  await fs.rm(tempDir, { force: true, recursive: true });
});

function runWithConfig(
  name: string,
  options: OptionsConfig,
  ...userConfigs: TypedFlatConfigItem[]
): void {
  it.concurrent(name, async ({ expect }) => {
    const target = join(tempDir, name);

    await fs.cp('fixtures/input', target, { recursive: true });

    const eslint = new ESLint({
      fix: true,
      overrideConfig: await configure(
        { gitignore: false, isInEditor: false, ...options },
        ...userConfigs,
      ),
      overrideConfigFile: true,
    });

    const results = await eslint.lintFiles([`${target}/**/*`]);

    await ESLint.outputFixes(results);

    const files = await glob('**/*', { cwd: target, dot: true });

    await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(join(target, file), 'utf8');

        await expect(content).toMatchFileSnapshot(
          join('..', 'fixtures', 'output', name, file),
        );
      }),
    );
  });
}

runWithConfig('default', { typescript: true, vue: true });
runWithConfig('javascript', { typescript: false, vue: false });
runWithConfig('prettier-off', { prettier: false, typescript: true, vue: true });

// User rules without `files` must not crash on non-JS languages (.md, package.json)
runWithConfig(
  'user-override',
  { typescript: true, vue: true },
  {
    rules: {
      'style/padding-line-between-statements': 'off',
      'unicorn/prefer-includes': 'warn',
    },
  },
);
