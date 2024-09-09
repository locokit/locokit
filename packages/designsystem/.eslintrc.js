require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['standard-with-typescript', 'plugin:vue/vue3-essential', 'plugin:vue/vue3-recommended', '@vue/typescript/recommended', 'prettier', 'plugin:storybook/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: [
    'vite.config.ts',
    '.eslintrc.js',
    'tailwind.config.js',
    'postcss.config.js',
    'dist',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    'no-case-declarations': 'off',
    'prettier/prettier': 'error',
  },
}
