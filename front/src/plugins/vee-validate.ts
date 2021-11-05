/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { isAfter, isValid } from 'date-fns'
import { extend, configure } from 'vee-validate'
import { email, required, regex } from 'vee-validate/dist/rules'
import i18n from './i18n'

extend('email', email)
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

configure({
  // this will be used to generate messages.
  defaultMessage: (_, values) => {
    // values._field_ = i18n.t(`fields.${field}`)
    return i18n.t(`validations.messages.${values._rule_}`, values) as string
  },
})
