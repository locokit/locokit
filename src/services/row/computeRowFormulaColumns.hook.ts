import { GeneralError } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
import { TableRow } from '../../models/tablerow.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import {
  functions,
  getColumnIdsFromFormula,
  getColumnsReferences,
  getSQLRequestFromFormula,
} from '../../utils/formulas'
import { FunctionBuilder } from 'objection'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const formulasParser = require('../../utils/formulas/formulaParser.js')

/**
 * Hook to compute the formulas of the updated row(s) using the columns that have been changed.
 */
export function computeRowFormulaColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Get the updated columns and the linked ones
    const updatedColumnsWithChildren = await context.app.services.column.find({
      query: {
        id: {
          $in: context.params._meta.columnsIdsTransmitted,
        },
        $eager: '[children.^]',
      },
      paginate: false,
    }) as TableColumn[]

    context.params._meta.updatedColumnsWithChildren = updatedColumnsWithChildren

    // Create an object containing the columns references to use placeholders in the sql query
    // const columnsReferences = {}

    const formulaColumnsToUpdateIds: Set<string> = new Set()
    const formulaColumnsToUpdateData: Record<string, FunctionBuilder> = {}
    const allUsedColumnsInFormulas: Record<string, TableColumn> = {}

    // Iterate over the updated columns
    for (const updatedColumn of updatedColumnsWithChildren) {
      // Iterate over the child columns of the updated one
      for (const childColumn of (updatedColumn.children ?? [])) {
        // Check the formula one
        if (childColumn.column_type_id === COLUMN_TYPE.FORMULA) {
          const formula = childColumn.settings?.formula

          // Only parse the formula if it is not done yet and if the formula exists
          if (formula && !formulaColumnsToUpdateIds.has(childColumn.id)) {
            // Get all columns ids used in the formula
            const usedColumnIds = getColumnIdsFromFormula(formula)
            // Get all columns used in the formula with their original type if we don't compute it yet
            for (const usedColumnId of usedColumnIds) {
              if (!allUsedColumnsInFormulas[usedColumnId]) {
                let currentUsedColumn: TableColumn = (context.params._meta.columnsDefinitionByColumnId)[usedColumnId]
                if (currentUsedColumn.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
                  currentUsedColumn = context.app.service('column').get(childColumn.id, {
                    query: {
                      $eager: 'parents.^',
                    },
                  })
                }
                currentUsedColumn.settings.formula_type_id = currentUsedColumn.originalTypeId()
                allUsedColumnsInFormulas[usedColumnId] = currentUsedColumn
              }
            }
            try {
              // Parse the formula
              const formulaResult = formulasParser.parse(formula, { functions, columns: allUsedColumnsInFormulas, columnsTypes: COLUMN_TYPE })
              // Get the SQL request that will be use to update the formula
              formulaColumnsToUpdateData[`data:${childColumn.id}`] = getSQLRequestFromFormula(
                formulaResult,
                getColumnsReferences(allUsedColumnsInFormulas),
              )
              // Indicate that this formula column will be updated
              formulaColumnsToUpdateIds.add(childColumn.id)
            } catch (error) {
              throw new GeneralError('Invalid formula: ' + (error.message as string), {
                code: 'INVALID_FORMULA_SYNTAX',
              })
            }
          }
        }
      }
    }

    if (formulaColumnsToUpdateIds.size > 0) {
      // Add the formula columns keys that will be updated due to the original update (useful for looked_up_columns)
      context.params._meta.columnsIdsTransmitted.push(...formulaColumnsToUpdateIds)
      // Update the row(s)
      try {
        if (Array.isArray(context.result)) {
          // Multiple update
          (context.result as TableRow[]) = await context.service._patch(null,
            formulaColumnsToUpdateData,
            {
              query: {
                table_id: context.params.query?.table_id,
              },
              paginate: false,
            })
        } else if (context.result.id) {
          // Single update
          (context.result as TableRow) = await context.service._patch(context.result.id,
            formulaColumnsToUpdateData,
            {},
          )
        }
      } catch (err) {
        console.log(`An error has been encountered when updating the rows containing the updated formula (${err.message as string}).`)
      }
    }
    return context
  }
}
