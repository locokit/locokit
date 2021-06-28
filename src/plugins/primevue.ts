import Vue from 'vue'

import 'primevue/resources/themes/saga-blue/theme.css' // core css
import 'primevue/resources/primevue.min.css' // core css
import 'primeicons/primeicons.css' // icons
import 'primeflex/primeflex.css'
import '@/styles/override.scss'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice' // theme

Vue.use(PrimeVue, { ripple: true })
Vue.use(ToastService)
