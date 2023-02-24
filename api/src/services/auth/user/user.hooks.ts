import { resolveData, validateData } from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import { userCreateResolver, userPatchResolver, userPatchAdminResolver } from './user.resolver'
import { disallow, iff, isProvider } from 'feathers-hooks-common'
import { addVerification } from 'feathers-authentication-management'
import { isAdminProfile } from '../../../hooks/profile.hooks'
import { HookOptions } from '@feathersjs/feathers'
import type { Application, HookContext } from '../../../declarations'
import { UserService } from './user.class'
import { authManagementSettings } from '../authmanagement/authmanagement.settings'
import { userDataValidator, userPatchAdminValidator, userPatchValidator } from './user.schema'

export const hooks: HookOptions<Application, UserService> = {
  around: {
    all: [
      authenticate('api-key', 'jwt'),
      //  resolveAll<HookContext>(userResolvers)
    ],
  },
  before: {
    get: [
      // limit the get to the current logged user
      // unless it's an admin
      validateData(userDataValidator),
    ],
    find: [
      // need to be admin to make queries on some fields
      // otherwise, could search on "username"
      // need to return only "username" for non admin users
      validateData(userDataValidator),
    ],
    create: [
      /**
       * We disable the creation of user
       * from external calls and user not admin
       */
      validateData(userDataValidator),
      iff((context: HookContext) => {
        return isProvider('external')(context) && !isAdminProfile(context)
      }, disallow()).else(addVerification('auth-management'), resolveData(userCreateResolver)),
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
        iff(isAdminProfile, validateData(userPatchAdminValidator)).else(
          validateData(userPatchValidator),
          resolveData(userPatchResolver),
        ),
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
        authManagementSettings(context.app as Application).notifier(
          'sendVerifySignup',
          context.result,
        )
      },
    ],
  },
}
