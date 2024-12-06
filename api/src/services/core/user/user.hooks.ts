import {
  resolveData,
  resolveQuery,
  validateData,
  validateQuery,
  hooks as schemaHooks,
} from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import {
  userCreateResolver,
  userPatchResolver,
  userPatchAdminResolver,
  userQueryResolver,
  userDispatchResolver,
  userRestrictedDispatchResolver,
} from './user.resolver'
import { disallow, iff, isProvider } from 'feathers-hooks-common'
import { addVerification } from 'feathers-authentication-management'
import { isAdminProfile } from '@/hooks/profile.hooks'
import { HookOptions } from '@feathersjs/feathers'
import type { Application, HookContext } from '@/declarations'
import { UserService } from './user.class'
import { authManagementSettings } from '@/services/auth/authmanagement/authmanagement.settings'
import {
  userDataValidator,
  userPatchAdminValidator,
  userPatchValidator,
  userQueryValidator,
} from './user.schema'
import { SERVICES } from '@locokit/definitions'

export const hooks: HookOptions<Application, UserService> = {
  around: {
    all: [authenticate('api-key', 'jwt')],
    get: [schemaHooks.resolveExternal(userDispatchResolver)],
    find: [schemaHooks.resolveExternal(userRestrictedDispatchResolver)],
    create: [schemaHooks.resolveExternal(userDispatchResolver)],
    update: [schemaHooks.resolveExternal(userDispatchResolver)],
    patch: [schemaHooks.resolveExternal(userDispatchResolver)],
    remove: [schemaHooks.resolveExternal(userDispatchResolver)],
  },
  before: {
    get: [
      iff(
        (context: HookContext) => {
          return isProvider('external')(context) && !isAdminProfile(context)
        },
        validateQuery(userQueryValidator),
        resolveQuery(userQueryResolver),
      ),
      validateQuery(userQueryValidator),
    ],
    find: [
      // need to be admin to make queries on some fields
      // otherwise, could search on "username"
      // need to return only "username" for non admin users
      iff((context: HookContext) => {
        return isProvider('external')(context) && !isAdminProfile(context)
      }, validateQuery(userQueryValidator)),
    ],
    create: [
      /**
       * We disable the creation of user
       * from external calls and user not admin
       */
      iff((context: HookContext) => {
        return isProvider('external')(context) && !isAdminProfile(context)
      }, disallow()).else(
        validateData(userDataValidator),
        addVerification(SERVICES.AUTH_MANAGEMENT),
        resolveData(userCreateResolver),
      ),
    ],
    /**
     * We forbid the update method
     */
    update: [disallow()],
    /**
     * TODO: restrict fields according user profile
     * => prefer using defineAbilities and feathers-casl
     * instead of preventChanges hook
     */
    patch: [
      iff(
        isProvider('external'),
        iff(
          isAdminProfile,
          validateData(userPatchAdminValidator),
          resolveData(userPatchAdminResolver),
        ).else(validateData(userPatchValidator), resolveData(userPatchResolver)),
      ),
      resolveData(userPatchAdminResolver),
    ],
    remove: [
      /**
       * User not admin can't remove user
       */
      iff(!isAdminProfile, disallow()),
    ],
  },
  after: {
    create: [
      /**
       * Notify the user its account has been created
       */
      (context: HookContext) => {
        return authManagementSettings(context.app as Application).notifier(
          'sendVerifySignup',
          context.result,
        )
      },
    ],
  },
}
