import Vue from 'vue'
import { addDecorator, addParameters } from '@storybook/vue';

require('isomorphic-fetch');

import ThemeWrapper from './ThemeWrapper.vue'
import i18n from '../src/plugins/i18n'
import '../src/plugins/primevue'
import { DocsPage, DocsContainer } from '@storybook/addon-docs'
import { lckServicesDecorator } from '../src/services/lck-api/__mocks__/services'

i18n.locale = 'en'
i18n.fallbackLocale = 'en'

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

/**
 * Use of a special wrapper to add local styles
 */
Vue.component('theme-wrapper', ThemeWrapper)

const getTheme = () => ({
  template: '<theme-wrapper><story></story></theme-wrapper>'
})

/**
 * Add i18n for storybook
 */
const getI18n = () => ({
  template: '<story/>',
  i18n,
})

/**
 * Add lckServicesDecorator for mocking lck services
 */

export const decorators = [
  getTheme,
  getI18n,
  lckServicesDecorator,
]
