import { Preview, setup } from '@storybook/vue3'

import { i18n } from '../src/plugins/i18n'
import { definePluginPrime } from '../src/plugins/primevue'
import { setup as setupVeeValidate } from '../src/plugins/vee-validate'
import { I18n } from 'vue-i18n'

import '../src/styles/index.css'

setup((app) => {
  definePluginPrime(app)
  app.use(i18n)
  setupVeeValidate(i18n as I18n)

  app.directive('focus', {
    mounted(el: HTMLElement) {
      el.focus()
    },
  })
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  //👇 Enables auto-generated documentation for all stories
  // tags: ['autodocs'],
}

export default preview
