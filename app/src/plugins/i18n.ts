import { createI18n } from 'vue-i18n'
import en from '@/locales/en'
import fr from '@/locales/fr'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en,
    fr,
  },
  datetimeFormats: {
    en: {
      dateShort: {
        year: 'numeric', month: '2-digit', day: '2-digit',
      },
    },
    fr: {
      dateShort: {
        year: 'numeric', month: '2-digit', day: '2-digit',
      },
    },
  },
})
