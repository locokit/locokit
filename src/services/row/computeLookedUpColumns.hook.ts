import { Hook, HookContext } from '@feathersjs/feathers'
import { TableRowRelation } from '../../models/tablerowrelation.model'
import { TableColumnRelation } from '../../models/tablecolumnrelation.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

/**
 * Hook updating looked up columns linked to the current row
 * * by a field updated for the current row (tcr.table_column_from_id)
 * *
 */
export function computeLookedUpColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // first, find rows linked to this current row (trr.table_row_from_id)
    const linkedRows = await context.app.services.trr.find({
      query: {
        table_row_from_id: context.result.id
      }
    })

    // find if some of the columns are linked to other via table_column_relation
    const linkedColumns = await context.app.services.columnrelation.find({
      query: {
        table_column_from_id: {
          $in: context.params._meta.columnsIdsTransmitted
        },
        $eager: 'from'
      }
    })

    // update each linked row, by setting the new value for all columns related to this row
    await Promise.all(
      (linkedRows.data as TableRowRelation[]).map(async (currentRowRelation: TableRowRelation) => {
        const rowToUpdate = await context.service.get(currentRowRelation.table_row_to_id)

        const columnIdsOfRowToUpdate = Object.keys(rowToUpdate.data)

        const columnsToUpdate = (linkedColumns.data as TableColumnRelation[])
          .filter(c => columnIdsOfRowToUpdate.indexOf(c.table_column_to_id) > -1)

        const newData: Record<string, {
            reference: string,
            value: string
          }> = {}

        /**
         * For each column to update, we'll update the newData object.
         * Depending the column_type of the original column,
         * we'll use the currentValue directly, or destructure the currentValue in a { reference, value } object
         */
        columnsToUpdate.forEach(c => {
          const currentValue = context.result.data[c.table_column_from_id]
          switch (c.from?.column_type_id) {
            case COLUMN_TYPE.USER:
              newData[c.table_column_to_id] = {
                ...currentValue
              }
              break
            default:
              newData[c.table_column_to_id] = {
                reference: context.result.id,
                value: context.result.data[c.table_column_from_id]
              }
          }
        })

        /**
         * Now we can update the row,
         * and we use the _patch method instead of patch
         * to avoid all hooks that will, for example,
         * forbid the update of LOOKED_UP_COLUMN... (checkColumnDefinitionMatching hook)
         */
        await context.service._patch(rowToUpdate.id, {
          data: {
            ...rowToUpdate.data,
            ...newData
          }
        }, {})
      })
    )
    return context
  }
}
