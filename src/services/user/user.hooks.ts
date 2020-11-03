import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { authManagementSettings, AuthenticationManagementAction } from '../authmanagement/authmanagement.settings'
import { hooks as feathersAuthenticationManagementHooks } from 'feathers-authentication-management'
import { HookContext } from '@feathersjs/feathers'
import { Application } from '@feathersjs/express'
import commonHooks from 'feathers-hooks-common'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { enforcePasswordPolicy } from '../../hooks/lck-hooks/passwords/enforcePasswordPolicy'
import { generatePassword } from '../../hooks/lck-hooks/passwords/generatePassword'

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks

const isUserProfile = (profile: USER_PROFILE) => (context: HookContext) => {
  return context.params.user?.profile === profile
}

const getPassword = (hook: HookContext) => hook.data.password

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      /**
       * We disable the creation of user for users not SUPERADMIN
       * or for manipulating this service from the code (provider !== external)
       */
      commonHooks.iff(
        commonHooks.isProvider('external') && !isUserProfile(USER_PROFILE.SUPERADMIN),
        commonHooks.disallow()
      ).else(
        /**
         * Generate a password randomly
         * Because we don't take in consideration the user password at the creation.
         * It will be defined by the user himself after the signup verification.
         */
        generatePassword(),
        enforcePasswordPolicy(getPassword),
        hashPassword('password'),
        feathersAuthenticationManagementHooks.addVerification()
      )
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
      commonHooks.iff(
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
