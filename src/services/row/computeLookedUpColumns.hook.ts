import { Hook, HookContext } from '@feathersjs/feathers'
import { TableRowRelation } from '../../models/tablerowrelation.model'
import { TableColumnRelation } from '../../models/tablecolumnrelation.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableRow } from '../../models/tablerow.model'

/**
 * Hook updating looked up columns linked to the current row
 * * by a field updated for the current row (tcr.table_column_from_id)
 * *
 */
export function computeLookedUpColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    const updatedRows: TableRow[] = Array.isArray(context.result) ? context.result : [context.result]

    // first, find rows linked to this current row (trr.table_row_from_id)
    const linkedRows = await context.app.services.trr.find({
      query: {
        table_row_from_id: {
          $in: updatedRows.map(row => row.id)
        },
        $eager: 'to'
      },
      paginate: false
    }) as TableRowRelation[]

    // find if some of the columns are linked to other via table_column_relation
    const linkedColumns = await context.app.services.columnrelation.find({
      query: {
        table_column_from_id: {
          $in: context.params._meta.columnsIdsTransmitted
        },
        $eager: 'from'
      },
      paginate: false
    }) as TableColumnRelation[]

    // update the rows linked to each updated row
    const rowPatchPromises: Promise<any>[] = []

    updatedRows.forEach(async row => {
      const currentLinkedRows = linkedRows.filter(linkedRow => linkedRow.table_row_from_id === row.id)

      // update each linked row, by setting the new value for all columns related to this row
      currentLinkedRows.map(async currentRowRelation => {
        const rowToUpdate = currentRowRelation.to || await context.service.get(currentRowRelation.table_row_to_id)

        const columnIdsOfRowToUpdate = Object.keys(rowToUpdate.data)

        const columnsToUpdate = linkedColumns
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
          const currentValue = row.data[c.table_column_from_id]
          switch (c.from?.column_type_id) {
            case COLUMN_TYPE.USER:
              newData[c.table_column_to_id] = {
                ...currentValue as { reference: string; value: string }
              }
              break
            case COLUMN_TYPE.MULTI_USER:
              newData[c.table_column_to_id] = {
                reference: (currentValue as { reference: string; value: string }).reference,
                value: (currentValue as unknown as { reference: string; value: string[] }).value.join(', ')
              }
              break
            default:
              newData[c.table_column_to_id] = {
                reference: row.id,
                value: row.data?.[c.table_column_from_id] as string
              }
          }
        })

        /**
         * Now we can update the row,
         * and we use the _patch method instead of patch
         * to avoid all hooks that will, for example,
         * forbid the update of LOOKED_UP_COLUMN... (checkColumnDefinitionMatching hook)
         */
        rowPatchPromises.push(
          context.service._patch(rowToUpdate.id, {
            data: {
              ...rowToUpdate.data,
              ...newData
            }
          }, {})
        )
      })
    })

    await Promise.all(rowPatchPromises)

    return context
  }
}
