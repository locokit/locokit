import components from '../components'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[nuxt-locokit][plugin-locokit] Registering components...')
  for (const name in components) {
    console.log('[nuxt-locokit][plugin-locokit] Registering component ' + name + '...')
    nuxtApp.vueApp.component(name, {
      // extend the original component
      extends: components[name],
    })
  }
  console.log('[nuxt-locokit][plugin-locokit] Registering components ok.')
})
