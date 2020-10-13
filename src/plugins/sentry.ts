import Vue from 'vue'

import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { Integrations } from '@sentry/tracing'

// if (process.env.NODE_ENV === 'production') {
Sentry.init({
  dsn: LCK_SETTINGS.SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing(),
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
// }
