import { Hook, HookContext } from '@feathersjs/feathers'
import { TableRow, RowData } from '../../models/tablerow.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

/**
 * Compute the looked up columns for the current row,
 * if some of the depedencies of the looked up columns
 * are in the data currently sent.
 * (that means one of the dependency of the looked up column has mutated => refresh the computed value)
 */
export function computeRowLookedUpColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      context.method === 'patch' &&
      !context.data.data
    ) return context
    await Promise.all(
      (context.params._meta.columns as TableColumn[])
        .filter(
          c => c.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN &&
          context.params._meta.columnsIdsTransmitted.includes(c.settings.localField),
        )
        .map(async currentColumnDefinition => {
          const foreignColumn: TableColumn = await context.app.services.column.get(currentColumnDefinition.settings.foreignField as string)
          const foreignColumnTypeId = foreignColumn.column_type_id
          const foreignRowId: { reference: string, value: string } = context.data.data?.[currentColumnDefinition.settings.localField as string]
          if (foreignRowId?.reference) {
            const matchingRow: TableRow = await context.service.get(foreignRowId?.reference)
            const currentColumnData: RowData = {
              reference: foreignRowId.reference,
              value: matchingRow.data[currentColumnDefinition.settings.foreignField as string] as { reference: string, value: string },
            }
            if (foreignColumnTypeId === COLUMN_TYPE.RELATION_BETWEEN_TABLES) {
              // For a RELATION_BETWEEN_TABLES column, we retrieve the sub property of value for the value
              currentColumnData.value = (currentColumnData.value as { reference: string, value: string })?.value
            } else if (typeof currentColumnData.value === 'object') {
              // If the value is an object, we retrieve the sub property of value
              currentColumnData.reference = currentColumnData.value?.reference
              if (
                foreignColumnTypeId === COLUMN_TYPE.MULTI_USER &&
                Array.isArray(currentColumnData.value?.value)
              ) {
                currentColumnData.value = currentColumnData.value.value.join(', ')
              } else {
                currentColumnData.value = currentColumnData.value?.value
              }
            }
            context.data.data[currentColumnDefinition.id] = currentColumnData
            context.params._meta.columnsIdsTransmitted.push(currentColumnDefinition.id)
          }
        }),
    )
    return context
  }
}
