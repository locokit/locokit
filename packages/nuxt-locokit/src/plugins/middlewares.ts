import globalMiddleware from '../middleware/global'
import { addRouteMiddleware, defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('lck-global', globalMiddleware, { global: true })
})
