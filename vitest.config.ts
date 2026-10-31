import { quality } from '@svifty7/quality-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [quality()],
  test: {
    include: ['test/**/*.test.ts'],
    testTimeout: 60_000,
    coverage: {
      include: ['src/**/*.ts', 'scripts/**/*.ts'],
      exclude: ['src/typegen.d.ts'],
    },
  },
});
