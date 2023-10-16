import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'LocoKit',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v2' }],
    },
  },
  runtimeConfig: {
    public: {
      HOME_BACKGROUND_IMAGE_URL: '/theme/default/img/dog.jpg',
      LOGO_MOBILE: '/theme/default/img/logo-mobile-alt.svg',
      ERROR_BACKGROUND_IMAGE_URL: '/theme/default/img/404_bg.svg',
      PROJECT_NAME: 'LocoKit',
      LOGO_BG_PRIMARY_URL: '/theme/default/img/logo.svg', // can be overridden by NUXT_LOGO_BG_PRIMARY_URL environment variable
    },
  },
  modules: [
    [
      '../src/module',
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
    '@nuxt/devtools',
  ],
  sourcemap: true,
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
})
