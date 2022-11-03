import { RouteLocationNormalized } from 'vue-router'
import { ROUTES_PATH } from '../pages/paths'
import { useStoreAuth } from '../stores/auth'
import { navigateTo } from '#imports'

/**
 * Check if the route need authentication and the user is authenticated.
 */
export function checkPathAvailable(
  needAuthentication: boolean,
  needAnonymous: boolean,
  isAuthenticated: boolean,
): boolean {
  if (needAuthentication && needAnonymous) {
    throw new Error(
      'Could not check path if you want the user to be authenticated and guest at the same time.',
    )
  }
  if (needAuthentication && !isAuthenticated) return false
  if (needAnonymous && isAuthenticated) return false
  return true
}

/**
 * Global middleware to manage anonymous/protected routes
 *
 * According to logged/anonymous user, and route meta info,
 * we let the router pass or redirect the user to another route
 *
 */
export default async function globalMiddleware(
  to: RouteLocationNormalized,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  from: RouteLocationNormalized,
): Promise<any> {
  const storeAuth = useStoreAuth()

  // To handle children routes (to get meta from parents), Vuejs recommend to use to.matched
  // @see: https://github.com/vuejs/vue-router/issues/704

  const needAuthentication: boolean = to.matched.some((m) => m.meta.protected)

  const needAnonymous: boolean = to.matched.some((m) => m.meta.anonymous)

  const isAuthenticated = storeAuth.isAuthenticated
  // const userProfile = storeAuth?.user?.profile as USER_PROFILE

  // TODO : manage user profile for admin routes
  // const userGroupsRole = storeAuth?.groups[0].aclset?.ugh_role
  // const userGroupsRole = storeAuth?.user?.groups
  // const profileAlwaysAuthorized = [USER_PROFILE.SUPERADMIN, USER_PROFILE.ADMIN]
  // const authorizedRoles = to.matched.length > 0 && to.matched[0].meta.authorizedRoles

  /**
   * In this first case, according to user and route's meta info,
   * the path is not available for the current logged/anonymous user
   */
  // console.log(needAuthentication, needAnonymous, isAuthenticated)
  if (!checkPathAvailable(needAuthentication, needAnonymous, isAuthenticated)) {
    // console.log(
    //   'navigate to ',
    //   isAuthenticated ? ROUTES.WORKSPACE.HOME : ROUTES.HOME,
    // )
    console.log('Hello')
    await navigateTo({
      path: isAuthenticated ? ROUTES_PATH.WORKSPACE.HOME : ROUTES_PATH.HOME,
    })
    // } else if (
    //   !profileAlwaysAuthorized.includes(userProfile) &&
    //   // Be careful /admin is accessible only with profile Admin - SuperAdmin
    //   // Todo: so not accessible by any role for now we need to handle workspaceId
    //   authorizedRoles && !checkProfile(to.params.workspaceId, userGroupsRole, authorizedRoles)
    // ) {
    //   next({ path: '/not-found' })
  }
}
