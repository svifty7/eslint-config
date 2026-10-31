import type { OptionsIsInEditor, TypedFlatConfigItem } from '../types';

import fs from 'node:fs/promises';

import { findUp } from 'find-up-simple';

import { ensurePackages, interopDefault } from '../utils';
import pnpmWorkspaceOrder from './order/pnpm-workspace.json';

interface PnpmOptions extends OptionsIsInEditor {
  /**
   * Lint `package.json` files
   *
   * @default true
   */
  json?: boolean;

  /**
   * Lint `pnpm-workspace.yaml`
   *
   * @default true
   */
  yaml?: boolean;
}

async function detectCatalogUsage(): Promise<boolean> {
  const workspaceFile = await findUp('pnpm-workspace.yaml');

  if (!workspaceFile) {
    return false;
  }

  const yaml = await fs.readFile(workspaceFile, 'utf-8');

  return yaml.includes('catalog:') || yaml.includes('catalogs:');
}

export async function pnpm(
  options: PnpmOptions = {},
): Promise<TypedFlatConfigItem[]> {
  await ensurePackages([
    'eslint-plugin-pnpm',
    'eslint-plugin-yml',
    'jsonc-eslint-parser',
    'yaml-eslint-parser',
  ]);

  const [pluginPnpm, pluginYaml, jsoncParser, yamlParser] = await Promise.all([
    interopDefault(import('eslint-plugin-pnpm')),
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('jsonc-eslint-parser')),
    interopDefault(import('yaml-eslint-parser')),
  ]);

  const { isInEditor = false, json = true, yaml = true } = options;
  const catalogs = await detectCatalogUsage();

  const configs: TypedFlatConfigItem[] = [];

  if (json) {
    configs.push({
      files: ['package.json', '**/package.json'],
      // a parser rather than the `jsonc/x` language, like the jsonc config:
      // rules without `files` would crash on a non-JS language
      languageOptions: {
        parser: jsoncParser,
      },
      name: 'svifty7/pnpm/package-json',
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        ...(catalogs
          ? {
              'pnpm/json-enforce-catalog': [
                'error',
                {
                  autofix: !isInEditor,
                  ignores: ['@types/vscode'],
                },
              ],
            }
          : {}),
        'pnpm/json-prefer-workspace-settings': [
          'error',
          { autofix: !isInEditor },
        ],
        'pnpm/json-valid-catalog': ['error', { autofix: !isInEditor }],
      },
    });
  }

  if (yaml) {
    configs.push(
      {
        files: ['pnpm-workspace.yaml'],
        languageOptions: {
          parser: yamlParser,
        },
        name: 'svifty7/pnpm/pnpm-workspace-yaml',
        plugins: {
          pnpm: pluginPnpm,
        },
        rules: {
          'pnpm/yaml-enforce-settings': [
            'error',
            {
              settings: {
                minimumReleaseAgeExcludePrune: true,
                shellEmulator: true,
              },
            },
          ],
          'pnpm/yaml-no-duplicate-catalog-item': 'error',
          'pnpm/yaml-no-unused-catalog-item': 'error',
        },
      },
      {
        files: ['pnpm-workspace.yaml'],
        languageOptions: {
          parser: yamlParser,
        },
        name: 'svifty7/pnpm/pnpm-workspace-yaml-blank-lines',
        plugins: {
          pnpm: pluginPnpm,
        },
        rules: {
          'pnpm/yaml-blank-lines': 'error',
        },
      },
      {
        files: ['pnpm-workspace.yaml'],
        languageOptions: {
          parser: yamlParser,
        },
        name: 'svifty7/pnpm/pnpm-workspace-yaml-sort',
        plugins: {
          yaml: pluginYaml,
        },
        rules: {
          'yaml/sort-keys': [
            'error',
            {
              order: Object.values(pnpmWorkspaceOrder).flat(),
              pathPattern: '^$',
            },
            {
              order: { type: 'asc' },
              pathPattern: '.*',
            },
          ],
        },
      },
    );
  }

  return configs;
}
