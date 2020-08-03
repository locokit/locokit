import Vue from 'vue'
import { addDecorator, addParameters } from '@storybook/vue';

import ThemeWrapper from './ThemeWrapper.vue'
import i18n from '../src/plugins/i18n'
import '../src/plugins/primevue'
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

/**
 * Use of a special wrapper to add Tailwind CSS
 */
Vue.component('theme-wrapper', ThemeWrapper)
addDecorator(() => ({
  template: '<theme-wrapper><story></story></theme-wrapper>'
}))

/**
 * Add i18n for storybook
 */
addDecorator(() => ({
  template: '<story/>',
  i18n,
}));
