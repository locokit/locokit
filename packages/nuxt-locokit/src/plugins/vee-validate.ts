// import { isAfter, isValid } from 'date-fns'
import { configure, defineRule } from 'vee-validate'
import { email, required, regex } from '@vee-validate/rules'
import { defineNuxtPlugin } from '#app'
import { i18n } from './i18n'

export default defineNuxtPlugin((_nuxtApp) => {
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
    return value === ctx.form[target]
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
})
