import { defineNuxtConfig } from 'nuxt/config'
import LocoKitModule from '..'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Locokit',
    },
  },
  runtimeConfig: {
    public: {
      HOME_BACKGROUND_IMAGE_URL: '/theme/default/img/dog.jpg',
      ERROR_BACKGROUND_IMAGE_URL: '/theme/default/img/404_bg.svg',
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
