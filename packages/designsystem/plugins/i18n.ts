import { App } from 'vue'
import { createI18n } from 'vue-i18n'

import en from '@locokit/i18n/en.json'
import fr from '@locokit/i18n/fr.json'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en: {
      ...en,
      // components: {
      //   ...en.components,
      //   login: {
      //     ...en.components.login,
      //     email: 'pouet',
      //   },
      // },
    },
    fr,
  },
})

export function definePluginI18n(app: App): void {
  app.use(i18n)
}
