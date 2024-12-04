import { TAILWIND_COLORS } from '@locokit/definitions'
import Aura from '@primevue/themes/aura'
import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import './index.css'

import { definePreset } from '@primevue/themes'
import { createI18n } from 'vue-i18n'

import en from '@locokit/locales/en.json'
import fr from '@locokit/locales/fr.json'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en,
    fr,
  },
})

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ['autodocs'],
}

const LocoKitVuePreset = definePreset(Aura, {
  semantic: TAILWIND_COLORS,
})

setup((app) => {
  app.use(PrimeVue, {
    theme: {
      preset: LocoKitVuePreset,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
  })
  app.use(ToastService)
  app.use(i18n)
})

export default preview
