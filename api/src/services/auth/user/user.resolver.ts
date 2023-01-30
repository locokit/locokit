/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { resolve, Resolver } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import type { HookContext } from '../../../declarations'
import { UserData, UserPatch, UserResult, UserQuery } from './user.schema'
import { generatePassword } from '../../../utils/password'
import { workspaceDispatchResolver } from '../../workspace/workspace.resolver'

// Resolver for the basic data model (e.g. creating new entries)
export const userDataResolver = resolve<UserData, HookContext>({
  // schema: userDataSchema,
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
  // schema: userPatchSchema,
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
    // resetExpires: async (resetExpires) => {
    //   if (typeof resetExpires === 'number') {
    //     return new Date(resetExpires).toISOString()
    //   }
    // },
    // verifyExpires: async (verifyExpires) => {
    //   if (typeof verifyExpires === 'number') {
    //     return new Date(verifyExpires).toISOString()
    //   }
    // },
  },
})

// Resolver for the data that is being returned
export const userResultResolver = resolve<UserResult, HookContext>({
  // schema: userSchema,
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
export const userDispatchResolver: Resolver<UserResult, HookContext> = resolve<
  UserResult,
  HookContext
>({
  // schema: userSchema,
  validate: false,
  properties: {
    isVerified: async () => undefined,
    createdAt: async () => undefined,
    updatedAt: async () => undefined,
    profile: async () => undefined,
    lastConnection: async () => undefined,
    email: async () => undefined,
    password: async () => undefined,
    verifyChanges: async () => undefined,
    verifyExpires: async () => undefined,
    resetExpires: async () => undefined,
    verifyToken: async () => undefined,
    verifyShortToken: async () => undefined,
    resetToken: async () => undefined,
    resetShortToken: async () => undefined,
    resetAttempts: async () => undefined,
    workspaces: async (workspaces, _data, context) => {
      if (workspaces) {
        return await Promise.all(
          workspaces.map(async (w) => await workspaceDispatchResolver.resolve(w, context)),
        )
      }
    },
  },
})

// Resolver for allowed query properties
export const userQueryResolver = resolve<UserQuery, HookContext>({
  // schema: userQuerySchema,
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
