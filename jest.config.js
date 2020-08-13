module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.ts',
    '!src/declarations.d.ts',
  ],
};
