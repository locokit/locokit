/* eslint-disable @typescript-eslint/naming-convention */
import { USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext, Query } from '@feathersjs/feathers'
import { NotAcceptable } from '@feathersjs/errors'
import { LckAclSet } from '../models/aclset.model'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'

/**
 * Define abilities for records
 * regarding the current hook context.
 *
 * By default, a user can read records(rows)
 * only on tables he's authorized.
 * Then, only fields(columns) on which he's authorized too.
 *
 * After, he can create - or not - new records.
 * He can remove lines - or not.
 *
 *
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function defineAbilityFor (user: User, query: Query, services: ServiceTypes): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (!query?.$lckGroupId) {
    throw new NotAcceptable('Missing filter $lckGroupId.', {
      code: 'RECORDS_NOT_FILTERABLE',
    })
  }

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
      can('manage', 'row')
      break
    /**
     * For a creator, we need to know if the records
     * are from a workspace he manage
     */
    case USER_PROFILE.CREATOR:
      /**
       * We have a filter, like a table_id, table_view_id or id
       * (if not, we need to throw an error)
       */
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const { table_id, table_view_id, id } = query as Query
      if (!table_id && !table_view_id && !id) {
        throw new NotAcceptable('Missing filter table_id | table_view_id | id.', {
          code: 'RECORDS_NOT_FILTERABLE',
        })
      }
      if (table_id) {
        const table = await services.table.get(table_id, {
          $joinRelation: 'database.[workspace.[aclset.[groups.[users]]]]',
          'database:workspace:aclset:groups:users.id': user.id,
        })
        if (table) can('manage', 'row', { table_id })
      } else if (table_view_id) {
        const tableView = await services.view.get(table_view_id, {
          $eager: 'table',
          $joinRelation: 'table.[database.[workspace.[aclset.[groups.[users]]]]]',
          'table:database:workspace:aclset:groups:users.id': user.id,
        })
        if (tableView) can('manage', 'row', { table_id: tableView.table?.id })
      } else if (id) {
        const tableRow = await services.row.get(id, {
          $eager: 'table',
          $joinRelation: 'table.[database.[workspace.[aclset.[groups.[users]]]]]',
          'table:database:workspace:aclset:groups:users.id': user.id,
        })
        if (tableRow) can('manage', 'row', { table_id: tableRow.table.id })
      }
      break

    case USER_PROFILE.USER:
      /**
       * We need to know all acls for records, views and tables
       * for this user, through its group
       */

      // find all workspaces where user is linked to the workspace through aclset > group
      const aclsetsSimple = await services.aclset.find({
        query: {
          $joinRelation: 'groups.[users]',
          'groups:users.id': user.id,
        },
        paginate: false,
      }) as LckAclSet[]
      can('read', 'workspace', {
        id: {
          $in: aclsetsSimple.map((aclset: LckAclSet) => aclset.workspace_id),
        },
      })
  }

  return makeAbilityFromRules(rules, { resolveAction }) as AppAbility
}

/**
 * Define abilities for records
 *
 * @param context Hook context, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function defineAbilities (context: HookContext): Promise<HookContext> {
  const ability: AppAbility = await defineAbilityFor(context.params.user as User, context.params.query as Query, context.app.services)
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
