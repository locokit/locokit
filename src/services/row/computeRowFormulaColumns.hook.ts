import { GeneralError } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { TableColumn } from '../../models/tablecolumn.model'
import { TableRow } from '../../models/tablerow.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import {
  functions,
  getColumnsReferences,
  getSQLRequestFromFormula
} from '../../formulas/formulas'
import { FunctionBuilder } from 'objection'

const formulasParser = require('../../formulas/formulaParser.js')

/**
 * Compute the formulas of the row if necessary.
 */
export function computeRowFormulaColumns () : Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Get the updated columns and the linked ones
    const updatedColumnsWithChildren = await context.app.services.column.find({
      query: {
        id: {
          $in: context.params._meta.columnsIdsTransmitted
        },
        $eager: 'children.^'
      },
      paginate: false
    }) as TableColumn[]

    context.params._meta.updatedColumnsWithChildren = updatedColumnsWithChildren

    // Create an object containing the columns references to use placeholders in the sql query
    const columnsReferences = getColumnsReferences(context.params._meta?.columns)

    const formulaColumnsToUpdateIds: Set<string> = new Set()
    const formulaColumnsToUpdateData:Record<string, FunctionBuilder> = {}

    updatedColumnsWithChildren.forEach(updatedColumn => {
      // Get the linked formula columns
      (updatedColumn.children || []).forEach(childColumn => {
        if (childColumn.column_type_id === COLUMN_TYPE.FORMULA) {
          const formula = childColumn.settings?.formula

          // Only parsed the formula if it is not done yet and the formula exists
          if (formula && !formulaColumnsToUpdateIds.has(childColumn.id)) {
            try {
              const formulaResult = formulasParser.parse(formula, { functions, columns: context.params._meta.columns, columnsTypes: COLUMN_TYPE })
              formulaColumnsToUpdateData[`data:${childColumn.id}`] = getSQLRequestFromFormula(formulaResult, columnsReferences)
              formulaColumnsToUpdateIds.add(childColumn.id)
            } catch (error) {
              throw new GeneralError('Invalid formula: ' + error.message, {
                code: 'INVALID_FORMULA_SYNTAX'
              })
            }
          }
        }
      })
    })

    if (formulaColumnsToUpdateIds.size > 0) {
      // Add the formula columns keys that will be updated due to the original update (useful for looked_up_columns)
      // context.params._meta.columnsIdsTransmitted.push(...formulaColumnsToUpdateIds)
      // Update the row(s)
      try {
        if (Array.isArray(context.result)) {
          // Multiple update
          (context.result as TableRow[]) = await context.service._patch(null,
            formulaColumnsToUpdateData,
            {
              query: {
                table_id: context.params.query?.table_id
              },
              paginate: false
            })
        } else if (context.result.id) {
          // Single update
          (context.result as TableRow) = await context.service._patch(context.result.id,
            formulaColumnsToUpdateData,
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
