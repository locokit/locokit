import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { Integrations } from '@sentry/apm'
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import i18n from './plugins/i18n'
import { reAuthenticate } from './store/auth'

import 'primevue/resources/primevue.min.css' // core css
import 'primeicons/primeicons.css' // icons
import 'primeflex/primeflex.css'
import './styles/v-logistique/theme.css' // theme
import './styles/v-logistique/overwrite.css' // theme

Sentry.init({
  dsn: LCK_SETTINGS.SENTRY_DSN,
  integrations: [
    new Integrations.Tracing(),
    new VueIntegration({
      Vue,
      tracing: true,
      tracingOptions: {
        trackComponents: true,
        timeout: 100,
        hooks: ['create', 'mount', 'update', 'destroy']
      }
    })
  ],
  tracesSampleRate: 1.0 // Be sure to lower this in production
})

Vue.config.productionTip = false

async function boot () {
  // first, try to reauthent the user,
  // this allow the app to keep the actual route if authenticated
  await reAuthenticate()

  new Vue({
    router,
    i18n,
    render: h => h(App)
  }).$mount('#app')
}

boot()
