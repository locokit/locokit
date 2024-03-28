module.exports = {
  root: true,
  extends: ['prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: ['dist'],
  plugins: ['prettier', '@typescript-eslint'],
}
