import { createI18n } from 'vue-i18n'

import en from '@locokit/i18n/en.json'
import fr from '@locokit/i18n/fr.json'

import { defineNuxtPlugin } from '#app'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en,
    fr,
  },
})

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[nuxt-locokit][plugin-i18n] Registering plugin...')
  nuxtApp.vueApp.use(i18n)
  console.log('[nuxt-locokit][plugin-i18n] Registering plugin ok.')
})
