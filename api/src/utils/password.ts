/**
 * This code is greatly inspired from Luc Claustres
 * from this blog post : https://blog.feathersjs.com/feathersjs-in-production-password-policy-and-rate-limiting-32c9874dc563
 * Big thanks to him.
 */
import { NotAcceptable } from '@feathersjs/errors'
import PasswordValidator from 'password-validator'
import passwordGenerator from 'password-generator'
import { randomInt } from 'node:crypto'

export class PasswordValidatorRules {
  minLength!: number
  maxLength!: number
  uppercase!: boolean
  lowercase!: boolean
  digits!: boolean
  symbols!: boolean
}

export function createPasswordValidator(rules: PasswordValidatorRules): PasswordValidator {
  if (!rules) throw new Error("No password rules. Password validator can't be created")

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
export function generatePassword(passwordPolicy: PasswordValidatorRules): string {
  /**
   * If no validator exist, we create one
   */
  if (!passwordValidator) {
    passwordValidator = createPasswordValidator(passwordPolicy)
  }
  let generatedPassword = ''
  const randomLength = randomInt(passwordPolicy.minLength, passwordPolicy.maxLength)
  while (!passwordValidator.validate(generatedPassword)) {
    generatedPassword = passwordGenerator(randomLength, false, /[\w\d? \-~!@#${}]/)
  }
  return generatedPassword
}

/**
 * Check if a password respect the password policy provided in params.
 */
export function checkPasswordPolicy(
  passwordPolicy: PasswordValidatorRules,
  passwordToCheck: string,
): boolean {
  /**
   * If no validator exist, we create one
   */
  if (!passwordValidator) {
    passwordValidator = createPasswordValidator(passwordPolicy)
  }
  if (!passwordToCheck) throw new NotAcceptable('Please provide a password.')

  const result = passwordValidator.validate(passwordToCheck, {
    list: true,
  }) as string[]

  if (result.length > 0) {
    throw new NotAcceptable('The provided password does not comply to the password policy', {
      failedRules: result,
    })
  }
  return true
}
