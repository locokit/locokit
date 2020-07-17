import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { Integrations } from '@sentry/apm'
import Vue from 'vue'
import '@/plugins/element'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import i18n from './plugins/i18n'
import { reAuthenticate } from './store/auth'

Sentry.init({
  dsn: 'https://c66594db39164ca7831994d0ea68d117@o421199.ingest.sentry.io/5340581',
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
