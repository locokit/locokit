import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { NotAcceptable } from '@feathersjs/errors'

/**
 * Create / Update the table_row_relation if needed
 */
export function upsertRowRelation (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Multiple update
    if (Array.isArray(context.result)) return context
    // Single update
    await Promise.all(
      (context.params._meta.columnsIdsTransmitted as string[])
        .filter(currentColumnId => {
        // find the matching column
          const currentColumnDefinition = (context.params._meta.columns as TableColumn[] ?? []).find((c: TableColumn) => c.id === currentColumnId)
          // check if it's a RELATION_BETWEEN_TABLE
          return currentColumnDefinition?.column_type_id === COLUMN_TYPE.RELATION_BETWEEN_TABLES
        })
        .map(async currentColumnId => {
          // check if there is already a trr for the current row id + currentColumnId
          const matchingRows = await context.app.services.trr.find({
            query: {
              table_row_to_id: context.result.id,
              table_column_to_id: currentColumnId,
            },
          })
          const tableRowFromId = context.result.data[currentColumnId]?.reference
          /**
           * if no tableRowFromId, we don't have to create a table_row_relation
           */
          if (!tableRowFromId) return
          // if the trr doesn't exist, create it
          if (matchingRows.total === 0) {
            await context.app.services.trr.create({
              table_row_to_id: context.result.id,
              table_column_to_id: currentColumnId,
              table_row_from_id: tableRowFromId,
            })
          } else if (matchingRows.total === 1) {
          // if the from is different, update this line
            if (matchingRows.data[0].table_row_from_id !== tableRowFromId) {
              await context.app.services.trr.patch({
                table_row_to_id: context.result.id,
                table_column_to_id: currentColumnId,
              }, {
                table_row_from_id: tableRowFromId,
              })
            }
          // else do nothing
          } else {
            throw new NotAcceptable('Too much matching rows ?')
          }
        }),
    )

    return context
  }
}
