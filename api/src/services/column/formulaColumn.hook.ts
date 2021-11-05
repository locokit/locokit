import { GeneralError, NotAcceptable } from '@feathersjs/errors'
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  functions,
  implementedInFormulaColumnTypes,
  getColumnIdsFromFormula,
  getSQLRequestFromFormula,
  getColumnsReferences,
  EQUATED_TO_STRING_TYPES,
} from '../../utils/formulas'
import { TableColumn } from '../../models/tablecolumn.model'

import { parse } from '../../utils/formulas/formulaParser'

/**
 * Is the column a formula column ?
 * Based on the column_type_id specified in the context data if used in a before create hook,
 * on the item data in a before patch hook (the 'getCurrentItem' hook needs to be executed before)
 * or in the context result if used in an after hook.
 *
 * @param {HookContext} context
 * @returns {boolean}
 */
export function isFormulaColumn (context: HookContext): boolean {
  if (context.type === 'before') {
    if (context.method === 'create') {
      return context.data.column_type_id === COLUMN_TYPE.FORMULA
    } else if (context.method === 'patch') {
      return context.params._meta?.item.column_type_id === COLUMN_TYPE.FORMULA
    }
  } else if (context.type === 'after') {
    return context.result.column_type_id === COLUMN_TYPE.FORMULA
  }
  return false
}

/**
 * Parse the formula if it is valid or throw an exception.
*/
export function parseFormula (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Get the input formula
    const newFormula = context.data.settings?.formula

    if (newFormula) {
      // Get the existing column if it is an update
      const updatedColumn = context.id ? context.params._meta?.item : new TableColumn()

      // Only parse the formula on creation or if it has been changed
      if (context.method === 'create' || updatedColumn.settings?.formula !== newFormula) {
        const currentTableId = updatedColumn.table_id ?? context.data.table_id

        // The table id (explicit or implicit) is mandatory
        if (!currentTableId) throw new NotAcceptable('Invalid column: please specify the related table.')

        // Get the columns ids specified in the formula
        const columnsIds: string[] = getColumnIdsFromFormula(newFormula)
        let columnsUsedInFormula: TableColumn[] = []
        const columnsUsedInFormulaObject: Record<string, TableColumn> = {}

        if (columnsIds.length > 0) {
          // Load the specified columns in the formula which are included in the same table as the created / updated one.
          try {
            columnsUsedInFormula = await context.service.find({
              query: {
                id: {
                  $in: columnsIds,
                },
                table_id: currentTableId,
                $eager: 'parents.^',
              },
              paginate: false,
            })
          } catch (error) {
            // The parser will check if the specified columns are valid or not and
            // will indicate the location of the invalid ones
          }

          // Get the columns that can be used in a formula
          columnsUsedInFormula.forEach(column => {
            if (
              column.column_type_id !== COLUMN_TYPE.FORMULA &&
              column.column_type_id !== COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN &&
              implementedInFormulaColumnTypes.includes(column.originalTypeId())
            ) {
              columnsUsedInFormulaObject[column.id] = column
            }
          })
        }

        try {
          const newParsedFormula = parse(newFormula, { functions, columns: columnsUsedInFormulaObject, columnsTypes: COLUMN_TYPE })

          // Add the formula type
          context.data.settings.formula_type_id = EQUATED_TO_STRING_TYPES.includes(newParsedFormula.type)
            ? COLUMN_TYPE.STRING
            : newParsedFormula.type

          // Add additional data in _meta
          context.params._meta = {
            ...context.params._meta,
            columnsUsedInFormula: columnsUsedInFormulaObject,
            newParsedFormula,
          }
        } catch (error) {
          throw new NotAcceptable(`Invalid formula: ${(error.message as string)}`, {
            code: 'INVALID_FORMULA_SYNTAX',
            location: error.location,
          })
        }
      } else {
        // Keep the previous formula type id as the formula has not been changed
        context.data.settings.formula_type_id = updatedColumn?.settings?.formula_type_id
      }
    } else {
      throw new NotAcceptable('Invalid formula: must be defined', {
        code: 'INVALID_FORMULA',
      })
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
        if (err.code !== 404) {
          throw new GeneralError('An error has been encountered when updating the rows containing the updated formula')
        }
      }
    }
    return context
  }
}
