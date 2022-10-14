import { resolve } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import type { HookContext } from '../../declarations'
import type {
  UsersData,
  UsersPatch,
  UsersResult,
  UsersQuery,
} from './users.schema'
import {
  usersDataSchema,
  usersPatchSchema,
  usersResultSchema,
  usersQuerySchema,
} from './users.schema'
import { generatePassword } from '../../utils/password'

// Resolver for the basic data model (e.g. creating new entries)
export const usersDataResolver = resolve<UsersData, HookContext>({
  schema: usersDataSchema,
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
  },
})

// Resolver for making partial updates
export const usersPatchResolver = resolve<UsersPatch, HookContext>({
  schema: usersPatchSchema,
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
     * Generate a password randomly
     * respecting password policy.
     * Because we don't take in consideration the user password at the creation.
     * It will be defined by the user himself after the signup verification.
     */
    password: async (_password, data, context) => {
      const p = generatePassword(context.app.get('settings').passwordPolicy)
      return await passwordHash({ strategy: 'local' })(p, data, context)
    },
  },
})

// Resolver for the data that is being returned
export const usersResultResolver = resolve<UsersResult, HookContext>({
  schema: usersResultSchema,
  validate: false,
  properties: {},
})

// Resolver for the "safe" version that external clients are allowed to see
export const usersDispatchResolver = resolve<UsersResult, HookContext>({
  schema: usersResultSchema,
  validate: false,
  properties: {
    // The password should never be visible externally
    password: async () => undefined,
  },
})

// Resolver for allowed query properties
export const usersQueryResolver = resolve<UsersQuery, HookContext>({
  schema: usersQuerySchema,
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
export const usersResolvers = {
  result: usersResultResolver,
  dispatch: usersDispatchResolver,
  data: {
    create: usersDataResolver,
    update: usersDataResolver,
    patch: usersPatchResolver,
  },
  query: usersQueryResolver,
}
