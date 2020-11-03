module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  coverageReporters: ['json', 'lcov', 'text'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.ts',
    '!src/declarations.d.ts'
  ],
  testMatch: [
    '**/src/*.test.ts',
    '**/src/**/*.test.ts'
  ]
}
