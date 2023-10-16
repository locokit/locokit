// import { isAfter, isValid } from 'date-fns'
import { defineNuxtPlugin } from '#app'
import { setupVeeValidate } from '@locokit/designsystem'
import { i18n } from './i18n'

export default defineNuxtPlugin(() => {
  setupVeeValidate(i18n)
})
