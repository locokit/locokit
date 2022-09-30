require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'standard-with-typescript',
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['prettier'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-case-declarations': 'off',
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/*.{spec,test}.{j,t}s?(x)'],
      env: {
        jest: true,
        node: true,
      },
    },
  ],
}
