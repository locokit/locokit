import { HookContext } from '@/declarations'
import { SERVICES, USER_PROFILE } from '@locokit/shared'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { UserResult } from '../../core/user/user.schema'
import { resolveAction } from '@/abilities/definitions'

/**
 * /workspace/group
 *
 * READ
 * * ADMIN profiles : all groups for all workspaces
 * * other : filter by group of the current user
 *
 * CREATE / UPDATE / DELETE
 * * ADMIN profiles : OK
 * * USER owners : OK
 * * forbidden for other profiles
 *
 * Beware, we restrict the abilities to the current workspace
 * to avoid any overload on other workspaces.
 */
export const setAbilities = async (context: HookContext) => {
  const { app, params } = context

  const user = context.params.user as UserResult
  const workspaceId = params.$locokit.currentWorkspace.id
  const workspaceSlug = params.$locokit.currentWorkspace.slug
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  /**
   * If no provider, we authorize everything = internal calls
   */
  if (!context.params.provider) {
    can('manage', 'workspace/group', { workspaceId })
  } else {
    const userProfile: keyof typeof USER_PROFILE = user?.profile

    switch (userProfile) {
      case USER_PROFILE.ADMIN:
        /**
         * can manage all groups
         */
        can('manage', 'workspace/group', { workspaceId })
        break
      case USER_PROFILE.MEMBER:
      case USER_PROFILE.CREATOR:
      default:
        /**
         * if user is the owner
         */
        if (user.id === params.$locokit.currentWorkspace.createdBy) {
          can('manage', 'workspace/group', {
            workspaceId,
          })
        } else {
          /**
           * can only read their groups
           */
          cannot(['create', 'update', 'delete'], 'workspace/group', {
            workspaceId,
          })
          const groupIds = (
            await app.service(SERVICES.WORKSPACE_USERGROUP).find({
              query: {
                $select: ['groupId'],
                userId: user.id,
              },
              paginate: false,
              route: {
                workspaceSlug,
              },
            })
          ).map((ug) => ug.groupId)
          console.log('groupIds', groupIds)
          can('read', 'workspace/group', {
            id: {
              $in: groupIds,
            },
            workspaceId,
          })
        }
        break
    }
  }

  const ability = build({ resolveAction })
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}
