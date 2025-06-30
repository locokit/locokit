import { HookContext } from '@/declarations'
import { USER_PROFILE } from '@locokit/definitions'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { UserResult } from '../../core/user/user.schema'
import { resolveAction } from '@/abilities/definitions'

/**
 * /workspace/policy
 *
 * CRUD is only authorized for ADMIN profiles and owners
 *
 * Beware, we restrict the abilities to the current workspace
 * to avoid any overload on other workspaces.
 */
export const setAbilities = async (context: HookContext) => {
  const { params } = context

  const user = context.params.user as UserResult
  const workspaceId = params.$locokit.currentWorkspace.id
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  /**
   * If no provider, we authorize everything = internal calls
   */
  if (!context.params.provider) {
    can('manage', 'workspace/policy', { workspaceId })
  } else {
    const userProfile: keyof typeof USER_PROFILE = user?.profile
    if (
      user.id === context.params.$locokit.currentWorkspace.createdBy ||
      userProfile === USER_PROFILE.ADMIN
    ) {
      can('manage', 'workspace/policy', { workspaceId })
    } else {
      cannot('manage', 'workspace/policy', { workspaceId })
    }
  }

  const ability = build({ resolveAction })
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}
