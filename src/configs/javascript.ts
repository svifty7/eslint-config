import type { TypedFlatConfigItem } from '@antfu/eslint-config';

/**
 * Custom JS/TS/import overrides on top of @antfu/eslint-config.
 * Only rules that differ from antfu's defaults.
 */
export function javascript(): TypedFlatConfigItem {
  return {
    name: 'svifty7/javascript/rules',
    rules: {
      'camelcase': 'error',
      'class-methods-use-this': ['error', { enforceForClassFields: false }],
      'consistent-return': 'warn',
      'curly': ['error', 'all'],
      'default-param-last': 'error',
      'guard-for-in': 'error',
      'no-param-reassign': ['error', { props: false }],
      'no-return-assign': 'error',
      'require-await': 'error',
      'arrow-body-style': 'off',
      'no-await-in-loop': 'off',
      'no-bitwise': 'off',
      'no-continue': 'off',
      'no-plusplus': 'off',
      'no-shadow': 'off',
      'no-underscore-dangle': 'off',
      'prefer-promise-reject-errors': 'off',
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true, allowUnboundThis: true }],
    },
  };
}
