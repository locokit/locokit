import { USER_PROFILE } from '@locokit/definitions'
import { PredicateFn } from 'feathers-hooks-common'
import { HookContext } from '../declarations'
import { Forbidden } from '@feathersjs/errors'

/**
 * Check if a user profile match a listing of PROFILE
 */
export const isUserProfile =
  (
    profile: Array<keyof typeof USER_PROFILE> | keyof typeof USER_PROFILE,
  ): PredicateFn<HookContext> =>
  (context: HookContext): boolean => {
    const profiles = Array.isArray(profile) ? profile : [profile]
    const includeUserProfile = profiles.includes(
      context.params.user?.profile as keyof typeof USER_PROFILE,
    )
    if (!includeUserProfile) throw new Error('User is not authorized to access this.')
    return true
  }

/**
 * Check if the user has a ADMIN profile
 */
// export const isAdminProfile: PredicateFn = isUserProfile(USER_PROFILE.ADMIN)

export const isAdminProfile = (context: HookContext): boolean => {
  return context.params.user?.profile === USER_PROFILE.ADMIN
}

/**
 * Check if the call is internal and the user is an ADMIN one
 */
export async function isInternalCallOrInternalAndAdminProfile(context: HookContext) {
  /**
   * Let ADMIN user pass
   */
  if (context.params.user?.profile === USER_PROFILE.ADMIN) return context

  /**
   * Let the user pass if it's an internal call
   * and the logged user is an admin one
   */
  if (!context.params.provider) {
    if (!context.params.user || context.params.user.profile === USER_PROFILE.ADMIN) return context
  }

  throw new Forbidden("You can't access this service.")
}
