import { HookContext } from '@feathersjs/feathers'
import { USER_PROFILE } from '@locokit/lck-glossary'

/**
 * Check if a user profile match a listing of USER_PROFILE
 */
export const isUserProfile = (profile: USER_PROFILE[] | USER_PROFILE) => (context: HookContext) => {
  const profiles = Array.isArray(profile) ? profile : [profile]
  return profiles.includes(context.params.user?.profile)
}
