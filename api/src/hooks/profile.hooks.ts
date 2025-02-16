import { USER_PROFILE } from '@locokit/definitions'
import { HookContext } from '../declarations'
import { Forbidden } from '@feathersjs/errors'

/**
 * Check if a user profile match a listing of PROFILE
 */
export function checkUserHasProfile(
  profile: Array<keyof typeof USER_PROFILE> | keyof typeof USER_PROFILE,
  context: HookContext,
): boolean {
  const profiles = Array.isArray(profile) ? profile : [profile]
  return profiles.includes(context.params.user?.profile as keyof typeof USER_PROFILE)
}

export function checkProviderIsInternal(context: HookContext): boolean {
  return !context.params.provider
  // if (!context.params.user || context.params.user.profile === USER_PROFILE.ADMIN) return true
}

/**
 * Check access rights according options
 */
export const checkUserHasAccess =
  (options: {
    /**
     * which profile(s) is(are) needed
     */
    allowedProfile: Array<keyof typeof USER_PROFILE> | keyof typeof USER_PROFILE
    /**
     * is the call has to be an internal one ?
     */
    internalProvider: boolean
    /**
     * do we need to check the user profile,
     * even if we are in an internal call
     */
    internalProviderProfileCheck?: 'ALWAYS' | 'IF_USER_PROVIDED'
  }) =>
  (context: HookContext): HookContext => {
    const userHasProfile = checkUserHasProfile(options.allowedProfile, context)
    const isInternalProvider = checkProviderIsInternal(context)

    if (!isInternalProvider && userHasProfile) return context
    if (options.internalProvider && isInternalProvider) {
      switch (options.internalProviderProfileCheck) {
        case 'ALWAYS':
          if (userHasProfile) return context
          break
        case 'IF_USER_PROVIDED':
          if (context.params.user && userHasProfile) return context
          if (!context.params.user) return context
          break
        default:
          return context
      }
    }

    throw new Forbidden("You can't access this service.")
  }

export function checkUserIsAdmin(context: HookContext): boolean {
  return checkUserHasProfile([USER_PROFILE.ADMIN], context)
}
