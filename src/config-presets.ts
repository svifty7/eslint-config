import type { OptionsConfig } from './types';

// @keep-sorted
export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
  formatters: true,
  gitignore: true,
  jsdoc: true,
  jsonc: true,
  jsx: {
    a11y: true,
  },
  markdown: true,
  pnpm: true,
  test: true,
  toml: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  unocss: true,
  vue: {
    a11y: true,
  },
  yaml: true,
};

export const CONFIG_PRESET_FULL_OFF: OptionsConfig = {
  formatters: false,
  gitignore: false,
  jsdoc: false,
  jsonc: false,
  jsx: false,
  markdown: false,
  pnpm: false,
  test: false,
  toml: false,
  typescript: false,
  unocss: false,
  vue: false,
  yaml: false,
};
