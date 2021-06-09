import { USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext } from '@feathersjs/feathers'
import { LckAclSet } from '../models/aclset.model'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'

/**
 * Define abilities for fields
 * regarding the current hook context.
 *
 * By default, a user can crud fields(columns)
 * only on workspace he's authorized (i.e. member of a aclset manager)
 * and if it's a CREATOR.
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function defineAbilityFor (user: User, services: ServiceTypes): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

  switch (user?.profile) {
    /**
     * SUPERADMIN / ADMIN
     * can manage all workspaces
     */
    case USER_PROFILE.SUPERADMIN:
    case USER_PROFILE.ADMIN:
      can('manage', 'column')
      break
    /**
     * For a creator, we limit to the table's workspaces he's member of manager aclset
     */
    case USER_PROFILE.CREATOR:
      const aclsetsCREATOR = await services.aclset.find({
        query: {
          $eager: 'workspace.[databases.[tables]]',
          $joinRelation: 'groupsacl.[users]',
          'groupsacl:users.id': user.id,
          manager: true,
        },
        paginate: false,
      }) as LckAclSet[]

      const tableIdsCREATOR = aclsetsCREATOR.map(aclset => {
        return aclset.workspace?.databases?.map(db => {
          return db.tables?.map(t => t.id)
        })
      }).flat(2)
      can('manage', 'column', {
        table_id: {
          $in: tableIdsCREATOR,
        },
      })

      break

    /**
     * For a user, we limit fields to
     * * table the user has access
     * * fields on which he has at least the READ acl
     */
    case USER_PROFILE.USER:
      /**
       * W
       */

      // find all workspaces where user is linked to the workspace through aclset > group
      const aclsetsUSER = await services.aclset.find({
        query: {
          $eager: 'workspace.[databases.[tables.[columns]]]',
          $joinRelation: 'groupsacl.[users]',
          'groupsacl:users.id': user.id,
        },
        paginate: false,
      }) as LckAclSet[]
      const tableIdsUSER = aclsetsUSER.map(aclset => {
        return aclset.workspace?.databases?.map(db => {
          return db.tables?.map(t => t.id)
        })
      }).flat(2)
      can('read', 'column', {
        table_id: {
          $in: tableIdsUSER,
        },
      })
  }
  return makeAbilityFromRules(rules, { resolveAction }) as AppAbility
}

/**
 * Define abilities for fields
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
