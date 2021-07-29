import feathers from '@feathersjs/feathers'
import { ROUTES_NAMES } from '@/router/paths'
import { authState, logout } from '@/store/auth'
import { vueInstance } from '@/main'

/**
 * Log out the user and redirect him to the home page.
 */
export const logOutAndRedirect = async () => {
  // Log out
  await logout().finally(() => {
    // Redirect to the login page and saving the 'from' page to redirect the user after he has logged in
    if (vueInstance) {
      vueInstance.$router.push({
        name: ROUTES_NAMES.HOME,
        query: {
          redirectTo: vueInstance.$route.fullPath,
        },
      })
    }
  })
}

/**
 * Display a confirmation dialog if the token is expired to inform the user and to redirect him if desired.
 * @param context The feather request context
 */
export const manageExpiredToken = (context: feathers.HookContext) => {
  if (
    context.error.code === 401 &&
    context.error.data?.name === 'TokenExpiredError' &&
    authState.data.isAuthenticated &&
    vueInstance
  ) {
    // Display a confirmation dialog
    vueInstance.$confirm.require({
      header: vueInstance.$t('error.expiredToken.header'),
      message: vueInstance.$t('error.expiredToken.message'),
      acceptLabel: vueInstance.$t('error.expiredToken.accept'),
      rejectLabel: vueInstance.$t('error.expiredToken.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: logOutAndRedirect,
    })
  }
  return context
}
