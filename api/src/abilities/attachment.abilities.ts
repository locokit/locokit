/* eslint-disable no-duplicate-case */
import { COLUMN_TYPE, USER_PROFILE } from '@locokit/lck-glossary'
import { AbilityBuilder, makeAbilityFromRules } from 'feathers-casl'

import { AppAbility, resolveAction } from './definitions'
import { HookContext } from '@feathersjs/feathers'
import { User } from '../models/user.model'
import { ServiceTypes } from '../declarations'
import { iff, IffHook, isProvider } from 'feathers-hooks-common'
import { Usergroup } from '../models/usergroup.model'
import { Forbidden, NotAcceptable } from '@feathersjs/errors'
import { TableColumn } from '../models/tablecolumn.model'
import { LckAclTable } from '../models/acltable.model'
import { replacePlaceholderInACLFilter } from './replacePlaceholder.helper'
import { TableRow } from '../models/tablerow.model'
import { LckAttachment } from '../models/attachment.model'

/**
 * Define abilities for attachment
 * regarding the current hook context.
 *
 * * SUPERADMIN / ADMIN can see all files
 * * CREATOR / USER can see files of the workspace they are members
 * * CREATOR can see all files of the workspace they own
 * * USER can see all files of the workspace they are member of a ADMIN group
 * * USER can see files of records they have access in the workspace, and fields too ? (need to manage acl for fields ?)
 *
 * @param context Hook contegroupIdxt, provided by FeathersJS
 * @returns Promise<HookContext>
 */
export async function createAbility (
  user: User,
  services: ServiceTypes,
  method: HookContext['method'],
  workspaceId?: string,
  attachmentId?: string,
): Promise<AppAbility> {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

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
      can('manage', 'attachment')
      can('manage', 'upload')
      break
    case USER_PROFILE.CREATOR:
    case USER_PROFILE.USER:
    default:
      /**
       * query param workspace_id is mandatory for find operation
       */
      if (method === 'find' && !workspaceId) {
        throw new NotAcceptable('You cannot find attachment without setting a workspace_id query param.')
      }

      /**
       * If there is an attachment id,
       * we're on a update/patch/remove request.
       *
       * We'll retrieve workspace_id by trying to retrieve the current item.
       */
      let currentWorkspaceId = workspaceId
      if (attachmentId) {
        const currentAttachment = await services.attachment._get(attachmentId) as LckAttachment
        currentWorkspaceId = currentAttachment.workspace_id
      }

      if (!currentWorkspaceId) {
        throw new NotAcceptable('Your request cannot be handled. Your attachment seems not be recognized.')
      }

      /**
       * Check the user have access to this workspace
       */
      const usergroups = await services.usergroup._find({
        query: {
          user_id: user.id,
          $eager: '[group.[aclset.[acltables]]]',
          $joinRelation: '[group.[aclset]]',
          'group:aclset.workspace_id': currentWorkspaceId,
        },
        paginate: false,
      }) as Usergroup[]
      if (usergroups.length === 0) {
        throw new Forbidden('You do not have access to this workspace. Please ask a workspace manager to join this workspace first.')
      }

      /**
       * We give permission to current user to create attachment
       * for the current workspace.
       */
      can('create', 'attachment', {
        workspace_id: currentWorkspaceId,
      })
      can('create', 'upload')

      /**
       * if the user is member at least of one manager group,
       * he can manage all files
       */
      let isMemberOfManagerACL = false
      /**
       * All ACL tables definition
       */
      const acltables: LckAclTable[] = []
      const groupIds: string[] = []
      usergroups.forEach(function (ug) {
        if (ug.group?.aclset?.manager === true) isMemberOfManagerACL = true
        acltables.push(...(ug.group?.aclset?.acltables ?? []))
        if (ug.group?.id) groupIds.push(ug.group?.id)
      })

      if (isMemberOfManagerACL) {
        can('manage', 'attachment', {
          workspace_id: currentWorkspaceId,
        })
      } else if (method === 'find' || method === 'get') { // for update/patch, no grant for user without management
        /**
         * We need to find all records the user can "see",
         * then find all file ids.
         *
         * First, find all fields in the workspace with column type FILE
         */
        const fields: TableColumn[] = await services.column.find({
          query: {
            column_type_id: COLUMN_TYPE.FILE,
            $joinRelation: '[table.[database]]',
            'table:database.workspace_id': currentWorkspaceId,
            $limit: -1,
          },
        }) as TableColumn[]

        /**
         * Then, for all related tables,
         * find acl for the current user
         * through its groups,
         * and build filters to these tables
         */
        const tableACLs: Array<{ tableId: string, filter?: any}> = []
        const tableIds = fields.map(f => f.table_id)
        acltables
          .filter(currentACLTable => tableIds.includes(currentACLTable.table_id))
          .filter(currentACLTable => currentACLTable.read_rows)
          .forEach(function (currentACLTable) {
            if (currentACLTable.read_filter) {
              const readFilter = replacePlaceholderInACLFilter(
                JSON.stringify(currentACLTable.read_filter),
                user.id,
                groupIds,
              )
              tableACLs.push({
                tableId: currentACLTable.table_id,
                filter: JSON.parse(readFilter),
              })
            } else {
              tableACLs.push({
                tableId: currentACLTable.table_id,
              })
            }
          })

        /**
         * Then, build the SQL request that will retrieve all rows
         * for a user, exploding files where some are set.
         *
         * We retrieve for each field and for each acltable,
         * records the user can access,
         * and we store each attachment id in a Set to avoid duplicated ids
         */
        // const sql = ''
        // const sqlBindings: string[] = []
        const attachmentIds = new Set()
        await Promise.all(
          fields.map(async currentField => {
            const matchingACLTables = tableACLs.filter(t => t.tableId === currentField.table_id)
            if (matchingACLTables.length === 0) return

            await Promise.all(
              matchingACLTables.map(async currentMatchingACLTable => {
                let query = {}

                if (currentMatchingACLTable.filter) {
                  query = {
                    table_id: currentField.table_id,
                    $and: [
                      currentMatchingACLTable.filter,
                      {
                        data: {
                          [currentField.id]: { $notNull: true },
                        },
                      },
                    ],
                  }
                } else {
                  query = {
                    table_id: currentField.table_id,
                    data: {
                      [currentField.id]: { $notNull: true },
                    },
                  }
                }
                const records = await services.row._find({ query, paginate: false }) as TableRow[]
                records.forEach(r => {
                  (r.data[currentField.id] as LckAttachment[]).forEach(function (a) {
                    attachmentIds.add(a.id)
                  })
                })
              }),
            )
          }),
        )

        can('read', 'attachment', {
          id: {
            $in: [...attachmentIds],
          },
        })
      }
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
    context.method,
    context.params.query?.workspace_id,
    context.id as string,
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
