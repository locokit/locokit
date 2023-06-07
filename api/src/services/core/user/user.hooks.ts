import {
  resolveData,
  resolveExternal,
  resolveQuery,
  validateData,
  validateQuery,
} from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import {
  userCreateResolver,
  userPatchResolver,
  userPatchAdminResolver,
  userQueryResolver,
  userDispatchResolver,
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
    all: [authenticate('api-key', 'jwt'), resolveExternal(userDispatchResolver)],
  },
  before: {
    get: [
      iff((context: HookContext) => {
        return isProvider('external')(context) && !isAdminProfile(context)
      }, validateQuery(userQueryValidator)),
      // limit the get to the current logged user
      // unless it's an admin
      resolveQuery(userQueryResolver),
    ],
    find: [
      // need to be admin to make queries on some fields
      // otherwise, could search on "username"
      // need to return only "username" for non admin users
      iff(
        (context: HookContext) => {
          return isProvider('external')(context) && !isAdminProfile(context)
        },
        // limit the get to the current logged user
        // unless it's an admin
        validateQuery(userQueryValidator),
        resolveQuery(userQueryResolver),
      ),
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        return authManagementSettings(context.app as Application).notifier(
          'sendVerifySignup',
          context.result,
        )
      },
    ],
  },
}
