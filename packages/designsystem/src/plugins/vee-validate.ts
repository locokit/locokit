// import { isAfter, isValid } from 'date-fns'
import { configure, defineRule } from 'vee-validate'
import { email, required, regex } from '@vee-validate/rules'
import { i18n } from './i18n'

export function setup() {
  defineRule('email', email)
  // defineRule('required_if', required_if)
  defineRule('required', required)
  defineRule('regex', regex)

  // extend('minDate', {
  //   params: ['fromDate'],
  //   validate (value: Date, { fromDate }: Record<string, any>) {
  //     return isAfter(value, fromDate)
  //   },
  // })

  // Todo: Find a fix or fix it
  defineRule('confirmed', (value, [target], ctx) => {
    // To interpret string keypath: "toto.ro" -> toto.ro
    const result = target.split('.').reduce((acc: never, current: string) => {
      return acc[current]
    }, ctx.form)
    return value === result
  })

  // defineRule('dateValid', {
  //   validate(value: Date) {
  //     return isValid(value)
  //   },
  // })

  // defineRule('reference', {
  //   validate(value: any) {
  //     return typeof value === 'object'
  //   },
  // })
  //
  // defineRule('isFalseOrOtherTrue', {
  //   params: ['target'],
  //   validate(value: boolean, { target }: Record<string, any>) {
  //     return !value || target === true
  //   },
  // })
  //
  // defineRule('snakeCase', {
  //   validate(value: string) {
  //     return /^[a-z_]+$/.test(value)
  //   },
  // })

  configure({
    bails: false,
    validateOnBlur: true,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
    generateMessage: (context) => {
      // console.log(context)
      const field = i18n.global.t(
        `validations.fieldNames.${context.field}`,
        context.field,
      )
      // console.log(field)
      return i18n.global.t(
        `validations.messages.${context.rule?.name as string}`,
        { field },
      ) as string
    },
  })
}
