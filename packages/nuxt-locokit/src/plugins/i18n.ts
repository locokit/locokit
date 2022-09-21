import { createI18n } from 'vue-i18n'

import en from '../locales/en.json'
import fr from '../locales/fr.json'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[nuxt-locokit][plugin-i18n] Registering plugin...')
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      en,
      fr,
    },
  })

  nuxtApp.vueApp.use(i18n)

  console.log('[nuxt-locokit][plugin-i18n] Registering plugin ok.')
})
