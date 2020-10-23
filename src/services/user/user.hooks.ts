import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { accountService, AuthenticationManagementAction } from '../authmanagement/notifier'
import { hooks as feathersAuthenticationManagementHooks } from 'feathers-authentication-management'
import { HookContext } from '@feathersjs/feathers'
import { Application } from '@feathersjs/express'

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      hashPassword('password'),
      feathersAuthenticationManagementHooks.addVerification()
    ],
    update: [hashPassword('password')],
    patch: [hashPassword('password')],
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
