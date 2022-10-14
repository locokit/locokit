import { resolveAll } from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import { usersResolvers } from './users.resolver'
import {
  disallow,
  iff,
  isProvider,
  preventChanges,
} from 'feathers-hooks-common'
import { addVerification } from 'feathers-authentication-management'
import { isAdminProfile } from '../../hooks/profile.hooks'
import { HookOptions } from '@feathersjs/feathers'
import type { Application, HookContext } from '../../declarations'
import { UsersService } from './users.service'
import { authManagementSettings } from '../authmanagement/authmanagement.settings'

export const hooks: HookOptions<Application, UsersService> = {
  around: {
    all: [authenticate('api-key', 'jwt'), resolveAll(usersResolvers)],
  },
  before: {
    create: [
      /**
       * We disable the creation of user
       * from external calls and users not admin
       */
      iff((context: HookContext) => {
        return isProvider('external')(context) && !isAdminProfile(context)
      }, disallow()).else(addVerification('auth-management')),
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
        function preventChangesAccordingProfile(
          context: HookContext,
        ): HookContext {
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
       * Users not admin can't remove users
       */
      iff(!isAdminProfile, disallow()),
    ],
  },
  after: {
    create: [
      /**
       * We don't notify when we are testing.
       */
      // iff(process.env.NODE_ENV !== 'test',
      (context: HookContext) => {
        console.log('after create')
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        authManagementSettings(context.app as Application).notifier(
          'sendVerifySignup',
          context.result,
        )
      },
      // ),
    ],
  },
}
