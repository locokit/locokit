import feathers from '@feathersjs/feathers'
import { authState } from '@/store/auth'

/**
 * Update the auth state if the token is expired to inform the user and to allow him to log in again.
 * @param context The feather request context
 */
export const manageExpiredToken = (context: feathers.HookContext) => {
  if (context.error.code === 401 && context.error.data?.name === 'TokenExpiredError') {
    authState.data.expiredToken = true
  }
  return context
}
