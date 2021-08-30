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
    // Store the rows with VIRTUAL_LOOKED_UP_COLUMN columns and the configuration of these specific columns
    const resultRowsWithVLUC: Record<string, {
      row: TableRow
      virtualColumns: Record<string, {
        foreignTable: string
        foreignColumn: string
        foreignRow: string
      }>
    }> = {}
    const foreignRowsIdsByTable: Record<string, string[]> = {}
    // Loop on result rows
    for (const column of context.params._meta.columns as TableColumn[]) {
      // Get the VIRTUAL_LOOKED_UP_COLUMN columns which are well configured
      if (
        column.column_type_id === COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN &&
        column.settings?.localField &&
        column.settings.foreignField
      ) {
        // Get the foreign table id
        const foreignTableId = (context.params._meta.columns as TableColumn[])
          .find(c => c.id === column.settings.localField)
          ?.settings.tableId

        if (!foreignTableId) continue

        for (const resultRow of resultRows) {
          // Id of the linked row (through the RELATION_BETWEEN_TABLES column linked to the current one)
          const foreignRowId = (resultRow.data[column.settings.localField] as { reference: string, value: string } | undefined)?.reference

          if (!foreignRowId) continue

          // Get the foreign rows to load (a set of rows for each table to load)
          if (!foreignRowsIdsByTable[foreignTableId]) {
            foreignRowsIdsByTable[foreignTableId] = []
          }
          foreignRowsIdsByTable[foreignTableId].push(foreignRowId)

          // Get a list of the rows with the VIRTUAL_LOOKED_UP_COLUMN columns configurations
          if (!resultRowsWithVLUC[resultRow.id]) {
            resultRowsWithVLUC[resultRow.id] = {
              row: resultRow,
              virtualColumns: {},
            }
          }
          resultRowsWithVLUC[resultRow.id].virtualColumns[column.id] = {
            foreignTable: foreignTableId,
            foreignColumn: column.settings.foreignField,
            foreignRow: foreignRowId,
          }
        }
      }
    }

    try {
      const tablesToLoadIds = Object.keys(foreignRowsIdsByTable)
      if (tablesToLoadIds.length > 0) {
        // For each foreign table, get the rows to load from the database
        const foreignRowsByTable: Record<string, Record<string, TableRow>> = (await Promise.all(
          tablesToLoadIds.map(async tableId => await context.service.find({
            query: {
              id: {
                $in: foreignRowsIdsByTable[tableId],
              },
              table_id: tableId,
            },
            paginate: false,
            _meta: {
              computeVirtualLookedUpColumn: true, // Needed to compute the foreign VIRTUAL_LOOKED_UP_COLUMN columns
            },
          }) as TableRow[]),
        )).reduce((rowsByTable: Record<string, Record<string, TableRow>>, tableRows, currentIndex) => {
          rowsByTable[tablesToLoadIds[currentIndex]] = tableRows.reduce((rows: Record<string, TableRow>, row) => {
            rows[row.id] = row
            return rows
          }, {})
          return rowsByTable
        }, {})

        // Compute all the VIRTUAL_LOOKED_UP_COLUMN columns for each row
        for (const resultRowId in resultRowsWithVLUC) {
          const resultRow = resultRowsWithVLUC[resultRowId]
          for (const columnId in resultRow.virtualColumns) {
            const columnConfiguration = resultRow.virtualColumns[columnId]
            // Include the value of the VIRTUAL_LOOKED_UP_COLUMN into the row data
            const foreignData = foreignRowsByTable[columnConfiguration.foreignTable][columnConfiguration.foreignRow]
              ?.data[columnConfiguration.foreignColumn]
            if (foreignData) resultRow.row.data[columnId] = foreignData
          }
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        e.message = `Impossible to compute the virtual values. ${e.message}`
      }
      throw e
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
