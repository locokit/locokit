const config = require('./jest.config')

config.collectCoverage = false
config.testMatch = [
  '**/src/**/*.spec.(js|jsx|ts|tsx)'
]

module.exports = config
