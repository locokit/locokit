/* eslint-disable @typescript-eslint/naming-convention */
import { USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext, Params, Query } from '@feathersjs/feathers'
import { LckAclSet } from '../models/aclset.model'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'
import { Forbidden } from '@feathersjs/errors'
import { Usergroup } from '../models/usergroup.model'
import { replacePlaceholderInACLFilter } from './replacePlaceholder.helper'

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
 */
export async function defineAbilityFor (
  user: User,
  query: Query,
  services: ServiceTypes,
  tableId?: string,
): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

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
     * For a CREATOR, there is no difference from a USER profile,
     * acls are computed from the groups related to the current user.
     * The CREATOR will have "all" powers on workspace he creates
     *
     * We need to know all acls for records, views and tables
     * for this user, through its group
     */
    case USER_PROFILE.CREATOR:
    case USER_PROFILE.USER:
      const userId = user?.id

      /**
       * If no groupId is given,
       * we need to fetch all groups available for the user ?
       */
      let groupId: string | null | string[] = null

      /**
       * By default, we set groupId with all the groups the user is member of
       */
      const groups = await services.usergroup.find({
        query: {
          user_id: userId,
        },
        paginate: false,
      }) as Usergroup[]
      groupId = []
      groups.forEach(g => (groupId as string[]).push(g.group_id))

      /**
       * If a $lckGroupId is provided in query params,
       * we check if this groupId is valid, ie included in the groups of the user.
       * If yes, we replace the groupId value,
       * else, we throw a 403 error.
       */
      if (query?.$lckGroupId) {
        const groupIdIndex = groups.findIndex(g => g.group_id === query.$lckGroupId)
        if (groupIdIndex >= 0) {
          groupId = query.$lckGroupId
        } else {
          throw new Forbidden('You are not allowed to access data through this group.')
        }
      }

      // find matching acl for the current user through aclset > group
      // maybe filter by table ?

      /**
       * Retrieve acls for the current user
       * Beware, if we want to retrieve acls for a table,
       * BUT the user is a manager of the workspace,
       * we won't have any records for the table in acl_table
       * because a manager can manage all tables.
       *
       * So, first, we need to retrieve the table > db
       * to detect on which workspace we are.
       *
       * Then, if the user is not a manager,
       * we'll try to find acl for the table_id
       */
      const aclsetParams: Params & { query: Query } = {
        query: {
          $joinRelation: '[groupsacl.[users]]',
          $eager: '[acltables, workspace.[databases.[tables]]]',
          'groupsacl:users.id': user.id,
        },
        paginate: false,
      }
      if (tableId) {
        // aclsetParams.query.$joinRelation = '[groupsacl.[users], acltables]'
        aclsetParams.query.$modifyEager = {
          acltables: {
            table_id: tableId,
          },
        }
      }
      const aclsetsSimple = await services.aclset.find(aclsetParams) as LckAclSet[] || []
      aclsetsSimple.forEach(currentAclset => {
        /**
         * if the user is a member of a gr oup managing the workspace,
         * he has access to all the workspace, so to all of the workspace > database > tables
         */
        if (currentAclset.manager) {
          /**
           * We want to give access to all tables of the workspace
           * We need to retrieve all tables of the workspace
           */
          const workspaceTableIds = currentAclset?.workspace?.databases?.reduce((acc, currentDB) => {
            if (!currentDB.tables) return acc
            const tableIds = currentDB.tables.map(t => t.id)
            return acc.concat(tableIds)
          }, [] as string[])
          can('manage', 'row', { table_id: { $in: workspaceTableIds } })
        }
        currentAclset.acltables?.forEach(currentAcltable => {
          if (currentAcltable.create_rows) {
            can('create', 'row', { table_id: currentAcltable.table_id })
          }
          if (currentAcltable.read_rows) {
            if (currentAcltable.read_filter) {
              const readFilter = replacePlaceholderInACLFilter(
                JSON.stringify(currentAcltable.read_filter),
                userId,
                groupId,
              )
              can('read', 'row', {
                ...JSON.parse(readFilter),
                table_id: currentAcltable.table_id,
              })
            } else {
              can('read', 'row', { table_id: currentAcltable.table_id })
            }
          }
          if (currentAcltable.update_rows) {
            if (currentAcltable.update_filter) {
              const updateFilter = replacePlaceholderInACLFilter(
                JSON.stringify(currentAcltable.update_filter),
                userId,
                groupId,
              )
              can('update', 'row', {
                ...JSON.parse(updateFilter),
                table_id: currentAcltable.table_id,
              })
            } else {
              can('update', 'row', { table_id: currentAcltable.table_id })
            }
          }
          if (currentAcltable.delete_rows) {
            if (currentAcltable.delete_filter) {
              const deleteFilter = replacePlaceholderInACLFilter(
                JSON.stringify(currentAcltable.delete_filter),
                userId,
                groupId,
              )
              can('delete', 'row', {
                ...JSON.parse(deleteFilter),
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
 */
export async function defineAbilities (context: HookContext): Promise<HookContext> {
  const ability: AppAbility = await defineAbilityFor(
    context.params.user as User,
    context.params.query as Query,
    context.app.services,
    (context as any).params?._meta?.item?.table_id,
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
