import { GeneralError } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
import { TableRow } from '../../models/tablerow.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { functions, getFormattedColumn, TEXT_TYPES } from '../../formulas/formulas'
import { FunctionBuilder, raw, fn } from 'objection'

const formulasParser = require('../../formulas/formulaParser.js')

/**
 * Compute the formulas of the row if necessary.
 */
export function computeRowFormulaColumns () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    const updatedFormulaColumns:Record<string, object> = {}
    const updatedFormulaColumnsKeys: string[] = []

    // Create an object containing the columns references to use placeholders in the sql query
    const columnsReferences: Record<string, FunctionBuilder> = {};
    (context.params._meta?.columns as TableColumn[]).forEach(column => {
      // Need to replace '-' by '_' because '-' is not a valid char in an alias
      columnsReferences[column.id.replace(/-/g, '_')] = getFormattedColumn(column)
    });

    // Loop on the formula table columns
    (context.params._meta.columns as TableColumn[])
      .forEach(currentColumnDefinition => {
        if (currentColumnDefinition.column_type_id === COLUMN_TYPE.FORMULA) {
          const formula = currentColumnDefinition.settings?.formula
          if (formula) {
            // Get the columns ids specified in the formula TODO from column_relation ?
            const regex = /(?<=COLUMN\.)([a-z0-9-]*)/g
            const columnsIds: string[] = formula.match(regex) || []

            // Parse the formula if one updated column is included in it
            if (context.params._meta?.columnsIdsTransmitted.some((columnId: string) => columnsIds.includes(columnId))) {
              try {
                const formulaResult = formulasParser.parse(formula, { functions, columns: context.params._meta.columns, columnsTypes: COLUMN_TYPE })
                const castResult = TEXT_TYPES.includes(formulaResult.type) ? '::text' : ''

                updatedFormulaColumns[`data:${currentColumnDefinition.id}`] = fn.coalesce(
                  raw(`to_jsonb(${formulaResult.value}${castResult})`, columnsReferences),
                  raw("jsonb 'null'")
                )

                updatedFormulaColumnsKeys.push(currentColumnDefinition.id)
              } catch (error) {
                throw new GeneralError('Invalid formula: ' + error.message, {
                  code: 'INVALID_FORMULA_SYNTAX'
                })
              }
            }
          }
        }
      })

    if (Object.keys(updatedFormulaColumns).length > 0) {
      // Add the formula columns keys that will be updated due to the original update (useful for looked_up_columns)
      context.params._meta.columnsIdsTransmitted.push(...updatedFormulaColumnsKeys)
      // Update the row(s)
      try {
        if (Array.isArray(context.result)) {
          // Multiple update
          (context.result as TableRow[]) = await context.service._patch(null,
            updatedFormulaColumns,
            {
              query: {
                table_id: context.params.query?.table_id
              },
              paginate: false
            })
        } else if (context.result.id) {
          // Single update
          (context.result as TableRow) = await context.service._patch(context.result.id,
            updatedFormulaColumns,
            {}
          )
        }
      } catch (err) {
        console.log(`An error has been encountered when updating the rows containing the updated formula (${err.message}).`)
      }
    }
    return context
  }
}
