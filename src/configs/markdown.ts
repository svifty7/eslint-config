import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';

import {
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODE,
  GLOB_MARKDOWN_IN_MARKDOWN,
} from '../globs';
import { interopDefault } from '../utils';

import type {
  OptionsComponentExts,
  OptionsFiles,
  TypedFlatConfigItem,
} from '../types';

export async function markdown(
  options: OptionsFiles & OptionsComponentExts = {},
): Promise<TypedFlatConfigItem[]> {
  const { componentExts = [], files = [GLOB_MARKDOWN] } = options;

  const pluginMarkdown = await interopDefault(import('@eslint/markdown'));

  return [
    {
      name: 'svifty7/markdown/setup',
      plugins: {
        markdown: pluginMarkdown,
      },
    },
    {
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      name: 'svifty7/markdown/processor',
      processor: mergeProcessors([
        pluginMarkdown.processors!.markdown,
        processorPassThrough,
      ]),
    },
    {
      files,
      language: 'markdown/gfm',
      name: 'svifty7/markdown/parser',
    },
    {
      files,
      name: 'svifty7/markdown/rules',
      rules: {
        ...pluginMarkdown.configs.recommended.at(0)?.rules,
        'markdown/no-missing-label-refs': 'off',
      },
    },
    {
      files,
      name: 'svifty7/markdown/disables/markdown',
      rules: {
        'command/command': 'off',
        'no-irregular-whitespace': 'off',
        'perfectionist/sort-exports': 'off',
        'perfectionist/sort-imports': 'off',
        'regexp/no-legacy-features': 'off',
        'regexp/no-missing-g-flag': 'off',
        'regexp/no-useless-dollar-replacements': 'off',
        'regexp/no-useless-flag': 'off',
        'style/indent': 'off',
      },
    },
    {
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      name: 'svifty7/markdown/disables/code',
      rules: {
        'antfu/no-top-level-await': 'off',

        'import/newline-after-import': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-labels': 'off',
        'no-lone-blocks': 'off',
        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',

        'node/prefer-global/process': 'off',

        'style/comma-dangle': 'off',
        'style/eol-last': 'off',
        'style/padding-line-between-statements': 'off',

        'ts/consistent-type-imports': 'off',
        'ts/explicit-function-return-type': 'off',
        'ts/no-namespace': 'off',
        'ts/no-redeclare': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-expressions': 'off',
        'ts/no-unused-vars': 'off',
        'ts/no-use-before-define': 'off',

        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ];
}
