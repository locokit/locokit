import { RouteLocationNormalized } from 'vue-router'
// import { abortNavigation } from '#app/composables/router'
import { ROUTES_NAMES, ROUTES_PATH } from '../paths'
import { useStoreAuth } from '../stores/auth'
import { sdkClient } from '../services/api'
import { navigateTo, abortNavigation } from '#imports'

export async function checkUserLogIn() {
  console.log('checkUserLogIn')
  try {
    const result = await sdkClient.reAuthenticate()
    return result.user
  } catch (error) {
    console.warn(error)
    return null
  }
}

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
  return true
}

// Todo: Handle a la mano needAnonymous (particular case of auth only)

// /**
//  * Global middleware to manage anonymous/protected routes
//  *
//  * According to logged/anonymous user, and route meta info,
//  * we let the router pass or redirect the user to another route
//  *
//  */
// async function globalMiddleware(
//   to: RouteLocationNormalized,
//   _from: RouteLocationNormalized,
// ) {
//   const authStore = useStoreAuth()
//
//   if (!authStore.isAuthenticated) {
//     // Check if current user is still connected
//     await authStore.reAuthenticate()
//   }
//
//   // To handle children routes (to get meta from parents), Vuejs recommend to use to.matched
//   // @see: https://github.com/vuejs/vue-router/issues/704
//   const needAuthentication: boolean = to.matched.some((m) => m.meta.protected)
//   const needAnonymous: boolean = to.matched.some((m) => m.meta.anonymous)
//
//   const isAuthenticated = authStore.isAuthenticated
//   // const userProfile = storeAuth?.user?.profile
//   console.log('Test')
//
//   // TODO : manage user profile for admin routes
//   // const userGroupsRole = storeAuth?.groups[0].aclset?.ugh_role
//   // const userGroupsRole = storeAuth?.user?.groups
//   // const profileAlwaysAuthorized = [USER_PROFILE.SUPERADMIN, USER_PROFILE.ADMIN]
//   // const authorizedRoles = to.matched.length > 0 && to.matched[0].meta.authorizedRoles
//
//   /**
//    * In this first case, according to user and route's meta info,
//    * the path is not available for the current logged/anonymous user
//    */
//   // console.log(needAuthentication, needAnonymous, isAuthenticated)
//   if (!checkPathAvailable(needAuthentication, needAnonymous, isAuthenticated)) {
//     console.log('Lol redirect')
//
//     // abortNavigation()
//     // eslint-disable-next-line @typescript-eslint/return-await
//     // return navigateTo(
//     //   {
//     //     name: ROUTES_NAMES.AUTH.SIGN_IN,
//     //   },
//     //   { redirectCode: 301 },
//     // )
//     // abortNavigation({
//     //   statusCode: 404,
//     //   statusMessage: 'Not connected!',
//     // })
//
//     // } else if (
//     //   !profileAlwaysAuthorized.includes(userProfile) &&
//     //   // Be careful /admin is accessible only with profile Admin - SuperAdmin
//     //   // Todo: so not accessible by any role for now we need to handle workspaceId
//     //   authorizedRoles && !checkProfile(to.params.workspaceId, userGroupsRole, authorizedRoles)
//     // ) {
//     //   next({ path: '/not-found' })
//   }
//   console.log(to)
//
//   // eslint-disable-next-line @typescript-eslint/return-await
//   // return new Promise(() => to)
// }
