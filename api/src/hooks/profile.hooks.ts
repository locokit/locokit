import { USER_PROFILE } from '@locokit/definitions'
import { HookFunction, SyncPredicateFn } from 'feathers-hooks-common'
import { HookContext } from '../declarations'
import { Forbidden } from '@feathersjs/errors'

/**
 * Check if a user profile match a listing of PROFILE
 */
export const isUserProfile =
  (
    profile: Array<keyof typeof USER_PROFILE> | keyof typeof USER_PROFILE,
  ): SyncPredicateFn<HookContext> =>
  (context: HookContext): boolean => {
    const profiles = Array.isArray(profile) ? profile : [profile]
    return profiles.includes(context.params.user?.profile as keyof typeof USER_PROFILE)
  }

/**
 * Check if the user has a ADMIN profile
 */
export const isAdminProfile = (context: HookContext): boolean => {
  return isUserProfile(USER_PROFILE.ADMIN)(context)
}

/**
 * Let internal calls pass OR user with specific profile
 */
export const checkInternalCallOrSpecificProfile =
  (
    profile: Array<keyof typeof USER_PROFILE> | keyof typeof USER_PROFILE = [USER_PROFILE.ADMIN],
  ): HookFunction<HookContext> =>
  (context: HookContext): HookContext => {
    const hasSpecificProfile = isUserProfile(profile)(context)
    if (hasSpecificProfile) return context

    if (!context.params.provider) {
      if (!context.params.user || context.params.user.profile === USER_PROFILE.ADMIN) return context
    }

    throw new Forbidden("You can't access this service.")
  }

/**
 * Check if the call is internal and the user is an ADMIN one
 */
export function isInternalCallOrInternalAndAdminProfile(context: HookContext) {
  return checkInternalCallOrSpecificProfile([USER_PROFILE.ADMIN])(context)
}
