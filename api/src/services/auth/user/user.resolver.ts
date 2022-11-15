/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { resolve } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import type { HookContext } from '../../../declarations'
import type { UserData, UserPatch, UserResult, UserQuery } from './user.schema'
import {
  userDataSchema,
  userPatchSchema,
  userResultSchema,
  userQuerySchema,
} from './user.schema'
import { generatePassword } from '../../../utils/password'

// Resolver for the basic data model (e.g. creating new entries)
export const userDataResolver = resolve<UserData, HookContext>({
  schema: userDataSchema,
  validate: 'before',
  properties: {
    /**
     * We clean the email
     * from spaces and uppercase
     * before inserting data in db.
     */
    email: async (email) => {
      return email?.trim().toLowerCase()
    },
    /**
     * When a user is created,
     * we init the password with a random one
     * respecting password policy.
     */
    password: async (_password, data, context) => {
      const p = generatePassword(context.app.get('settings').passwordPolicy)
      return await passwordHash({ strategy: 'local' })(p, data, context)
    },

    resetExpires: async (resetExpires) => {
      if (typeof resetExpires === 'number') {
        return new Date(resetExpires).toISOString()
      }
    },
    verifyExpires: async (verifyExpires) => {
      if (typeof verifyExpires === 'number') {
        return new Date(verifyExpires).toISOString()
      }
    },

    verifyChanges: async (verifyChanges) => {
      if (typeof verifyChanges === 'string') {
        return JSON.parse(verifyChanges)
      }
    },
  },
})

// Resolver for making partial updates
export const userPatchResolver = resolve<UserPatch, HookContext>({
  schema: userPatchSchema,
  validate: 'before',
  properties: {
    /**
     * We clean the email
     * from spaces and uppercase
     * before inserting data in db.
     */
    email: async (email) => {
      return email?.trim().toLowerCase()
    },
    resetExpires: async (resetExpires) => {
      if (typeof resetExpires === 'number') {
        return new Date(resetExpires).toISOString()
      }
    },
    verifyExpires: async (verifyExpires) => {
      if (typeof verifyExpires === 'number') {
        return new Date(verifyExpires).toISOString()
      }
    },
  },
})

// Resolver for the data that is being returned
export const userResultResolver = resolve<UserResult, HookContext>({
  schema: userResultSchema,
  validate: false,
  properties: {
    verifyChanges: async (verifyChanges) => {
      if (typeof verifyChanges === 'string') {
        return JSON.parse(verifyChanges)
      }
    },
  },
})

// Resolver for the "safe" version that external clients are allowed to see
export const userDispatchResolver = resolve<UserResult, HookContext>({
  schema: userResultSchema,
  validate: false,
  properties: {
    // The password should never be visible externally
    password: async () => undefined,
  },
})

// Resolver for allowed query properties
export const userQueryResolver = resolve<UserQuery, HookContext>({
  schema: userQuerySchema,
  validate: 'before',
  properties: {
    // If there is a user (e.g. with authentication), they are only allowed to see their own data
    id: async (value, _user, context) => {
      if (context.params.user) {
        return context.params.user.id
      }

      return value
    },
  },
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const userResolvers = {
  result: userResultResolver,
  dispatch: userDispatchResolver,
  data: {
    create: userDataResolver,
    update: userDataResolver,
    patch: userPatchResolver,
  },
  query: userQueryResolver,
}
