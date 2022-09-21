import { resolve } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import type { HookContext } from '../declarations'
import type {
  UsersData,
  UsersPatch,
  UsersResult,
  UsersQuery,
} from '../schemas/users.schema'
import {
  usersDataSchema,
  usersPatchSchema,
  usersResultSchema,
  usersQuerySchema,
} from '../schemas/users.schema'

// Resolver for the basic data model (e.g. creating new entries)
export const usersDataResolver = resolve<UsersData, HookContext>({
  schema: usersDataSchema,
  validate: 'before',
  properties: {
    password: passwordHash({ strategy: 'local' }),
  },
})

// Resolver for making partial updates
export const usersPatchResolver = resolve<UsersPatch, HookContext>({
  schema: usersPatchSchema,
  validate: 'before',
  properties: {},
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
    id: async (value, user, context) => {
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
