import { defineSetupVue3 } from '@histoire/plugin-vue'
import { i18n } from './plugins/i18n'
import { definePluginPrime } from './plugins/primevue'

import './styles/index.css'
import { setup as setupVeeValidate } from './plugins/vee-validate'
import { I18n } from 'vue-i18n'

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
  definePluginPrime(app)
  app.use(i18n)
  setupVeeValidate(i18n as I18n)

  app.directive('focus', {
    mounted(el: HTMLElement) {
      el.focus()
    },
  })
})
