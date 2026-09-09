import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import eslintPerfectionist from 'eslint-plugin-perfectionist'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import pluginVue from 'eslint-plugin-vue'
import pluginJs from '@eslint/js'
import globals from 'globals'

export default defineConfigWithVueTs(
  {
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    ...pluginJs.configs.recommended,
  },

  eslintPluginUnicorn.configs['recommended'],
  // tseslint.configs.recommendedTypeChecked,
  ...pluginVue.configs['flat/essential'],
  eslintPerfectionist.configs['recommended-line-length'],
  vueTsConfigs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        IS_WL: 'readonly',
        BASEAPP: 'readonly',
        dataLayer: 'readonly',
        fastspring: 'readonly',
        ga: 'readonly',
        turnstile: 'readonly',
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-unsafe-call': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],

      'perfectionist/sort-interfaces': [
        'error',
        { partitionByComment: true, partitionByNewLine: true },
      ],
      'perfectionist/sort-modules': ['error', { type: 'unsorted' }],
      'perfectionist/sort-object-types': [
        'off',
        { partitionByComment: true, partitionByNewLine: true },
      ],
      'perfectionist/sort-objects': ['off', { partitionByComment: true, partitionByNewLine: true }],

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/name-replacements': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/prefer-minimal-ternary': 'off',
      'unicorn/prefer-else-if': 'off',
      'unicorn/no-computed-property-existence-check': 'off',
      'unicorn/no-unreadable-for-of-expression': 'off',
      'unicorn/no-for-each': 'off',
      'unicorn/max-nested-calls': ['error', { max: 5 }],
      'unicorn/prefer-await': 'warn',
      'unicorn/prefer-top-level-await': 'warn',
      'unicorn/prefer-number-coercion': 'warn',
      'unicorn/require-array-sort-compare': 'warn',

      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/multi-word-component-names': 'off',
    },
  },

  eslintConfigPrettier,
)
