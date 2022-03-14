module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  coverageReporters: ['lcov', 'text', 'cobertura'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
  ],
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
  testMatch: [
    '**/src/*.test.ts',
    '**/src/**/*.test.ts',
  ],
  testTimeout: 10000,
  testPathIgnorePatterns: ['knexutils'],
}

process.env.LCK_PUBLIC_PORTAL_NAME = 'LCK_PUBLIC_PORTAL_NAME'
