/* eslint-disable no-console */
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[nuxt-locokit][plugin-error] Registering plugin...')
  nuxtApp.vueApp.config.errorHandler = (error) => {
    console.error(error)
    // ...
  }
  console.log('[nuxt-locokit][plugin-error] Registering plugin ok.')
})
