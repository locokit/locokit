import { App } from 'vue'
import { createI18n } from 'vue-i18n'

import en from '../src/locales/en.json'
import fr from '../src/locales/fr.json'

export function definePluginI18n(app: App): void {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      en,
      fr,
    },
  })

  app.use(i18n)
}
