import { fileURLToPath } from 'node:url';

import { resolveModule } from 'local-pkg';

import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { BuiltInParserName } from 'prettier';

import {
  GLOB_CSS,
  GLOB_GRAPHQL,
  GLOB_HTML,
  GLOB_LESS,
  GLOB_MARKDOWN,
  GLOB_POSTCSS,
  GLOB_SCSS,
  GLOB_SRC,
  GLOB_SVG,
  GLOB_VUE,
  GLOB_XML,
} from '../globs';
import { interopDefault, parserPlain } from '../utils';

import { StylisticConfigDefaults } from './stylistic';

import type {
  DefaultPrettierConfig,
  PrettierConfig,
  TypedFlatConfigItem,
  XmlPrettierConfig,
} from '../types';

type PrettierOptions = PrettierConfig & {
  parser?: BuiltInParserName | 'xml';
  plugins?: Array<string>;
  [k: string]: unknown | undefined;
};

function mergePrettierOptions(
  options: PrettierOptions,
  overrides: PrettierOptions = {},
): PrettierOptions {
  const config = {
    ...options,
    ...overrides,
    plugins: [...(overrides.plugins || []), ...(options.plugins || [])],
  };

  if (config.parser === 'xml') {
    return {
      parser: config.parser,
      plugins: config.plugins,
      bracketSameLine: config.bracketSameLine,
      printWidth: config.printWidth,
      singleAttributePerLine: config.singleAttributePerLine,
      tabWidth: config.tabWidth,
      xmlQuoteAttributes: config.xmlQuoteAttributes,
      xmlSelfClosingSpace: config.xmlSelfClosingSpace,
      xmlSortAttributesByKey: config.xmlSortAttributesByKey,
      xmlWhitespaceSensitivity: config.xmlWhitespaceSensitivity,
    };
  }

  return config;
}

export async function formatters(
  stylistic: Omit<StylisticCustomizeOptions, 'pluginName'> = {},
): Promise<TypedFlatConfigItem[]> {
  const { indent, quotes, semi } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  };

  const prettierOptions: Required<DefaultPrettierConfig> = {
    semi,
    singleQuote: quotes === 'single',
    tabWidth: typeof indent === 'number' ? indent : 2,
    useTabs: indent === 'tab',
    printWidth: 80,
    quoteProps: 'consistent',
    jsxSingleQuote: false,
    trailingComma: 'all',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'always',
    requirePragma: false,
    insertPragma: false,
    proseWrap: 'preserve',
    htmlWhitespaceSensitivity: 'css',
    vueIndentScriptAndStyle: true,
    endOfLine: 'lf',
    singleAttributePerLine: true,
    objectWrap: 'preserve',
    experimentalTernaries: true,
    experimentalOperatorPosition: 'start',
  };

  const pluginFormat = await interopDefault(import('eslint-plugin-format'));

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'svifty7/formatter/setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  configs.push({
    files: [GLOB_SRC, GLOB_VUE],
    name: 'svifty7/formatter/prettier',
    rules: {
      'format/prettier': ['error', prettierOptions],
    },
  });

  // Styles
  configs.push(
    {
      files: [GLOB_CSS, GLOB_POSTCSS],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'svifty7/formatter/css',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'css',
          }),
        ],
      },
    },
    {
      files: [GLOB_SCSS],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'svifty7/formatter/scss',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'scss',
          }),
        ],
      },
    },
    {
      files: [GLOB_LESS],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'svifty7/formatter/less',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'less',
          }),
        ],
      },
    },
  );

  // HTML
  configs.push({
    files: [GLOB_HTML],
    languageOptions: {
      parser: parserPlain,
    },
    name: 'svifty7/formatter/html',
    rules: {
      'format/prettier': [
        'error',
        mergePrettierOptions(prettierOptions, {
          parser: 'html',
        }),
      ],
    },
  });

  // Markdown
  configs.push({
    files: [GLOB_MARKDOWN],
    languageOptions: {
      parser: parserPlain,
    },
    name: 'svifty7/formatter/markdown',
    rules: {
      'format/prettier': [
        'error',
        mergePrettierOptions(prettierOptions, {
          embeddedLanguageFormatting: 'off',
          parser: 'markdown',
        }),
      ],
    },
  });

  // GraphQL
  configs.push({
    files: [GLOB_GRAPHQL],
    languageOptions: {
      parser: parserPlain,
    },
    name: 'svifty7/formatter/graphql',
    rules: {
      'format/prettier': [
        'error',
        mergePrettierOptions(prettierOptions, {
          parser: 'graphql',
        }),
      ],
    },
  });

  const prettierXmlOptions: Required<XmlPrettierConfig> = {
    xmlQuoteAttributes: 'double',
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: 'ignore',
  };

  const xmlPluginPath = resolveModule('@prettier/plugin-xml', {
    paths: [fileURLToPath(import.meta.url)],
  });

  if (!xmlPluginPath) {
    console.warn(
      '[@svifty7/eslint-config] Failed to resolve @prettier/plugin-xml',
    );
  } else {
    // XML
    configs.push({
      files: [GLOB_XML],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'svifty7/formatter/xml',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(
            { ...prettierXmlOptions, ...prettierOptions },
            {
              parser: 'xml',
              plugins: [xmlPluginPath],
            },
          ),
        ],
      },
    });

    // SVG
    configs.push({
      files: [GLOB_SVG],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'svifty7/formatter/svg',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(
            { ...prettierXmlOptions, ...prettierOptions },
            {
              parser: 'xml',
              plugins: [xmlPluginPath],
            },
          ),
        ],
      },
    });
  }

  return configs;
}
