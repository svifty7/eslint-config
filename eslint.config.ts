import { configure } from './src';

export default configure({
  type: 'lib',
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
  typescript: true,
  unocss: true,
  vue: {
    a11y: true,
  },
  yaml: true,
  ignores: ['.agents'],
});
