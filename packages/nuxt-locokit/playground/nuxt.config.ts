import { defineNuxtConfig } from 'nuxt'
import LocoKitModule from '..'

export default defineNuxtConfig({
  // build: {
  //   transpile: ['vee-validate, @vee-validate/rules'],
  // },
  modules: [
    [
      LocoKitModule,
      {
        submodules: {
          backoffice: {
            enabled: true,
          },
          frontoffice: {
            enabled: true,
          },
        },
      },
    ],
  ],
})
