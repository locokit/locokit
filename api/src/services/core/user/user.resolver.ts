/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { resolve, Resolver } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import type { HookContext } from '../../../declarations'
import { UserPatch, UserResult, UserQuery, UserPatchAdmin } from './user.schema'
import { generatePassword } from '../../../utils/password'
import { workspaceDispatchResolver } from '@/services/core/workspace/core-workspace.resolver'
import { USER_PROFILE } from '@locokit/definitions'

// Resolver for the basic data model (e.g. creating new entries)
export const userCreateResolver = resolve<UserResult, HookContext>({
  /**
   * We allow the profile to be set
   * only for admin users creating another user
   * or for internal calls
   */
  profile: async (profile, _data, context) => {
    return profile ?? USER_PROFILE.MEMBER
  },
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
   *
   * We don't take the password given by the user
   */
  password: async (_password, data, context) => {
    const p = generatePassword(context.app.get('settings').passwordPolicy)
    return await passwordHash({ strategy: 'local' })(p, data, context)
  },

  resetExpires: async (resetExpires) => {
    if (typeof resetExpires === 'number') {
      return new Date(resetExpires).toISOString()
    } else return resetExpires
  },
  verifyExpires: async (verifyExpires) => {
    if (typeof verifyExpires === 'number') {
      return new Date(verifyExpires).toISOString()
    } else return verifyExpires
  },

  verifyChanges: async (verifyChanges) => {
    if (typeof verifyChanges === 'string') {
      return JSON.parse(verifyChanges)
    } else return verifyChanges
  },

  createdAt: async (createdAt) => {
    let stringToConvert: string | number | undefined = createdAt
    if (!stringToConvert) stringToConvert = Date.now()
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return createdAt
  },

  updatedAt: async (updatedAt) => {
    let stringToConvert: string | number | undefined = updatedAt
    if (!stringToConvert) stringToConvert = Date.now()
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return updatedAt
  },

  lastConnection: async (lastConnection) => {
    const stringToConvert: string | number | undefined = lastConnection
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return lastConnection
  },
})

// Resolver for making partial updates
export const userPatchResolver = resolve<UserPatch, HookContext>({})
// Resolver for making partial updates
export const userPatchAdminResolver = resolve<UserPatchAdmin, HookContext>({
  /**
   * We clean the email
   * from spaces and uppercase
   * before inserting data in db.
   */
  // email: async (email) => {
  //   return email?.trim().toLowerCase()
  // },
  resetExpires: async (resetExpires) => {
    if (typeof resetExpires === 'number') {
      return new Date(resetExpires).toISOString()
    } else return resetExpires
  },
  verifyExpires: async (verifyExpires) => {
    if (typeof verifyExpires === 'number') {
      return new Date(verifyExpires).toISOString()
    } else return verifyExpires
  },

  verifyChanges: async (verifyChanges) => {
    if (typeof verifyChanges === 'string') {
      return JSON.parse(verifyChanges)
    } else return verifyChanges
  },

  updatedAt: async (updatedAt) => {
    let stringToConvert: string | number | undefined = updatedAt
    if (!stringToConvert) stringToConvert = Date.now()
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return updatedAt
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
      } else return verifyChanges
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
    blocked: async () => undefined,
    avatarURL: async () => undefined,
    createdAt: async () => undefined,
    updatedAt: async () => undefined,
    profile: async () => undefined,
    firstname: async () => undefined,
    lastname: async () => undefined,
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
    create: userCreateResolver,
    update: resolve<any, HookContext>({}),
    patch: userPatchResolver,
  },
  query: userQueryResolver,
}