const esModules = [
  '@storybook',
  'primevue',
  'monaco-editor-core',
  'ol',
  'vee-validate',
].join('|')
module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',

  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
    'ts',
    'tsx',
  ],

  transform: {
    '<rootDir>/node_modules/vee-validate/dist/rules': 'babel-jest',
    '^.+\\.vue$': 'vue-jest',
    // '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor'
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },

  transformIgnorePatterns: [
    `/node_modules/(?!${esModules})`,
  ],

  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/**/*.stories.js',
    '!src/registerServiceWorker.ts',
    '!src/plugins/*.{js,ts}',
  ],

  moduleNameMapper: {
    '^@/services/lck-api/services$': '<rootDir>/src/services/lck-api/__mocks__/services',
    '^@/services/lck-api$': '<rootDir>/src/services/lck-api/__mocks__/index.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    // non-js files
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss|stylesheet)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(md)$': '<rootDir>/__mocks__/htmlMock.js',
    '\\.mdx': '<rootDir>/__mocks__/fileMock.js',
  },

  snapshotSerializers: [
    'jest-serializer-vue',
  ],

  testMatch: [
    '**/*.spec.(js|jsx|ts|tsx)',
  ],

  testURL: 'http://localhost/',

  globals: {
    'ts-jest': {
      babelConfig: true,
      diagnostics: {
        warnOnly: true,
      },
    },
  },

  setupFiles: [
    '<rootDir>/tests/unit/register-context.js',
    '<rootDir>/tests/unit/setupFiles.js',
    '<rootDir>/.storybook/setupGlobalVars.js',
  ],

  reporters: [
    'default',
    'jest-image-snapshot/src/outdated-snapshot-reporter.js',
  ],
}
