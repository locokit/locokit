/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { isAfter, isValid } from 'date-fns'
import { extend, configure } from 'vee-validate'
import { email, required } from 'vee-validate/dist/rules'
import i18n from './i18n'

extend('email', email)
extend('required', required)

extend('minDate', {
  params: ['fromDate'],
  validate (value: Date, { fromDate }: Record<string, any>) {
    return isAfter(value, fromDate)
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
