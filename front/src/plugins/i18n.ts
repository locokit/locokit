import Vue from 'vue'
import VueI18n, { LocaleMessages } from 'vue-i18n'

Vue.use(VueI18n)

export const browserLang = () => {
  const userLang = navigator.language || 'en-US'
  if (userLang.match('fr')) return 'fr-FR'
  if (userLang.match('en')) return 'en-US'
  // fallback if navigator language is not supported
  return 'en-US'
}

function loadLocaleMessages (): LocaleMessages {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: LocaleMessages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export default new VueI18n({
  locale: browserLang(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US',
  messages: loadLocaleMessages(),
})
