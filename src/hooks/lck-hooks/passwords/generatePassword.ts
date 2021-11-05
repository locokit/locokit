import makeDebug from 'debug'
import { getItems } from 'feathers-hooks-common'
import { Hook, HookContext } from '@feathersjs/feathers'
import PasswordValidator from 'password-validator'
import passwordGenerator from 'password-generator'
import { createPasswordValidator, PasswordValidatorRules } from './createPasswordValidator'

const debug = makeDebug('generatePassword')

let passwordValidator: PasswordValidator

/**
 * This hook enforce the password policy.
 * Based on your Feathers configuration, in the authentication
 */
export function generatePassword (): Hook {
  return async function (hook: HookContext) {
    if (hook.type !== 'before') {
      throw new Error('The \'generatePassword\' hook should only be used as a \'before\' hook.')
    }
    /**
     * If no validator exist, we create one
     */
    const passwordPolicy: PasswordValidatorRules = hook.app.get('authentication').passwordPolicy
    if (!passwordValidator) {
      passwordValidator = createPasswordValidator(passwordPolicy)
    }
    const user = getItems(hook)
    let generatedPassword = ''
    const randomLength = Math.floor(Math.random() * (passwordPolicy.maxLength - passwordPolicy.minLength)) + passwordPolicy.minLength
    while (!passwordValidator.validate(generatedPassword)) {
      generatedPassword = passwordGenerator(randomLength, false, /[\w\d\?\ \-~!@#${}]/)
      debug('new password generated', generatedPassword)
    }
    user.password = generatedPassword

    return hook
  }
}
