import { NotAcceptable } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  functions,
  notImplementedInFormulaColumnTypes,
  getColumnIdsFromFormula,
  getColumnsReferences,
  getSQLRequestFromFormula
} from '../../formulas/formulas'
import { TableColumn } from '../../models/tablecolumn.model'

const formulasParser = require('../../formulas/formulaParser.js')

/**
 * Is the column a formula column ?
 *
 * @param {HookContext} context
 * @returns {boolean}
 */
export const isFormulaColumn = () => (
  context: Partial<HookContext>
): boolean => {
  return (context.type === 'before' && context.data?.column_type_id === COLUMN_TYPE.FORMULA) ||
         (context.type === 'after' && context.result?.column_type_id === COLUMN_TYPE.FORMULA)
}

/**
 * Parse the formula if it is valid or throw an exception.
*/
export function checkFormula (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Get the input formula
    const newFormula = context.data.settings?.formula

    if (newFormula) {
      // Get the columns ids specified in the formula
      const columnsIds: string[] = getColumnIdsFromFormula(newFormula)

      // Append the current one
      if (context.id) {
        columnsIds.push(context.id as string)
      }

      // Get the updated column if the table id param is not specified
      let updatedColumn = new TableColumn()
      if (!context.data?.table_id) {
        updatedColumn = context.id && await context.service.get(context.id)
      }

      // Load the specified columns in the formula which are included in the same table as the updated one and this one.
      const formulaColumns: TableColumn[] = await context.service.find({
        query: {
          id: {
            $in: columnsIds
          },
          table_id: context.data?.table_id || updatedColumn.table_id
        },
        paginate: false
      })

      // Check that the specified columns exist and that the current one is not included in the formula
      if (formulaColumns.length !== columnsIds.length) {
        throw new NotAcceptable('Invalid formula: please check the columns identifiers.', {
          code: 'INVALID_FORMULA_COLUMN'
        })
      }

      // Get the updated column and check that the column types are valid
      let updatedColumnIndex = -1
      formulaColumns.forEach((column, index) => {
        if (column.id === context.id) updatedColumnIndex = index
        else if (notImplementedInFormulaColumnTypes.includes(column.column_type_id)) {
          throw new NotAcceptable(`Invalid formula: the following column can't be used in a formula : ${column.text}.`, {
            code: 'INVALID_FORMULA_COLUMN_TYPE'
          })
        }
      })
      if (updatedColumnIndex > -1) {
        updatedColumn = formulaColumns.splice(updatedColumnIndex, 1)[0]
      }

      // Only parse the formula on creation or if it has been changed
      if (context.method === 'create' || updatedColumn.settings?.formula !== newFormula) {
        try {
          const newParsedFormula = formulasParser.parse(newFormula, { functions, columns: formulaColumns, columnsTypes: COLUMN_TYPE })
          // Add the formula type
          context.data.settings.formula_type_id = newParsedFormula.type
          // Add additional data in _meta
          context.params._meta = {
            ...context.params._meta,
            formulaColumns,
            newParsedFormula
          }
        } catch (error) {
          throw new NotAcceptable('Invalid formula: ' + error.message, {
            code: 'INVALID_FORMULA_SYNTAX'
          })
        }
      }
    }
    return context
  }
}

/**
 * Hook updating data for rows related to the current column.
 * The checkFormula hook needs to be executed before.
 */
export function updatedRelatedRowsFormula (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Only update the related rows if the formula has been parsed (and then has been changed)
    if (context.params._meta?.newParsedFormula) {
      // Create an object containing the columns references to use named placeholders in the sql query
      const columnsReferences = getColumnsReferences(context.params._meta.formulaColumns)
      // Launch request
      try {
        await context.app.service('row').patch(null, {
          [`data:${context.result.id}`]: getSQLRequestFromFormula(context.params._meta.newParsedFormula, columnsReferences)
        },
        {
          query: {
            table_id: context.result.table_id
          },
          paginate: false
        })
      } catch (err) {
        console.log(`An error has been encountered when updating the rows containing the updated formula (${err.message}).`)
      }
    }
    return context
  }
}
