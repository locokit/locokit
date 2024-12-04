import { createI18n } from 'vue-i18n'

import en from '@locokit/locales/en.json'
import fr from '@locokit/locales/fr.json'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en,
    fr,
  },
})
