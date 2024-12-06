import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import { TAILWIND_COLORS } from '@locokit/definitions'

import App from './App.vue'
import router from './router'
import { i18n } from './plugins/i18n'

function boot() {
  const app = createApp(App)

  app.use(i18n)

  app.use(createPinia())
  app.use(router)
  app.use(PrimeVue, {
    theme: {
      preset: definePreset(Aura, {
        semantic: TAILWIND_COLORS,
      }),
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
  })

  app.mount('#app')
}

boot()
