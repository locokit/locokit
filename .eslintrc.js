module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
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
