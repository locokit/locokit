/**
 * This code is greatly inspired from Luc Claustres
 * from this blog post : https://blog.feathersjs.com/feathersjs-in-production-password-policy-and-rate-limiting-32c9874dc563
 * Big thanks to him.
 */
import { NotAcceptable } from '@feathersjs/errors'
import PasswordValidator from 'password-validator'
import { HookContext } from '../../declarations'

export class PasswordValidatorRules {
  minLength!: number
  maxLength!: number
  uppercase!: boolean
  lowercase!: boolean
  digits!: boolean
  symbols!: boolean
}

function createPasswordValidator(
  rules: PasswordValidatorRules,
): PasswordValidator {
  if (!rules)
    throw new Error("No password rules. Password validator can't be created")

  const { minLength, maxLength, uppercase, lowercase, digits, symbols } = rules

  const validator = new PasswordValidator()
  if (minLength) validator.is().min(minLength)
  if (maxLength) validator.is().max(maxLength)
  if (uppercase) validator.has().uppercase()
  if (lowercase) validator.has().lowercase()
  if (digits) validator.has().digits()
  if (symbols) validator.has().symbols()

  return validator
}

let passwordValidator: PasswordValidator

/**
 * This hook enforce the password policy.
 * Based on your Feathers configuration, in the authentication
 */
export function enforcePasswordPolicy(
  getPassword: (context: HookContext) => string,
): (context: HookContext) => HookContext {
  return function (context: HookContext) {
    if (context.type !== 'before') {
      throw new Error(
        "The 'enforcePasswordPolicy' hook should only be used as a 'before' hook.",
      )
    }
    /**
     * If no validator exist, we create one
     */
    if (!passwordValidator) {
      passwordValidator = createPasswordValidator(
        context.app.get('settings').passwordPolicy,
      )
    }
    const passwordToCheck = getPassword(context)
    if (passwordToCheck) {
      // First check the clear password
      const result = passwordValidator.validate(passwordToCheck, {
        list: true,
      }) as string[]
      if (result.length > 0) {
        throw new NotAcceptable(
          'The provided password does not comply to the password policy',
          { failedRules: result },
        )
      }
    }
    return context
  }
}
