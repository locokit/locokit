import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'

import feathers, { Service } from '@feathersjs/feathers'
import { NotAuthenticated } from '@feathersjs/errors'

import { logOutAndRedirect, manageExpiredToken } from './hooks'
import { vueInstance } from '@/main'
import { ROUTES_NAMES, ROUTES_PATH } from '@/router/paths'
import { authState, logout } from '@/store/auth'

// Mock internal functions

// Variables
const mockConfirmDialogRequire = jest.fn()
const mockServiceFind = jest.fn().mockReturnValue([])

// For vue router
const mockRoutes = [
  {
    path: ROUTES_PATH.ADMIN,
    name: ROUTES_NAMES.ADMIN,
  },
  {
    path: ROUTES_PATH.HOME,
    name: ROUTES_NAMES.HOME,
  },
]
const mockLocalVue = createLocalVue()
mockLocalVue.use(VueRouter)
const mockRouter = new VueRouter({ routes: mockRoutes })

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

jest.mock('@/main', () => ({
  get vueInstance () {
    return {
      $t: (key: string) => key,
      $toast: {
        add: jest.fn(),
      },
      mockLocalVue,
      $router: mockRouter,
      $route: mockRouter.currentRoute,
      $confirm: {
        require: mockConfirmDialogRequire,
      },
    }
  },
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
      authState.data.isAuthenticated = false
    })

    it('display a confirmation dialog if the token has expired for an authenticated user', async () => {
      // Simulate an expired token error
      mockServiceFind.mockRejectedValue(new NotAuthenticated(
        'expired token',
        {
          name: 'TokenExpiredError',
        },
      ))
      // User is authentified
      authState.data.isAuthenticated = true
      try {
        // API call
        expect(await myService.find()).rejects.toThrow()
        fail()
      } catch (_) {
        // Display a confirmation dialog
        expect(mockConfirmDialogRequire).toHaveBeenCalledTimes(1)
        expect(mockConfirmDialogRequire).toHaveBeenCalledWith(expect.objectContaining({
          header: 'error.expiredToken.header',
          message: 'error.expiredToken.message',
          acceptLabel: 'error.expiredToken.accept',
          rejectLabel: 'error.expiredToken.reject',
          icon: 'pi pi-exclamation-triangle',
        }))
      }
    })

    it('do not display the confirmation dialog if the token has expired for a non authenticated user', async () => {
      // Simulate an expired token error
      mockServiceFind.mockRejectedValue(new NotAuthenticated(
        'expired token',
        {
          name: 'TokenExpiredError',
        },
      ))
      try {
        // API call
        await myService.find()
        fail()
      } catch (e) {
        // Do not display a confirmation dialog
        expect(mockConfirmDialogRequire).not.toHaveBeenCalled()
      }
    })

    it('do not display the confirmation dialog if a not authenticated error throws but the token has not expired for an authenticated user', async () => {
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
        // Do not display a confirmation dialog
        expect(mockConfirmDialogRequire).not.toHaveBeenCalled()
      }
    })

    it('log out the authenticated user with the original path in query parameter', async () => {
      // Go to the ADMIN page
      if (vueInstance) vueInstance.$router.push(ROUTES_PATH.ADMIN)
      // Log out the user
      await logOutAndRedirect()
      expect(logout).toHaveBeenCalledTimes(1)
      // Redirect the user to the HOME page and save the ADMIN page path as route query
      expect(vueInstance?.$route.path).toBe(ROUTES_PATH.HOME)
      expect(vueInstance?.$route.query.redirectTo).toBe(ROUTES_PATH.ADMIN)
    })
  })
})
