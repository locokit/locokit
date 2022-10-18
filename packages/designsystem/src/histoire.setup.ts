import { defineSetupVue3 } from '@histoire/plugin-vue'
import { definePluginI18n } from '../plugins/i18n'
import { definePluginPrimeHistoire } from '../plugins/primevue'

import './index.scss'
import '../../../packages/nuxt-locokit/src/styles/index.scss'
import '../plugins/vee-validate'

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
  // Prime plugin
  definePluginPrimeHistoire(app)
  definePluginI18n(app)

  app.directive('focus', {
    mounted(el: HTMLElement) {
      el.focus()
    },
  })
})
