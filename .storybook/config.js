import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { addDecorator } from '@storybook/vue';
import '../src/plugins/element'
import ThemeWrapper from './ThemeWrapper.vue'
import i18n from '../src/i18n.ts'

Vue.component('theme-wrapper', ThemeWrapper)

addDecorator(() => ({
  template: '<theme-wrapper><story></story></theme-wrapper>'
}))

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('../src/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'fr',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'fr',
  messages: loadLocaleMessages()
})

addDecorator(() => ({
  template: '<story/>',
  i18n,
}));
