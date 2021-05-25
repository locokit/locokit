/* eslint-disable no-duplicate-case */
import { USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext } from '@feathersjs/feathers'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'
import { LckAclSet } from '../models/aclset.model'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'

/**
 * Define abilities for workspace
 * regarding the current hook context.
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function defineAbilityFor (user: User, services: ServiceTypes): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, cannot, rules } = new AbilityBuilder(AppAbility)

  /**
   * User is anonymous, no permission granted
   * TODO: add public rules for workspace (e.g., read public workspaces ?)
   * need to "free" the workspace endpoint (authentication is not mandatory for find / get)
   */
  switch (user?.profile) {
    /**
     * SUPERADMIN / ADMIN
     * can manage all workspaces
     */
    case USER_PROFILE.SUPERADMIN:
    case USER_PROFILE.ADMIN:
      can('manage', 'workspace')
      break
    /**
     * CREATOR can manage their workspace,
     * but only their,
     * so they inherit same permissions than USER
     */
    case USER_PROFILE.CREATOR:
      // find all workspace where user have a group "manager" of the workspace
      const aclsetsCREATOR = await services.aclset.find({
        query: {
          $joinRelation: 'groupsacl.[users]',
          'groupsacl:users.id': user.id,
        },
        paginate: false,
      }) as LckAclSet[]
      cannot('manage', 'workspace')
      can('create', 'workspace')
      can('manage', 'workspace', {
        id: {
          $in: aclsetsCREATOR.filter(aclset => aclset.manager).map(aclset => aclset.workspace_id),
        },
      })
      can('read', 'workspace', {
        id: {
          $in: aclsetsCREATOR.map(aclset => aclset.workspace_id),
        },
      })
      break
    /**
     * User connected can
     * * find workspace of their groups
     * USER cannot create / manage workspace,
     * even if they are member of a group having a manager aclset on a workspace
     */
    case USER_PROFILE.USER:
      // find all workspaces where user is linked to the workspace through aclset > group
      const aclsetsUSER = await services.aclset.find({
        query: {
          $joinRelation: 'groups.[users]',
          'groups:users.id': user.id,
        },
        paginate: false,
      }) as LckAclSet[]
      cannot('manage', 'workspace')
      can('read', 'workspace', {
        id: {
          $in: aclsetsUSER.map(aclset => aclset.workspace_id),
        },
      })
  }

  return makeAbilityFromRules(rules, { resolveAction }) as AppAbility
}

/**
 * Define abilities for entities, high level one.
 * For more grained, we need to go deeper in each service
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function defineAbilities (context: HookContext): Promise<HookContext> {
  const ability: AppAbility = await defineAbilityFor(context.params.user as User, context.app.services)
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
