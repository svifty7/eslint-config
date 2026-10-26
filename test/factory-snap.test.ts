import type { OptionsConfig, TypedFlatConfigItem } from '../src/types';

import { it } from 'vitest';

import {
  CONFIG_PRESET_FULL_OFF,
  CONFIG_PRESET_FULL_ON,
} from '../src/config-presets';
import { configure } from '../src/factory';

interface Suite {
  name: string;
  options: OptionsConfig;
}

const suites: Suite[] = [
  { name: 'default', options: {} },
  { name: 'full-off', options: CONFIG_PRESET_FULL_OFF },
  { name: 'full-on', options: CONFIG_PRESET_FULL_ON },
  { name: 'javascript-vue', options: { typescript: false, vue: true } },
  { name: 'pnpm-without-yaml', options: { pnpm: true, yaml: false } },
  { name: 'pnpm-without-jsonc', options: { jsonc: false, pnpm: true } },
  { name: 'prettier-off', options: { prettier: false } },
  { name: 'in-editor', options: { isInEditor: true } },
  { name: 'lib', options: { type: 'lib' } },
];

// Depend on the environment (.gitignore content, globals versions)
const ignoredConfigs = new Set([
  'svifty7/gitignore',
  'svifty7/ignores',
  'svifty7/javascript/setup',
]);

function nameOf(value: unknown): string {
  const named = value as { meta?: { name?: string }; name?: string };

  return named.meta?.name ?? named.name ?? 'unknown';
}

function serialize(configs: TypedFlatConfigItem[]): unknown[] {
  return configs.map((config) => {
    if (config.name && ignoredConfigs.has(config.name)) {
      return '<ignored>';
    }

    const { languageOptions, plugins, processor, rules, ...rest } = config;

    return {
      ...rest,
      ...(languageOptions
        ? {
            languageOptions: {
              ...languageOptions,
              globals: undefined,
              parser: languageOptions.parser && nameOf(languageOptions.parser),
              parserOptions: languageOptions.parserOptions && {
                ...languageOptions.parserOptions,
                parser: undefined,
                projectService: undefined,
                tsconfigRootDir: undefined,
              },
            },
          }
        : {}),
      ...(plugins ? { plugins: Object.keys(plugins) } : {}),
      ...(processor ? { processor: nameOf(processor) } : {}),
      ...(rules
        ? {
            rules: Object.entries(rules).map(([rule, value]) =>
              value === 'off' || value === 0 ? `- ${rule}` : rule,
            ),
          }
        : {}),
    };
  });
}

for (const { name, options } of suites) {
  it.concurrent(`factory ${name}`, async ({ expect }) => {
    const configs = await configure({ isInEditor: false, ...options });

    await expect(serialize(configs)).toMatchFileSnapshot(
      `./__snapshots__/factory/${name}.snap.js`,
    );
  });
}
