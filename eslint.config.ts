import { configure } from './src';

export default configure({
  type: 'lib',
  pnpm: true,
  typescript: true,
  unocss: true,
  vue: true,
  // Intentionally unformatted inputs and generated outputs
  ignores: ['fixtures'],
});
