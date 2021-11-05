/**
 * This code is greatly inspired from Luc Claustres
 * from this blog post : https://blog.feathersjs.com/feathersjs-in-production-password-policy-and-rate-limiting-32c9874dc563
 * Big thanks to him.
 */
import makeDebug from 'debug'
import { NotAcceptable } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { createPasswordValidator } from './createPasswordValidator'
import PasswordValidator from 'password-validator'

const debug = makeDebug('enforcePasswordPolicy')

let passwordValidator: PasswordValidator

/**
 * This hook enforce the password policy.
 * Based on your Feathers configuration, in the authentication
 */
export function enforcePasswordPolicy (getPassword: (hook: HookContext) => string): Hook {
  return async function (hook: HookContext) {
    debug('entering method')
    if (hook.type !== 'before') {
      throw new Error('The \'enforcePasswordPolicy\' hook should only be used as a \'before\' hook.')
    }
    /**
     * If no validator exist, we create one
     */
    if (!passwordValidator) {
      passwordValidator = createPasswordValidator(hook.app.get('authentication').passwordPolicy)
    }
    const passwordToCheck = getPassword(hook)
    if (passwordToCheck) {
      debug('Enforcing password policy on password', passwordToCheck)
      // First check the clear password
      const result = passwordValidator.validate(passwordToCheck, { list: true }) as string[]
      if (result.length > 0) {
        throw new NotAcceptable('The provided password does not comply to the password policy', { failedRules: result })
      }
    }
    return hook
  }
}
