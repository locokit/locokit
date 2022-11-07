import { defineNuxtConfig } from 'nuxt/config'
import LocoKitModule from '..'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      HOME_BACKGROUND_IMAGE_URL: '/theme/default/img/dog.jpg',
      LOGO_BG_PRIMARY_URL: '/theme/default/img/logo.svg', // can be overridden by NUXT_LOGO_BG_PRIMARY_URL environment variable
    },
  },
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
