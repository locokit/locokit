import { describe, it, expect } from 'vitest'
import {
  checkInternalCallOrSpecificProfile,
  isAdminProfile,
  isInternalCallOrInternalAndAdminProfile,
  isUserProfile,
} from './profile.hooks'
import { USER_PROFILE } from '@locokit/definitions'
import { HookContext } from '@/declarations'
import { error } from 'console'

describe('[hooks] profile', () => {
  describe('isUserProfile', () => {
    it('return true if user has the right profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      const result = isUserProfile([USER_PROFILE.CREATOR])(context as HookContext)
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
      const result = isUserProfile([USER_PROFILE.CREATOR])(context as HookContext)
      expect(result).toBe(false)
    })
  })
  describe('isAdminProfile', () => {
    it('return true if user has the right profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.ADMIN,
          },
        },
      }
      const result = isAdminProfile(context as HookContext)
      expect(result).toBe(true)
    })
    it('return false if user has not the right profile', () => {
      expect.assertions(1)
      const context: Partial<HookContext> = {
        params: {
          user: {
            profile: USER_PROFILE.CREATOR,
          },
        },
      }
      const result = isAdminProfile(context as HookContext)
      expect(result).toBe(false)
    })
  })
  describe('checkInternalCallOrSpecificProfile', () => {
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
      const result = checkInternalCallOrSpecificProfile([USER_PROFILE.CREATOR])(
        context as HookContext,
      )
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
        checkInternalCallOrSpecificProfile([USER_PROFILE.CREATOR])(context as HookContext)
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
      const result = checkInternalCallOrSpecificProfile([USER_PROFILE.CREATOR])(
        context as HookContext,
      )
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
        checkInternalCallOrSpecificProfile([USER_PROFILE.ADMIN])(context as HookContext)
      } catch (error) {
        expect(error).toBeDefined()
        const errorTyped = error as { code: number; className: string }
        expect(errorTyped.code).toBe(403)
        expect(errorTyped.className).toBe('forbidden')
      }
    })
  })
  describe('isInternalCallOrInternalAndAdminProfile', () => {
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
      const result = isInternalCallOrInternalAndAdminProfile(context as HookContext)
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
        isInternalCallOrInternalAndAdminProfile(context as HookContext)
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
      const result = isInternalCallOrInternalAndAdminProfile(context as HookContext)
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
        isInternalCallOrInternalAndAdminProfile(context as HookContext)
      } catch (error) {
        expect(error).toBeDefined()
        const errorTyped = error as { code: number; className: string }
        expect(errorTyped.code).toBe(403)
        expect(errorTyped.className).toBe('forbidden')
      }
    })
  })
})
