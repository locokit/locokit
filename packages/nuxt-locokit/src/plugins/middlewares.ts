import globalMiddleware from '../middleware/global'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('lck-global', globalMiddleware, { global: true })
})
