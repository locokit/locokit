import Vue from 'vue'

import 'primevue/resources/primevue.min.css' // core css
import 'primeicons/primeicons.css' // icons
import 'primeflex/primeflex.css'
import Tooltip from 'primevue/tooltip'
import '@/styles/index.scss'
import ConfirmationService from 'primevue/confirmationservice'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice' // theme

Vue.use(PrimeVue, { ripple: true })
Vue.use(ToastService)
Vue.use(ConfirmationService)
Vue.directive('tooltip', Tooltip)
