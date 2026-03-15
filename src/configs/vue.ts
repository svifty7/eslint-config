import type { TypedFlatConfigItem } from '@antfu/eslint-config';

import { GLOB_VUE } from '@antfu/eslint-config';

/**
 * Vue-specific overrides on top of @antfu/eslint-config.
 * Only rules that are unique to svifty7 or differ from antfu's defaults.
 */
export function vue(): TypedFlatConfigItem[] {
  return [
    {
      name: 'svifty7/vue/rules',
      files: [GLOB_VUE],
      rules: {
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
        'vue/brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'vue/html-indent': ['error', 2, {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: false,
          ignores: [],
        }],
        'vue/html-quotes': ['error', 'double'],
        'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': ['error', { after: true, before: false }],
        'vue/comma-style': ['error', 'last'],
        'vue/html-comment-content-spacing': ['error', 'always', { exceptions: ['-'] }],
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        'vue/object-curly-newline': 'off',
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
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
        'vue/custom-event-name-casing': [
          'error',
          'kebab-case',
          {
            ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'],
          },
        ],
      },
    },
    {
      name: 'svifty7/vue/disables/stylistic',
      files: [GLOB_VUE],
      rules: {
        'style/indent': 'off',
        'style/indent-binary-ops': 'off',
      },
    },
    {
      name: 'svifty7/vue-a11y/rules',
      files: [GLOB_VUE],
      rules: {
        // Essential a11y rules enabled
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
        'vue-a11y/role-has-required-aria-props': 'error',
        'vue-a11y/tabindex-no-positive': 'warn',

        // Disabled — too strict for most projects
        'vue-a11y/anchor-has-content': 'off',
        'vue-a11y/click-events-have-key-events': 'off',
        'vue-a11y/mouse-events-have-key-events': 'off',
        'vue-a11y/label-has-for': 'off',
        'vue-a11y/no-autofocus': 'off',
        'vue-a11y/form-control-has-label': 'off',
        'vue-a11y/no-static-element-interactions': 'off',
      },
    },
  ];
}
