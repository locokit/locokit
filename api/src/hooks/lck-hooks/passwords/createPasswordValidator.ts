import PasswordValidator from 'password-validator'

export class PasswordValidatorRules {
  minLength!: number
  maxLength!: number
  uppercase!: boolean
  lowercase!: boolean
  digits!: boolean
  symbols!: boolean
}

export function createPasswordValidator (rules: PasswordValidatorRules): PasswordValidator {
  if (!rules) throw new Error('No password rules. Password validator can\'t be created')

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
