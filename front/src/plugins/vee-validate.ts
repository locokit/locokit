/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { isAfter, isValid } from 'date-fns'
import { extend, configure } from 'vee-validate'
import { email, required, regex, required_if } from 'vee-validate/dist/rules'
import i18n from './i18n'

extend('email', email)
extend('required_if', required_if)
extend('required', required)
extend('regex', regex)

extend('minDate', {
  params: ['fromDate'],
  validate (value: Date, { fromDate }: Record<string, any>) {
    return isAfter(value, fromDate)
  },
})

extend('passwordConfirm', {
  params: ['target'],
  validate (value, { target }: Record<string, any>) {
    return value === target
  },
})

extend('dateValid', {
  validate (value: Date) {
    return isValid(value)
  },
})

extend('reference', {
  validate (value: any) {
    return typeof value === 'object'
  },
})

extend('isFalseOrOtherTrue', {
  params: ['target'],
  validate (value: boolean, { target }: Record<string, any>) {
    return value === false || target === true
  },
})

extend('snakeCase', {
  validate (value: string) {
    return /^[a-z_]+$/.test(value)
  },
})

configure({
  // this will be used to generate messages.
  defaultMessage: (_, values) => {
    // values._field_ = i18n.t(`fields.${field}`)
    return i18n.t(`validations.messages.${values._rule_}`, values) as string
  },
})
