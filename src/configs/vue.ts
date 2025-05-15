import { GLOB_VUE } from '../globs';
import { interopDefault } from '../utils';

import type {
  OptionsFiles,
  OptionsHasTypeScript,
  TypedFlatConfigItem,
} from '../types';

export async function vue(
  options: OptionsHasTypeScript & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_VUE] } = options;

  const [pluginVue, parserVue, pluginVueA11y] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('eslint-plugin-vuejs-accessibility')),
  ] as const);

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      name: 'svifty7/vue/setup',
      plugins: {
        'vue': pluginVue,
        'vue-a11y': pluginVueA11y,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser:
            options.typescript ?
              ((await interopDefault(
                import('@typescript-eslint/parser'),
              )) as any)
            : null,
          sourceType: 'module',
        },
      },
      name: 'svifty7/vue/rules',
      processor: pluginVue.processors['.vue'],
      rules: {
        ...(pluginVue.configs.base.rules as any),

        ...(pluginVue.configs['flat/essential']
          .map((c) => c.rules)
          .reduce((acc, c) => ({ ...acc, ...c }), {}) as any),
        ...(pluginVue.configs['flat/strongly-recommended']
          .map((c) => c.rules)
          .reduce((acc, c) => ({ ...acc, ...c }), {}) as any),
        ...(pluginVue.configs['flat/recommended']
          .map((c) => c.rules)
          .reduce((acc, c) => ({ ...acc, ...c }), {}) as any),

        'antfu/no-top-level-await': 'off',
        'node/prefer-global/process': 'off',
        'ts/explicit-function-return-type': 'off',

        'vue/padding-line-between-tags': [
          'error',
          [
            {
              blankLine: 'always',
              prev: '*',
              next: '*',
            },
          ],
        ],
        'vue/html-self-closing': 'error',
        'vue/html-closing-bracket-spacing': [
          'error',
          {
            startTag: 'never',
            endTag: 'never',
            selfClosingTag: 'always',
          },
        ],
        'vue/max-attributes-per-line': [
          'error',
          {
            singleline: 1,
            multiline: 1,
          },
        ],
        'vue/first-attribute-linebreak': [
          'error',
          {
            singleline: 'ignore',
            multiline: 'below',
          },
        ],
        'vue/attribute-hyphenation': ['error', 'always'],
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/component-api-style': ['error', ['script-setup']],
        'vue/block-lang': [
          'error',
          {
            script: {
              lang: 'ts',
            },
          },
        ],
        'vue/define-props-declaration': ['error', 'type-based'],
        'vue/define-emits-declaration': ['error', 'type-based'],
        'vue/no-ref-object-reactivity-loss': 'warn',
        'vue/match-component-import-name': 'error',
        'vue/no-empty-component-block': 'error',
        'vue/no-multiple-objects-in-class': 'error',
        'vue/no-static-inline-styles': ['error', { allowBinding: true }],
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-useless-mustaches': [
          'error',
          {
            ignoreIncludesComment: true,
            ignoreStringEscape: true,
          },
        ],
        'vue/no-v-text': 'error',
        'vue/prefer-define-options': 'error',
        'vue/require-typed-object-prop': 'error',
        'vue/require-typed-ref': 'error',
        'vue/v-for-delimiter-style': ['error', 'in'],
        'vue/component-name-in-template-casing': [
          'error',
          'kebab-case',
          {
            registeredComponentsOnly: false,
          },
        ],
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { after: true, before: true }],
        'vue/block-spacing': ['error', 'always'],
        'vue/block-tag-newline': [
          'error',
          {
            multiline: 'always',
            singleline: 'always',
          },
        ],
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/html-indent': ['error', 2],
        'vue/html-quotes': ['error', 'double'],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { after: true, before: false }],
        'vue/comma-style': ['error', 'last'],
        'vue/html-comment-content-spacing': [
          'error',
          'always',
          { exceptions: ['-'] },
        ],
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        'vue/object-curly-newline': 'off',
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': [
          'error',
          { allowMultiplePropertiesPerLine: true },
        ],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/require-default-prop': 'error',
        'vue/space-in-parens': ['error', 'never'],
        'vue/template-curly-spacing': 'error',

        'vue/no-restricted-v-bind': 'off',
        'vue/one-component-per-file': 'off',
        'vue/prefer-separate-static-class': 'off',
        'vue/valid-v-slot': 'off',

        'vue/require-explicit-emits': 'error',
        'vue/custom-event-name-casing': ['error', 'kebab-case'],

        'vue-a11y/anchor-has-content': 'off',
        'vue-a11y/click-events-have-key-events': 'off',
        'vue-a11y/mouse-events-have-key-events': 'off',
        'vue-a11y/label-has-for': 'off',
        'vue-a11y/no-autofocus': 'off',
        'vue-a11y/form-control-has-label': 'off',
        'vue-a11y/alt-text': 'error',
        'vue-a11y/aria-props': 'error',
        'vue-a11y/aria-role': 'error',
        'vue-a11y/aria-unsupported-elements': 'error',
        'vue-a11y/heading-has-content': 'error',
        'vue-a11y/iframe-has-title': 'error',
        'vue-a11y/interactive-supports-focus': 'error',
        'vue-a11y/media-has-caption': 'warn',
        'vue-a11y/no-access-key': 'error',
        'vue-a11y/no-aria-hidden-on-focusable': 'error',
        'vue-a11y/no-distracting-elements': 'error',
        'vue-a11y/no-redundant-roles': 'error',
        'vue-a11y/no-role-presentation-on-focusable': 'error',
        'vue-a11y/no-static-element-interactions': 'error',
        'vue-a11y/role-has-required-aria-props': 'error',
        'vue-a11y/tabindex-no-positive': 'warn',
      },
    },
  ];
}
