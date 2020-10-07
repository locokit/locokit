import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import i18n from './plugins/i18n'
import './plugins/primevue'
import './plugins/sentry'

import { reAuthenticate } from './store/auth'

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
