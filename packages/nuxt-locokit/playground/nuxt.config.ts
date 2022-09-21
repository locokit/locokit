import { defineNuxtConfig } from 'nuxt'
import LocoKitModule from '..'

export default defineNuxtConfig({
  modules: [
    [LocoKitModule, {
      submodules: {
        backoffice: {
          enabled: true,
        },
        frontoffice: {
          enabled: true,
        },
      },
    }],
  ],
})
