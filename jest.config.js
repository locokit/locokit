module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  coverageReporters: ['lcov', 'text', 'cobertura'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts'
  ],
  testMatch: [
    '**/src/*.test.ts',
    '**/src/**/*.test.ts'
  ]
}
