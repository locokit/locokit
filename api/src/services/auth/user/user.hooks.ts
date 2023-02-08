import { resolveAll, resolveData, validateData } from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import { userResolvers, userCreateResolver } from './user.resolver'
import { disallow, iff, isProvider, preventChanges } from 'feathers-hooks-common'
import { addVerification } from 'feathers-authentication-management'
import { isAdminProfile } from '../../../hooks/profile.hooks'
import { HookOptions } from '@feathersjs/feathers'
import type { Application, HookContext } from '../../../declarations'
import { UserService } from './user.class'
import { authManagementSettings } from '../authmanagement/authmanagement.settings'
import { userDataValidator } from './user.schema'

export const hooks: HookOptions<Application, UserService> = {
  around: {
    all: [
      authenticate('api-key', 'jwt'),
      validateData(userDataValidator),
      resolveAll<HookContext>(userResolvers),
    ],
  },
  before: {
    get: [
      // limit the get to the current logged user
      // unless it's an admin
    ],
    find: [
      // need to be admin to make queries on some fields
      // otherwise, could search on "username"
      // need to return only "username" for non admin users
    ],
    create: [
      /**
       * We disable the creation of user
       * from external calls and user not admin
       */
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
        function preventChangesAccordingProfile(context: HookContext): HookContext {
          const fields = [
            'isVerified',
            'verifyToken',
            'verifyShortToken',
            'verifyExpires',
            'verifyChanges',
            'resetToken',
            'resetShortToken',
            'resetExpires',
            'resetAttempts',
          ]
          if (!isAdminProfile(context)) {
            fields.push(...['email', 'blocked', 'password', 'profile'])
          }

          return preventChanges<HookContext>(true, ...fields)(context)
        },
        // defineAbilitiesIffHook(),
        // authorize({
        //   adapter: 'feathers-objection',
        // }),
      ),
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
