import { NotAcceptable } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  functions,
  notImplementedInFormulaColumnTypes,
  getColumnIdsFromFormula,
  getSQLRequestFromFormula,
  getColumnsReferences,
} from '../../utils/formulas'
import { TableColumn } from '../../models/tablecolumn.model'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const formulasParser = require('../../utils/formulas/formulaParser.js')

/**
 * Is the column a formula column ?
 *
 * @param {HookContext} context
 * @returns {boolean}
 */
export const isFormulaColumn = () => (
  context: Partial<HookContext>,
): boolean => {
  return (context.type === 'before' && context.data?.column_type_id === COLUMN_TYPE.FORMULA) ||
         (context.type === 'after' && context.result?.column_type_id === COLUMN_TYPE.FORMULA)
}

/**
 * Parse the formula if it is valid or throw an exception.
*/
export function parseFormula (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Get the input formula
    const newFormula = context.data.settings?.formula

    if (newFormula) {
      // Get the updated column on update
      const updatedColumn = context.id ? await context.service.get(context.id) : new TableColumn()

      // Get the columns ids specified in the formula
      const columnsIds: string[] = getColumnIdsFromFormula(newFormula)
      let columnsUsedInFormula: TableColumn[] = []
      const columnsUsedInFormulaObject: Record<string, TableColumn> = {}

      if (columnsIds.length > 0) {
        // Load the specified columns in the formula which are included in the same table as the created / updated one.
        columnsUsedInFormula = await context.service.find({
          query: {
            id: {
              $in: columnsIds,
            },
            table_id: context.data?.table_id || updatedColumn.table_id,
            $eager: 'parents.^',
          },
          paginate: false,
        })

        // Check that the specified columns exist
        if (columnsUsedInFormula.length !== columnsIds.length) {
          throw new NotAcceptable('Invalid formula: please check the columns identifiers.', {
            code: 'INVALID_FORMULA_COLUMN',
          })
        }

        // Check that the columns types are valid
        columnsUsedInFormula.forEach(column => {
          // Set the original column type
          column.settings.formula_type_id = column.originalTypeId()
          if (column.id === context.id || notImplementedInFormulaColumnTypes.includes(column.settings.formula_type_id)) {
            throw new NotAcceptable(`Invalid formula: the following column can't be used in a formula: ${column.text}.`, {
              code: 'INVALID_FORMULA_COLUMN_TYPE',
            })
          }
          columnsUsedInFormulaObject[column.id] = column
        })
      }

      // Only parse the formula on creation or if it has been changed
      if (context.method === 'create' || updatedColumn.settings?.formula !== newFormula) {
        try {
          const newParsedFormula = formulasParser.parse(newFormula, { functions, columns: columnsUsedInFormulaObject, columnsTypes: COLUMN_TYPE })
          // Add the formula type
          context.data.settings.formula_type_id = newParsedFormula.type
          // Add additional data in _meta
          context.params._meta = {
            ...context.params._meta,
            columnsUsedInFormula: columnsUsedInFormulaObject,
            newParsedFormula,
          }
        } catch (error) {
          throw new NotAcceptable(`Invalid formula: ${(error.message as string)}`, {
            code: 'INVALID_FORMULA_SYNTAX',
          })
        }
      }
    }
    return context
  }
}

/**
 * Hook updating data for rows related to the current column.
 * The parseFormula hook needs to be executed before.
 */
export function updatedRelatedRowsFormula (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Only update the related rows if the formula has been parsed (and then has been changed)
    if (context.params._meta?.newParsedFormula) {
      // Create an object containing the columns references to use named placeholders in the sql query
      const columnsReferences = getColumnsReferences(context.params._meta.columnsUsedInFormula)
      // Launch request
      try {
        await context.app.service('row').patch(null, {
          [`data:${context.result.id as string}`]: getSQLRequestFromFormula(context.params._meta.newParsedFormula, columnsReferences),
        },
        {
          query: {
            table_id: context.result.table_id,
          },
          paginate: false,
        })
      } catch (err) {
        console.log(`An error has been encountered when updating the rows containing the updated formula (${err.message as string}).`)
      }
    }
    return context
  }
}
