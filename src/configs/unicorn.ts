import type { TypedFlatConfigItem } from '@antfu/eslint-config';

export function unicorn(): TypedFlatConfigItem {
  return {
    name: 'svifty7/unicorn/rules',
    rules: {
      'unicorn/consistent-empty-array-spread': 'error',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-instanceof-builtins': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/prefer-dom-node-text-content': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/throw-new-error': 'error',
      'unicorn/no-nested-ternary': 'error',
      'unicorn/empty-brace-spaces': 'error',
      'unicorn/template-indent': 'error',
    },
  };
}
