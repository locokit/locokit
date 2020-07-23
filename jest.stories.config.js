const config = require('./jest.config')

config.collectCoverage = false
config.testMatch = [
  '**/tests/unit/*shots.spec.(js|jsx|ts|tsx)'
]

module.exports = config
