import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { authManagementSettings, AuthenticationManagementAction } from '../authmanagement/authmanagement.settings'
import { hooks as feathersAuthenticationManagementHooks } from 'feathers-authentication-management'
import { HookContext } from '@feathersjs/feathers'
import { Application } from '@feathersjs/express'
import crypto from 'crypto'
import commonHooks, { iff } from 'feathers-hooks-common'
import { USER_PROFILE } from '@locokit/lck-glossary'

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks

const isUserProfile = (profile: USER_PROFILE) => (context: HookContext) => {
  return context.params.user?.profile === profile
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      commonHooks.iff(
        isUserProfile(USER_PROFILE.SUPERADMIN),
        /**
         * Generate a password randomly
         * Because we don't take in consideration the user password at the creation.
         * It will be defined by the user himself after the signup verification.
         */
        (context: HookContext) => {
          const buf = Buffer.alloc(10)
          const password = crypto.randomFillSync(buf).toString('hex')
          context.data.password = password
          return context
        },
        hashPassword('password'),
        feathersAuthenticationManagementHooks.addVerification()
      ).else(commonHooks.disallow())
    ],
    update: [
      commonHooks.disallow('external')
    ],
    patch: [
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(
          true,
          'email',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        ),
        hashPassword('password')
      )
    ],
    remove: []
  },
  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      /**
       * We don't notify when we are testing.
       */
      iff(
        process.env.NODE_ENV !== 'test',
        (context: HookContext) => {
          authManagementSettings(context.app as Application).notifier(
            AuthenticationManagementAction.sendVerifySignup,
            context.result
          )
        }
      ),
      feathersAuthenticationManagementHooks.removeVerification()
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
