import { defineSetupVue3 } from '@histoire/plugin-vue'
import { definePluginI18n } from './plugins/i18n'
import { definePluginPrimeHistoire } from './plugins/primevue'

import './tailwind.css'
import '../../nuxt-locokit/src/runtime/styles/index.scss'
import '../../nuxt-locokit/src/runtime/styles/global.scss'
import '../../nuxt-locokit/src/runtime/styles/theme.css'
import { setup as setupVeeValidate} from './plugins/vee-validate'

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
  // Prime plugin
  definePluginPrimeHistoire(app)
  definePluginI18n(app)
  setupVeeValidate()

  app.directive('focus', {
    mounted(el: HTMLElement) {
      el.focus()
    },
  })
})
