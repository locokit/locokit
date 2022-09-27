import { RouteLocationNormalized } from 'vue-router'
import { useStoreAuth } from '../store/auth'

/**
 * Check that the next route need to be "anonymous"
 * and check that the user is not authent.
 *
 * Then, let the router pass, or abort the navigation
 */
export default function anonymousMiddleware (to: RouteLocationNormalized, from: RouteLocationNormalized): void {
  const storeAuth = useStoreAuth()

  const needAnonymous: boolean = to.meta.anonymous as boolean
  const isAuthenticated = storeAuth.isAuthenticated

  if (needAnonymous && isAuthenticated) {
    abortNavigation(new Error('Route is only available for anonymous users.'))
  }
}
