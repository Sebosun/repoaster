import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
    { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
    {
        plugins: { unicorn: eslintPluginUnicorn },
        rules: {
            'unicorn/no-array-for-each': 'error', // I hate for each
            'unicorn/no-array-reduce': 'error', // I hate reduce
            'unicorn/no-await-expression-member': 'error', // unreadable
            'unicorn/no-await-in-promise-methods': 'error', // why would you even
            'unicorn/no-invalid-fetch-options': 'error',
            'unicorn/no-invalid-remove-event-listener': 'error',
            'unicorn/no-keyword-prefix': ["error", { "checkProperties": true, "onlyCamelCase": true }],
            'unicorn/no-lonely-if': 'error',
            'unicorn/no-named-default': 'error',
            'unicorn/no-negation-in-equality-check': 'error',
            'unicorn/no-nested-ternary': 'error',
            /* 'unicorn/no-null': 'error', -- To think over https://github.com/sindresorhus/meta/discussions/7 */
            'unicorn/no-typeof-undefined': 'error',
            'unicorn/no-this-assignment': 'error',
            'unicorn/no-unnecessary-array-flat-depth': 'error',
            'unicorn/no-unnecessary-await': 'error',
            'unicorn/no-unreadable-array-destructuring': 'error',
            'unicorn/no-unreadable-iife': 'error',
            'unicorn/no-useless-fallback-in-spread': 'error',
            'unicorn/no-useless-spread': 'error',
            'unicorn/no-useless-length-check': 'error',
            'unicorn/no-zero-fractions': 'error',
            'unicorn/numeric-separators-style': 'error',
            'unicorn/prefer-array-find': 'warn',
            'unicorn/prefer-array-flat': 'warn',
            'unicorn/prefer-array-flat-map': 'warn',
            'unicorn/prefer-array-index-of': 'warn',
            'unicorn/prefer-array-some': 'warn',
            'unicorn/prefer-at': 'warn',
            'unicorn/prefer-date-now': 'warn',
            'unicorn/prefer-default-parameters': 'warn',
            'unicorn/prefer-dom-node-text-content': 'warn',
            'unicorn/prefer-export-from': 'warn',
            'unicorn/prefer-global-this': 'warn'
        }
    },
    tseslint.configs.recommended,
]);
