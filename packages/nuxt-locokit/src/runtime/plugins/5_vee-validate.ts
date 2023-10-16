// import { isAfter, isValid } from 'date-fns'
import { setupVeeValidate } from '@locokit/designsystem'
import { i18n } from './3_i18n'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  setupVeeValidate(i18n)
})
