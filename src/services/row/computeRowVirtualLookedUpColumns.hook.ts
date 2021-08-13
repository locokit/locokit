import { Hook, HookContext } from '@feathersjs/feathers'
import { TableRow } from '../../models/tablerow.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

/**
 * Compute all the VIRTUAL_LOOKED_UP_COLUMN columns of the result rows.
 */
export function computeRowVirtualLookedUpColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (
      !needToComputeVirtualLookedUpColumns(context) ||
      !Array.isArray(context.params._meta?.columns) // The table / tableview columns must be loaded
    ) {
      return context
    }
    // Save data to prevent redundant DB requests
    const foreignRows: Record<string, TableRow> = {}
    const foreignColumns: Record<string, TableColumn> = {}
    // First, encapsulate the row(s) in an array to harmonize the computation
    let resultRows: TableRow[] = []
    if (Array.isArray(context.result)) {
      // Non paginated rows
      resultRows = context.result
    } else if (context.result.total != null) {
      // Paginated rows
      resultRows = context.result.data
    } else {
      // Single row
      resultRows = [context.result]
    }
    // Loop on result rows
    for (const resultRow of resultRows) {
      if (!resultRow.data) continue
      // Compute all the VIRTUAL_LOOKED_UP_COLUMN columns of the current row
      for (const column of context.params._meta.columns as TableColumn[]) {
        if (column.column_type_id === COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN && column.settings?.localField) {
          // Id of the linked row (through the RELATION_BETWEEN_TABLES column linked to the current one)
          const foreignRowId = (resultRow.data[column.settings.localField] as { reference: string, value: string } | undefined)?.reference
          // Id of the linked column
          const foreignColumnId = column.settings.foreignField
          // Valid configuration
          if (foreignRowId && foreignColumnId) {
            try {
              // Get the foreign column
              if (!foreignColumns[foreignColumnId]) {
                foreignColumns[foreignColumnId] = await context.app.service('column').get(foreignColumnId)
              }
              // Get the foreign row
              if (!foreignRows[foreignRowId]) {
                foreignRows[foreignRowId] = await context.service.get(foreignRowId, {
                  _meta: {
                    computeVirtualLookedUpColumn: true, // Needed to compute the foreign virtual looked-up columns
                  },
                })
              }
              // Include the value of the VIRTUAL_LOOKED_UP_COLUMN into the row data
              resultRow.data[column.id] = foreignRows[foreignRowId].data[foreignColumns[foreignColumnId].id]
            } catch (e) {
              if (e instanceof Error) {
                e.message = `Impossible to retrieve the data from the column '${column.id}'. ${e.message}`
              }
              throw e
            }
          }
        }
      }
    }
    return context
  }
}

/**
 * Do we need to compute the virtual looked-up columns ?
 *
 * @param {HookContext} context
 * @returns {boolean} true if we need to compute the virtual looked-up columns.
 */
export function needToComputeVirtualLookedUpColumns (context: HookContext): boolean {
  return (
    context.params.provider !== undefined || // All external calls
    context.params._meta?.computeVirtualLookedUpColumn === true // Internal calls if it's explicitly asked
  )
}
