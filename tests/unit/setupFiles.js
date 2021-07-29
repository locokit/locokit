import 'jest-canvas-mock'
require('jest-fetch-mock').enableMocks()

// Mock internal modules in all tests
jest.mock('@/main', () => ({}))
