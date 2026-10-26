import type { OptionsConfig } from './types';

export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
  gitignore: true,
  jsonc: true,
  jsx: true,
  markdown: true,
  pnpm: true,
  prettier: true,
  test: true,
  toml: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  unocss: true,
  vue: true,
  yaml: true,
};

export const CONFIG_PRESET_FULL_OFF: OptionsConfig = {
  gitignore: false,
  jsonc: false,
  jsx: false,
  markdown: false,
  pnpm: false,
  prettier: false,
  test: false,
  toml: false,
  typescript: false,
  unocss: false,
  vue: false,
  yaml: false,
};
