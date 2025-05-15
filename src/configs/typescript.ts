import { GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs';
import { pluginAntfu } from '../plugins';
import { interopDefault, renameRules } from '../utils';

import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsProjectType,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem,
} from '../types';

export async function typescript(
  options: OptionsFiles
    & OptionsComponentExts
    & OptionsTypeScriptWithTypes
    & OptionsTypeScriptParserOptions
    & OptionsProjectType = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    overridesTypeAware = {},
    parserOptions = {},
    type = 'app',
  } = options;

  const filePatterns = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map((ext) => `**/*.${ext}`),
  ];

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
  const ignoresTypeAware = options.ignoresTypeAware ?? [`${GLOB_MARKDOWN}/**`];
  const tsconfigPath = options?.tsconfigPath ? options.tsconfigPath : undefined;
  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/promise-function-async': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/return-await': ['error', 'in-try-catch'],
    'ts/strict-boolean-expressions': [
      'error',
      { allowNullableBoolean: true, allowNullableObject: true },
    ],
    'ts/switch-exhaustiveness-check': 'error',
    'ts/unbound-method': 'error',
  };

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const);

  function makeParser(
    typeAware: boolean,
    files: string[],
    ignores?: string[],
  ): TypedFlatConfigItem {
    return {
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: 'module',
          ...(typeAware ?
            {
              projectService: {
                allowDefaultProject: ['./*.js'],
                defaultProject: tsconfigPath,
              },
              tsconfigRootDir: process.cwd(),
            }
          : {}),
          ...(parserOptions as any),
        },
      },
      name: `svifty7/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
    };
  }

  return [
    {
      name: 'svifty7/typescript/setup',
      plugins: {
        antfu: pluginAntfu,
        ts: pluginTs as any,
      },
    },
    ...(isTypeAware ?
      [
        makeParser(false, filePatterns),
        makeParser(true, filesTypeAware, ignoresTypeAware),
      ]
    : [makeParser(false, filePatterns)]),
    {
      files: filePatterns,
      name: 'svifty7/typescript/rules',
      rules: {
        ...renameRules(
          pluginTs.configs['eslint-recommended'].overrides![0].rules!,
          { '@typescript-eslint': 'ts' },
        ),
        ...renameRules(pluginTs.configs.strict.rules!, {
          '@typescript-eslint': 'ts',
        }),
        'constructor-super': 'off', // ts(2335) & ts(2377)
        'getter-return': 'off', // ts(2378)
        'valid-typeof': 'off', // ts(2367)
        'no-const-assign': 'off', // ts(2588)
        'no-dupe-args': 'off', // ts(2300)
        'no-dupe-class-members': 'off', // ts(2393) & ts(2300)
        'no-dupe-keys': 'off', // ts(1117)
        'no-func-assign': 'off', // ts(2539)
        'no-import-assign': 'off', // ts(2539) & ts(2540)
        'no-obj-calls': 'off', // ts(2349)
        'no-redeclare': 'off', // ts(2451)
        'no-setter-return': 'off', // ts(2408)
        'no-this-before-super': 'off', // ts(2376)
        'no-undef': 'off', // ts(2304)
        'no-unreachable': 'off', // ts(7027)
        'no-unsafe-negation': 'off', // ts(2365) & ts(2360) & ts(2358)
        'no-shadow': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'no-var': 'error', // ts transpiles let/const to var, so no need for vars any more
        'prefer-const': 'error', // ts provides better types with const
        'prefer-rest-params': 'error', // ts provides better types with rest args over arguments
        'prefer-spread': 'error', // ts transpiles spread to apply, so no need for manual apply
        'ts/explicit-function-return-type': 'off',
        'ts/no-non-null-assertion': 'off',
        'ts/no-invalid-void-type': 'off',
        'ts/no-useless-constructor': 'off',
        'ts/triple-slash-reference': 'off',

        'ts/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
            'ts-expect-error': 'allow-with-description',
          },
        ],
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        'ts/no-dupe-class-members': 'error',
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
        'ts/no-import-type-side-effects': 'error',
        'ts/no-redeclare': ['error', { builtinGlobals: false }],
        'ts/no-require-imports': 'error',
        'ts/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'ts/no-wrapper-object-types': 'error',

        'ts/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: false,
            prefer: 'type-imports',
          },
        ],
        'ts/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            vars: 'all',
            varsIgnorePattern: '^_',
            caughtErrors: 'none',
          },
        ],
        'ts/no-shadow': 'error',
        'ts/no-explicit-any': 'off',
        'ts/no-use-before-define': [
          'error',
          {
            classes: false,
            functions: false,
            enums: false,
            typedefs: false,
            ignoreTypeReferences: true,
          },
        ],
        'ts/consistent-type-assertions': 'error',
        'ts/unified-signatures': 'off',
        'ts/no-extraneous-class': 'error',
        'ts/no-unsafe-function-type': 'error',
        'ts/prefer-literal-enum-member': 'error',
        'ts/no-dynamic-delete': 'error',

        ...(type === 'lib' ?
          {
            'ts/explicit-function-return-type': [
              'error',
              {
                allowExpressions: true,
                allowHigherOrderFunctions: true,
                allowIIFEs: true,
              },
            ],
          }
        : {}),
      },
    },
    ...(isTypeAware ?
      [
        {
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'svifty7/typescript/rules-type-aware',
          rules: {
            ...typeAwareRules,
            ...overridesTypeAware,
          },
        },
      ]
    : []),
  ];
}
