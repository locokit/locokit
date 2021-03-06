import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import i18n from './plugins/i18n'
import './plugins/primevue'
import './plugins/sentry'
import './plugins/casl'
import './plugins/vee-validate'

import { reAuthenticate } from './store/auth'
import { loadApplicationSettings } from './store/app'

Vue.config.productionTip = false

async function boot () {
  // load application settings
  await loadApplicationSettings()
  // try to reauthent the user,
  // this allow the app to keep the actual route if authenticated
  await reAuthenticate()

  new Vue({
    router,
    i18n,
    render: h => h(App),
  }).$mount('#app')

  // To handle focus, use `v-focus`
  Vue.directive('focus', {
    inserted: function (el) {
      el.focus()
    },
  })
}

boot()
