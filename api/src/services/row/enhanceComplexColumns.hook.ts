/* eslint-disable no-case-declarations */
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary/src'
import { TableRow } from '../../models/tablerow.model'
import { User } from '../../models/user.model'
import { Group } from '../../models/group.model'

/**
 * Retrieve the display value
 * for all columns that are "relation between tables" or "user"
 * that are transmitted in a create / update / patch request.
 *
 * Need the loadColumnsDefinition hook before.
 */
export function enhanceComplexColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    await Promise.all(
      Object.keys(context.data.data)
        .map(async currentColumnId => {
          const currentColumnDefinition = (context.params._meta.columns as TableColumn[]).find((c: TableColumn) => c.id === currentColumnId)
          const reference = context.data.data[currentColumnId]
          if (!reference) return
          let value = ''
          switch (currentColumnDefinition?.column_type_id) {
            case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
              // retrieve the text value of the matching row
              const matchingRow: TableRow = await context.service.get(reference)
              value = matchingRow.text
              context.params._meta = {
                ...context.params._meta,
                trr: (context.params._meta.trr || []).concat([
                  {
                    columnId: currentColumnId,
                    rowId: matchingRow.id,
                  },
                ]),
              }
              context.data.data[currentColumnId] = {
                reference,
                value,
              }
              break
            case COLUMN_TYPE.USER:
              const matchingUser: User = await context.app.services.user.get(reference)
              value = matchingUser.name
              context.data.data[currentColumnId] = {
                reference,
                value,
              }
              break
            case COLUMN_TYPE.MULTI_USER:
              const matchingUsers = await context.app.services.user.find({
                query: {
                  id: { $in: reference },
                },
                paginate: false,
              })
              const references: number[] = []
              const values: string[] = []
              matchingUsers?.forEach((user: User) => {
                references.push(user.id)
                values.push(user.name)
              })
              context.data.data[currentColumnId] = {
                reference: references,
                value: values,
              }
              break
            case COLUMN_TYPE.GROUP:
              const matchingGroup: Group = await context.app.services.group.get(reference)
              value = matchingGroup.name
              context.data.data[currentColumnId] = {
                reference,
                value,
              }
              break
          }
        }),
    )
    return context
  }
};
