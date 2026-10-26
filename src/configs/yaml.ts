import type { TypedFlatConfigItem } from '../types';

import { GLOB_YAML } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function yaml(): Promise<TypedFlatConfigItem[]> {
  await ensurePackages(['eslint-plugin-yml', 'yaml-eslint-parser']);

  const [pluginYaml, parserYaml] = await Promise.all([
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('yaml-eslint-parser')),
  ] as const);

  return [
    {
      name: 'svifty7/yaml/setup',
      plugins: {
        yaml: pluginYaml,
      },
    },
    {
      files: [GLOB_YAML],
      languageOptions: {
        parser: parserYaml,
      },
      name: 'svifty7/yaml/rules',
      rules: {
        'style/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/no-multiple-empty-lines': [
          'error',
          { max: 1, maxBOF: 0, maxEOF: 0 },
        ],
        'yaml/plain-scalar': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        'yaml/block-mapping-question-indicator-newline': 'error',
        'yaml/block-sequence-hyphen-indicator-newline': 'error',
        'yaml/flow-mapping-curly-newline': 'error',
        'yaml/flow-mapping-curly-spacing': 'error',
        'yaml/flow-sequence-bracket-newline': 'error',
        'yaml/flow-sequence-bracket-spacing': 'error',
        'yaml/indent': ['error', 2],
        'yaml/key-spacing': 'error',
        'yaml/no-tab-indent': 'error',
        'yaml/quotes': [
          'error',
          {
            avoidEscape: true,
            prefer: 'single',
          },
        ],
        'yaml/spaced-comment': 'error',
      },
    },
  ];
}
