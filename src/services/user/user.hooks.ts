import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { accountService, AuthenticationManagementAction } from '../authmanagement/notifier'
import { hooks as feathersAuthenticationManagementHooks } from 'feathers-authentication-management'
import { HookContext } from '@feathersjs/feathers'
import { Application } from '@feathersjs/express'
import crypto from 'crypto'
import commonHooks from 'feathers-hooks-common'

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
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
      (context: HookContext) => {
        accountService(context.app as Application).notifier(
          AuthenticationManagementAction.resendVerifySignup,
          context.result
        )
      }
      // feathersAuthenticationManagementHooks.removeVerification()
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
