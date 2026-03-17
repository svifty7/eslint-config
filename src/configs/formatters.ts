import type { BuiltInParserName, RequiredOptions } from 'prettier';

import type {
  PrettierConfig,
  TypedFlatConfigItem,
  XmlPrettierConfig,
} from '../types';

import { fileURLToPath } from 'node:url';

import { resolveModule } from 'local-pkg';

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
import { ensurePackages, interopDefault, parserPlain } from '../utils';
import { StylisticConfigDefaults } from './stylistic';

type PrettierOptions = Omit<RequiredOptions, 'plugins' | 'parser'> &
  PrettierConfig & {
    parser: BuiltInParserName | 'xml';
    plugins?: Array<string>;
    [k: string]: unknown | undefined;
  };

function mergePrettierOptions(
  options: Partial<PrettierOptions>,
  overrides: Partial<PrettierOptions> = {},
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
      bracketSameLine: false,
      singleAttributePerLine: true,
      xmlQuoteAttributes: config.xmlQuoteAttributes,
      xmlSelfClosingSpace: config.xmlSelfClosingSpace,
      xmlSortAttributesByKey: config.xmlSortAttributesByKey,
      xmlWhitespaceSensitivity: config.xmlWhitespaceSensitivity,
    };
  }

  if (config.plugins && config.plugins.length > 0) {
    return {
      ...config,
      parser: overrides.parser || config.parser || 'typescript',
    };
  }

  return {
    ...config,
    parser: overrides.parser || config.parser || 'typescript',
  };
}

export async function formatters(
  options: {
    prettier?: Partial<PrettierConfig>;
    vue?: boolean;
  } = {},
): Promise<TypedFlatConfigItem[]> {
  const { indent, quotes, semi } = {
    ...StylisticConfigDefaults,
  };

  const { prettier = {}, vue = false } = options;

  const prettierOptions: Partial<PrettierOptions> = {
    semi,
    singleQuote: quotes === 'single',
    tabWidth: 2,
    indent,
    useTabs: false,
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
    parser: 'typescript',
    ...prettier,
  };

  await ensurePackages([
    'prettier',
    'eslint-plugin-format',
    'prettier-plugin-tailwindcss',
  ]);

  const pluginFormat = await interopDefault(import('eslint-plugin-format'));

  const tailwindPluginPath = resolveModule('prettier-plugin-tailwindcss', {
    paths: [fileURLToPath(import.meta.url)],
  });

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'svifty7/formatter/setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  configs.push({
    files: [GLOB_SRC],
    name: 'svifty7/formatter/prettier',
    rules: {
      'format/prettier': [
        'error',
        mergePrettierOptions(prettierOptions, {
          plugins: tailwindPluginPath ? [tailwindPluginPath] : undefined,
        }),
      ],
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
            plugins: tailwindPluginPath ? [tailwindPluginPath] : undefined,
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
          plugins: tailwindPluginPath ? [tailwindPluginPath] : undefined,
        }),
      ],
    },
  });

  if (vue) {
    configs.push({
      files: [GLOB_VUE],
      name: 'svifty7/formatter/vue',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'vue',
            plugins: tailwindPluginPath ? [tailwindPluginPath] : undefined,
          }),
        ],
      },
    });
  }

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

  await ensurePackages(['@prettier/plugin-xml']);

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
