import { HookContext } from '@/declarations'
import { SERVICES, USER_PROFILE } from '@locokit/definitions'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { UserResult } from '../../core/user/user.schema'
import { resolveAction } from '@/abilities/definitions'

/**
 * /workspace/group
 *
 * READ
 * * ADMIN profiles : all groups
 * * other : filter by group of the current user
 *
 * CREATE / UPDATE / DELETE
 * * forbidden for MEMBER profiles
 * * ADMIN profiles : OK
 * * CREATOR profiles : filter on workspaceId $in [workspace they created]
 */
export const setAbilities = async (context: HookContext) => {
  if (!context.params.provider) return context
  const { app } = context

  const user = context.params.user as UserResult
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  const userProfile: keyof typeof USER_PROFILE = user?.profile

  switch (userProfile) {
    case USER_PROFILE.MEMBER:
      /**
       * can only read their groups
       */
      const memberGroupsId = (
        await app.service(SERVICES.CORE_USERGROUP).find({
          query: {
            $select: ['groupId'],
            userId: user.id,
          },
          paginate: false,
        })
      ).map((ug) => ug.groupId)
      can('read', 'workspace/group', {
        id: {
          $in: memberGroupsId,
        },
      })
      cannot(['update', 'delete'], 'workspace/group')

      break
    case USER_PROFILE.CREATOR:
      /**
       * can access only to their groups
       */
      const creatorGroupsId = (
        await app.service(SERVICES.CORE_USERGROUP).find({
          query: {
            $select: ['groupId'],
            userId: user.id,
          },
          paginate: false,
        })
      ).map((ug) => ug.groupId)
      can('read', 'workspace/group', {
        id: {
          $in: creatorGroupsId,
        },
      })
      /**
       * but can create / update / delete related groups of their workspaces
       */
      const userWorkspacesId = (
        await app.service(SERVICES.CORE_WORKSPACE).find({
          query: {
            $select: ['id'],
            createdBy: user.id,
          },
          paginate: false,
        })
      ).map((w) => w.id)
      can('manage', 'workspace/group', {
        workspaceId: {
          $in: userWorkspacesId,
        },
      })
      break
    case USER_PROFILE.ADMIN:
      /**
       * can manage all groups
       */
      can('manage', 'workspace/group')
  }

  const ability = build({ resolveAction })
  context.params.ability = ability
  context.params.rules = ability.rules

  console.log(context.params.ability)
  console.log(context.params.rules)

  return context
}
