import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'

import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import { TAILWIND_COLORS } from '@locokit/definitions'

import App from './App.vue'
import router from './router'
import { useStoreAuth } from './stores/auth'

import { i18n } from './plugins/i18n'

async function boot() {
  const app = createApp(App)

  app.config.globalProperties.$isDevEnv = import.meta.env.DEV

  app.use(i18n)
  app.use(createHead())
  app.use(createPinia())
  app.use(router)
  app.use(PrimeVue, {
    theme: {
      preset: definePreset(Aura, {
        semantic: TAILWIND_COLORS,
        components: {
          paginator: {
            nav: {
              button: {
                width: '2.25rem',
                height: '2.25rem',
                selected: {
                  background: '{primary.color}',
                  color: '{surface.0}',
                },
              },
            },
          },
        },
      }),
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
  })
  app.use(ConfirmationService)
  app.use(ToastService)

  /**
   * Code needed for focus directive in PrimeVue
   */
  app.directive('focus', {
    mounted(el: HTMLElement) {
      el.focus()
    },
  })

  /**
   * Re authent user before router guards
   */
  const { reAuthenticate } = useStoreAuth()
  await reAuthenticate()

  app.mount('#app')
}

boot()
