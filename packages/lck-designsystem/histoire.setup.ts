import { defineSetupVue3 } from '@histoire/plugin-vue'
import { definePluginPrimeHistoire } from './plugins/primevue'
import './src/index.css'

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
  // Prime plugin
  definePluginPrimeHistoire(app)
})
