// import { isAfter, isValid } from 'date-fns'
import { defineNuxtPlugin } from '#app'
import { setupVeeValidate } from '@locokit/designsystem'

export default defineNuxtPlugin(() => {
  setupVeeValidate()
})
