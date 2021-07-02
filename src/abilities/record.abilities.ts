/* eslint-disable @typescript-eslint/naming-convention */
import { USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext, Query } from '@feathersjs/feathers'
// import { NotAcceptable } from '@feathersjs/errors'
import { LckAclSet } from '../models/aclset.model'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'
// import { Table } from '../models/table.model'

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
export async function defineAbilityFor (
  user: User,
  query: Query,
  services: ServiceTypes,
): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

  /**
   * If no groupId is given,
   * we need to fetch all groups available for the user ?
   */
  // if (!query?.$lckGroupId) {
  //   throw new NotAcceptable('Missing filter $lckGroupId.', {
  //     code: 'RECORDS_NOT_FILTERABLE',
  //   })
  // }
  const groupId = query?.$lckGroupId
  const userId = user?.id

  // if (!query?.table_id) {
  //   throw new NotAcceptable('Missing table_id.', {
  //     code: 'RECORDS_NOT_FILTERABLE',
  //   })
  // }
  // are we on a get ? => use the id to find the correlated table to filter for abilities
  // are we on a update / patch / delete => same thing
  // are we on a find ? => use the table_id

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
       * TODO: check that the creator is a manager of the workspace through its group if set,
       * or through a group having access to the workspace's table
       */
      /**
       * We have a filter, like a table_id, table_view_id or id
       * (if not, we need to throw an error)
       */
      /**
        * The Creator is manager of this workspaces,
        * so he have all permissions on rows from these workspaces
        */
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      // const { table_id, table_view_id, id } = query as Query
      // if (!table_id && !table_view_id && !id) {
      //   throw new NotAcceptable('Missing filter table_id | table_view_id | id.', {
      //     code: 'RECORDS_NOT_FILTERABLE',
      //   })
      // }
      // if (table_id) {
      //   const table = await services.table.get(table_id, {
      //     $joinRelation: 'database.[workspace.[aclset.[groups.[users]]]]',
      //     'database:workspace:aclset:groups:users.id': user.id,
      //   })
      //   if (table) can('manage', 'row', { table_id })
      // } else if (table_view_id) {
      //   const tableView = await services.view.get(table_view_id, {
      //     $eager: 'table',
      //     $joinRelation: 'table.[database.[workspace.[aclset.[groups.[users]]]]]',
      //     'table:database:workspace:aclset:groups:users.id': user.id,
      //   })
      //   if (tableView) can('manage', 'row', { table_id: tableView.table?.id })
      // } else if (id) {
      //   const tableRow = await services.row.get(id, {
      //     $eager: 'table',
      //     $joinRelation: 'table.[database.[workspace.[aclset.[groups.[users]]]]]',
      //     'table:database:workspace:aclset:groups:users.id': user.id,
      //   })
      //   if (tableRow) can('manage', 'row', { table_id: tableRow.table.id })
      // }
      break

    case USER_PROFILE.USER:
      /**
       * We need to know all acls for records, views and tables
       * for this user, through its group
       */
      /**
        * TODO: manage a user without the $lckGroupId
        * and combine all read_filters
        */

      // find matching acl for the current user through aclset > group
      const aclsetsSimple = await services.aclset.find({
        query: {
          $joinRelation: 'groupsacl.[users]',
          $eager: '[acltables, workspace.[databases.[tables]]]',
          $modifyEager: {
            acltables: {
              table_id: query?.table_id,
            },
          },
          'groupsacl:users.id': user.id,
        },
        paginate: false,
      }) as LckAclSet[] || []
      aclsetsSimple.forEach(currentAclset => {
        /**
         * if the user is a member of a group managing the workspace,
         * he has access to all the workspace, so to all of the workspace > database > tables
         */
        if (currentAclset.manager) {
          /**
           * We want to give access to all tables of the workspace
           * We need to retrieve all tables of the workspace
           */
          const workspaceTableIds = currentAclset?.workspace?.databases?.reduce((acc, currentDB) => {
            if (!currentDB.tables) return acc
            const tableIds = currentDB.tables?.map(t => t.id)
            return acc.concat(tableIds)
          }, [] as string[])
          can('manage', 'row', { table_id: { $in: workspaceTableIds } })
        }
        currentAclset.acltables?.forEach(currentAcltable => {
          if (currentAcltable.create_rows) {
            can('create', 'row', { table_id: currentAcltable.table_id })
          }
          if (currentAcltable.read_rows) {
            if (!currentAcltable.read_filter) {
              const readFilterParsed = JSON.parse(
                JSON.stringify(currentAcltable.read_filter)
                  .replace('{userId}', userId.toString())
                  .replace('{groupId}', groupId),
              )
              can('read', 'row', {
                ...readFilterParsed,
                table_id: currentAcltable.table_id,
              })
            } else {
              can('read', 'row', { table_id: currentAcltable.table_id })
            }
          }
          if (currentAcltable.update_rows) {
            if (!currentAcltable.update_filter) {
              const updateFilterParsed = JSON.parse(
                JSON.stringify(currentAcltable.update_filter)
                  .replace('{userId}', userId.toString())
                  .replace('{groupId}', groupId),
              )
              can('update', 'row', {
                ...updateFilterParsed,
                table_id: currentAcltable.table_id,
              })
            } else {
              can('update', 'row', { table_id: currentAcltable.table_id })
            }
          }
          if (currentAcltable.delete_rows) {
            console.log(currentAcltable.delete_filter)
            if (!currentAcltable.delete_filter) {
              const deleteFilterParsed = JSON.parse(
                JSON.stringify(currentAcltable.delete_filter)
                  .replace('{userId}', userId.toString())
                  .replace('{groupId}', groupId),
              )
              can('delete', 'row', {
                ...deleteFilterParsed,
                table_id: currentAcltable.table_id,
              })
            } else {
              can('delete', 'row', { table_id: currentAcltable.table_id })
            }
          }
        })
      })
      break
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
