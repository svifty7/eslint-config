import fs from 'node:fs/promises';
import { join, resolve } from 'node:path';

import parserTs from '@typescript-eslint/parser';
import { Linter } from 'eslint';
import pluginPerfectionist from 'eslint-plugin-perfectionist';
import { afterAll, beforeAll, expect, it } from 'vitest';

import { sortImportsOptions } from '../src/configs/perfectionist';

const rootDir = resolve('_fixtures/sort-imports');

beforeAll(async () => {
  await fs.mkdir(join(rootDir, 'src'), { recursive: true });

  // Nuxt maps external packages through `paths` as well
  await fs.writeFile(
    join(rootDir, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        moduleResolution: 'Bundler',
        paths: {
          '~/*': ['./src/*'],
          'vue': ['../../node_modules/vue'],
        },
      },
    }),
  );
});

afterAll(async () => {
  await fs.rm(rootDir, { force: true, recursive: true });
});

it('keeps packages mapped through tsconfig paths external', () => {
  const code = [
    `import type { Ref } from 'vue';`,
    '',
    `import type { Item } from '~/types';`,
    '',
    `import { ref } from 'vue';`,
    '',
    `import { item } from '~/item';`,
    '',
  ].join('\n');

  const messages = new Linter().verify(
    code,
    [
      {
        files: ['**/*.ts'],
        languageOptions: { parser: parserTs },
        plugins: { perfectionist: pluginPerfectionist },
        rules: {
          'perfectionist/sort-imports': [
            'error',
            { ...sortImportsOptions(false), tsconfig: { rootDir } },
          ],
        },
      },
    ],
    join(rootDir, 'src/index.ts'),
  );

  expect(messages.map((m) => m.message)).toEqual([]);
});
