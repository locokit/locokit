/* eslint-disable no-duplicate-case */
import { GROUP_ROLE, USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext } from '@feathersjs/feathers'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'
import { Usergroup } from '../models/usergroup.model'

/**
 * Define abilities for group
 * regarding the current hook context.
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function createAbility (
  user: User,
  services: ServiceTypes,
  withJoin: boolean = false,
): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, cannot, rules } = new AbilityBuilder(AppAbility)

  /**
   * User is anonymous, no permission granted
   */
  switch (user?.profile) {
    /**
     * SUPERADMIN / ADMIN
     * can manage all groups
     */
    case USER_PROFILE.SUPERADMIN:
    case USER_PROFILE.ADMIN:
      can('manage', ['group', 'usergroup'])
      break
    /**
     * Others can only see their groups
     */
    default:
      // find all workspaces where user is linked to the workspace through aclset > group
      const usergroupsDefault = await services.usergroup.find({
        query: {
          user_id: user.id,
        },
        paginate: false,
      }) as Usergroup[]

      // only OWNER can manage their groups
      const userGroupsOwner = usergroupsDefault.filter(ug => GROUP_ROLE.OWNER === ug.uhg_role)
      // ADMIN can only manage user in their groups
      const userGroupsAdmin = usergroupsDefault.filter(ug => GROUP_ROLE.ADMIN === ug.uhg_role)
      const userGroupsMember = usergroupsDefault.filter(ug => GROUP_ROLE.MEMBER === ug.uhg_role)

      // Sort ids to prevent side effect
      const userGroupsIds = [
        ...userGroupsOwner,
        ...userGroupsAdmin,
        ...userGroupsMember,
      ]

      cannot('delete', 'group')

      userGroupsIds.forEach(usergroup => {
        can('read', 'group', {
          [withJoin ? 'group.id' : 'id']: usergroup.group_id,
        })

        if (GROUP_ROLE.OWNER === usergroup.uhg_role) {
          can('manage', 'group', {
            [withJoin ? 'group.id' : 'id']: usergroup.group_id,
          })
          can('manage', 'usergroup', {
            group_id: usergroup.group_id,
          })
        }
        if (GROUP_ROLE.ADMIN === usergroup.uhg_role) {
          can('update', 'group', {
            [withJoin ? 'group.id' : 'id']: usergroup.group_id,
          })
          can('manage', 'usergroup', {
            group_id: usergroup.group_id,
          })
        }
        if (GROUP_ROLE.MEMBER === usergroup.uhg_role) {
          cannot('update', 'group', {
            [withJoin ? 'group.id' : 'id']: usergroup.group_id,
          })
        }
      })
  }

  return makeAbilityFromRules(rules, { resolveAction }) as AppAbility
}

/**
 * Define abilities for workspaces
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
async function defineAbilities (context: HookContext): Promise<HookContext> {
  const ability: AppAbility = await createAbility(
    context.params.user as User,
    context.app.services,
    context.params.query?.$eager || context.params.query?.$joinRelation,
  )
  context.params.ability = ability
  context.params.rules = ability.rules

  return context
}

export function defineAbilitiesIffHook (): IffHook {
  return iff(
    isProvider('external'),
    defineAbilities,
  )
}
