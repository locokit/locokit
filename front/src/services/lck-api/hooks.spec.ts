import feathers, { Service } from '@feathersjs/feathers'
import { NotAuthenticated } from '@feathersjs/errors'

import { manageExpiredToken } from './hooks'
import { authState } from '@/store/auth'

// Mock internal functions

// Variables
const mockConfirmDialogRequire = jest.fn()
const mockServiceFind = jest.fn().mockReturnValue([])

// Functions
jest.mock('@/store/auth.ts', () => ({
  authState: {
    loading: false,
    error: null,
    data: {
      isAuthenticated: false,
      user: null,
      currentGroupId: null,
    },
  },
  logout: jest.fn().mockResolvedValue(1),
}))

describe('Hooks', () => {
  let app: feathers.Application<{}>
  let myService: Service<unknown>

  beforeAll(() => {
    // Create a new plain Feathers application
    app = feathers()

    // Register a dummy custom service
    app.use('/unknown', {
      async find () {
        return mockServiceFind()
      },
    })

    // Register the `manageExpiredToken` hook on that service
    app.service('unknown').hooks({
      error: manageExpiredToken,
    })

    // The dummy service
    myService = app.service('unknown')
  })

  describe('Manage the token expiration', () => {
    beforeEach(() => {
      mockConfirmDialogRequire.mockClear()
      authState.data.expiredToken = false
    })

    it('update the authentication state if the token has expired', async () => {
      // Simulate an expired token error
      mockServiceFind.mockRejectedValue(new NotAuthenticated(
        'expired token',
        {
          name: 'TokenExpiredError',
        },
      ))
      try {
        // API call
        expect(await myService.find()).rejects.toThrow()
        fail()
      } catch (_) {
        // Update the authentification state
        expect(authState.data.expiredToken).toBe(true)
      }
    })

    it('do not update the authentication state if a not authenticated error throws but the token has not expired', async () => {
      // Simulate an expired token error
      mockServiceFind.mockRejectedValue(new NotAuthenticated(
        'need authentication',
      ))
      // User is authentified
      authState.data.isAuthenticated = true
      try {
        // API call
        await myService.find()
        fail()
      } catch (e) {
        // Don't update the authentification state
        expect(authState.data.expiredToken).toBe(false)
      }
    })
  })
})
