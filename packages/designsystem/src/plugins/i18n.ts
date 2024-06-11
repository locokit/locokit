import { createI18n } from 'vue-i18n'

import en from '@locokit/i18n/en.json'
import fr from '@locokit/i18n/fr.json'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en,
    fr,
  },
})
