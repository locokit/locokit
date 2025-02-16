import { describe, it, expect } from 'vitest'
import {
  checkUserHasProfile,
  checkProviderIsInternal,
  checkUserHasAccess,
  checkUserIsAdmin,
} from './profile.hooks'
import { USER_PROFILE } from '@locokit/definitions'
import { HookContext } from '@/declarations'

describe('[hooks] profile', () => {
  describe('checkProviderIsInternal', () => {
    it('return false if external call', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          provider: 'external',
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }

      expect(checkProviderIsInternal(context as HookContext)).toBe(false)
    })
    it('return true if internal call', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.MEMBER,
          },
        },
      }
      expect(checkProviderIsInternal(context as HookContext)).toBe(true)
    })
  })
  describe('checkUserHasProfile', () => {
    it('return true if user has the right profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      const result = checkUserHasProfile([USER_PROFILE.CREATOR], context as HookContext)
      expect(result).toBe(true)
    })
    it('return false if user has not the right profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.MEMBER,
          },
        },
      }
      const result = checkUserHasProfile([USER_PROFILE.CREATOR], context as HookContext)
      expect(result).toBe(false)
    })
    it('return true if user has the ADMIN profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.ADMIN,
          },
        },
      }
      const result = checkUserHasProfile([USER_PROFILE.ADMIN], context as HookContext)
      expect(result).toBe(true)
    })
    it('return false if user has not the ADMIN profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      const result = checkUserHasProfile([USER_PROFILE.ADMIN], context as HookContext)
      expect(result).toBe(false)
    })
  })
  describe('checkUserIsAdmin', () => {
    it('return true if user has the ADMIN profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.ADMIN,
          },
        },
      }
      const result = checkUserIsAdmin(context as HookContext)
      expect(result).toBe(true)
    })
    it('return false if user has not the ADMIN profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      const result = checkUserIsAdmin(context as HookContext)
      expect(result).toBe(false)
    })
  })
  describe('checkUserHasAccess', () => {
    it('return the context if user has the right profile', () => {
      expect.assertions(2)
      const context: Partial<HookContext> = {
        params: {
          provider: 'external',
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      const result = checkUserHasAccess({
        allowedProfile: [USER_PROFILE.CREATOR],
        internalProvider: true,
      })(context as HookContext)
      expect(result).toBeDefined()
      expect(result).toBe(context)
    })
    it('throw an error if user has not the right profile', () => {
      expect.assertions(3)
      const context: Partial<HookContext> = {
        params: {
          provider: 'external',
          user: {
            profile: USER_PROFILE.ADMIN,
          },
        },
      }
      try {
        checkUserHasAccess({
          allowedProfile: [USER_PROFILE.CREATOR],
          internalProvider: true,
        })(context as HookContext)
      } catch (error) {
        expect(error).toBeDefined()
        const errorTyped = error as { code: number; className: string }
        expect(errorTyped.code).toBe(403)
        expect(errorTyped.className).toBe('forbidden')
      }
    })
    it("return the context if it's an internal call", () => {
      expect.assertions(2)
      const context: Partial<HookContext> = {
        params: {},
      }
      const result = checkUserHasAccess({
        allowedProfile: [USER_PROFILE.CREATOR],
        internalProvider: true,
        internalProviderProfileCheck: false,
      })(context as HookContext)
      expect(result).toBeDefined()
      expect(result).toBe(context)
    })
    it('throw an error if internal call and user does not have the right profile', () => {
      expect.assertions(3)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      try {
        checkUserHasAccess({
          allowedProfile: [USER_PROFILE.ADMIN],
          internalProvider: true,
          internalProviderProfileCheck: 'IF_USER_PROVIDED',
        })(context as HookContext)
      } catch (error) {
        expect(error).toBeDefined()
        const errorTyped = error as { code: number; className: string }
        expect(errorTyped.code).toBe(403)
        expect(errorTyped.className).toBe('forbidden')
      }
    })
    it('return the context if user has the right profile', () => {
      expect.assertions(2)
      const context: Partial<HookContext> = {
        params: {
          provider: 'external',
          user: {
            profile: USER_PROFILE.ADMIN,
          },
        },
      }
      const result = checkUserHasAccess({
        allowedProfile: [USER_PROFILE.ADMIN],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
      })(context as HookContext)
      expect(result).toBeDefined()
      expect(result).toBe(context)
    })
    it('throw an error if user has not the right profile', () => {
      expect.assertions(3)
      const context: Partial<HookContext> = {
        params: {
          provider: 'external',
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      try {
        checkUserHasAccess({
          allowedProfile: [USER_PROFILE.ADMIN],
          internalProvider: true,
          internalProviderProfileCheck: 'IF_USER_PROVIDED',
        })(context as HookContext)
      } catch (error) {
        expect(error).toBeDefined()
        const errorTyped = error as { code: number; className: string }
        expect(errorTyped.code).toBe(403)
        expect(errorTyped.className).toBe('forbidden')
      }
    })
    it("return the context if it's an internal call", () => {
      expect.assertions(2)
      const context: Partial<HookContext> = {
        params: {},
      }
      const result = checkUserHasAccess({
        allowedProfile: [USER_PROFILE.ADMIN],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
      })(context as HookContext)
      expect(result).toBeDefined()
      expect(result).toBe(context)
    })
    it('throw an error if internal call and user does not have the right profile', () => {
      expect.assertions(3)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      try {
        checkUserHasAccess({
          allowedProfile: [USER_PROFILE.ADMIN],
          internalProvider: true,
          internalProviderProfileCheck: 'IF_USER_PROVIDED',
        })(context as HookContext)
      } catch (error) {
        expect(error).toBeDefined()
        const errorTyped = error as { code: number; className: string }
        expect(errorTyped.code).toBe(403)
        expect(errorTyped.className).toBe('forbidden')
      }
    })
  })
})
