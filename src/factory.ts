import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from '@antfu/eslint-config';
import type { Linter } from 'eslint';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';

import { antfu } from '@antfu/eslint-config';

import {
  imports,
  javascript,
  node,
  perfectionist,
  stylistic,
  typescript,
  unicorn,
  vue,
} from './configs';

/**
 * Construct an array of ESLint flat config items.
 * Thin wrapper around @antfu/eslint-config with svifty7-specific overrides.
 *
 * @param options - All @antfu/eslint-config options, passed through as-is.
 * @param userConfigs - Additional user configs appended at the end.
 */
export function configure(
  options: OptionsConfig & TypedFlatConfigItem = {},
  ...userConfigs: Awaitable<
    TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem> {
  return antfu(
    options,
    javascript(),
    typescript(),
    imports(),
    perfectionist(),
    node(),
    stylistic(),
    unicorn(),
    vue(),
    ...userConfigs,
  );
}
