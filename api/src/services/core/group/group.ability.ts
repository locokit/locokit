import { HookContext } from '@/declarations'
import { SERVICES, USER_PROFILE } from '@locokit/shared'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { UserResult } from '../user/user.schema'
import { resolveAction } from '@/abilities/definitions'

/**
 * /core/group
 *
 * READ
 * * ADMIN profiles : all groups
 * * CREATOR / MEMBER : their groups
 *
 * CREATE / UPDATE / DELETE
 * * forbidden for MEMBER profiles
 * * ADMIN profiles : OK
 * * CREATOR profiles : filter on workspaceId $in [workspace they created]
 */
export const setAbilities = async (context: HookContext) => {
  const { app } = context

  const user = context.params.user as UserResult
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  cannot('create', 'core/group')

  if (!context.params.provider) {
    can('read', 'core/group')
    can('patch', 'core/group')
    can('remove', 'core/group')
  } else {
    const userProfile: keyof typeof USER_PROFILE = user?.profile

    switch (userProfile) {
      case USER_PROFILE.ADMIN:
        /**
         * can manage all groups
         */
        can('read', 'core/group')
        can('patch', 'core/group')
        can('remove', 'core/group')
        break

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
        can('read', 'core/group', {
          id: {
            $in: memberGroupsId,
          },
        })
        cannot(['patch', 'remove'], 'core/group')

        break
      case USER_PROFILE.CREATOR:
        cannot(['patch', 'remove'], 'core/group')

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
        can('read', 'core/group', {
          id: {
            $in: creatorGroupsId,
          },
        })
        /**
         * but can only read related groups of their workspaces
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
        can('read', 'core/group', {
          workspaceId: {
            $in: userWorkspacesId,
          },
        })
        break
    }
  }

  const ability = build({ resolveAction })
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}
