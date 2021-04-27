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
import { parse } from '../../utils/formulas/formulaParser'

/**
 * Hook to compute the formulas of the updated row(s) using the columns that have been changed.
 */
export function computeRowFormulaColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    // Get the updated columns and the linked ones
    const updatedColumnsWithChildren = context.params._meta.updatedColumnsWithChildren ?? await context.app.services.column.find({
      query: {
        id: {
          $in: context.params._meta.columnsIdsTransmitted,
        },
        $eager: '[children.^]',
      },
      paginate: false,
    }) as TableColumn[]

    context.params._meta.updatedColumnsWithChildren = updatedColumnsWithChildren

    // The list of the formula columns to update
    let formulaColumnsToUpdate: TableColumn[] = []
    // The set of the ids of the formula columns to update
    const formulaColumnsToUpdateIds: Set<string> = new Set()
    // An object containing for each formula column to update, the related sql request
    const formulaColumnsToUpdateData: Record<string, FunctionBuilder> = {}
    // An object containing the columns using in the formulas
    const allUsedColumnsInFormulas: Record<string, TableColumn> = {}

    if (context.method === 'create') {
      // Get all formula columns on create
      formulaColumnsToUpdate = (context.params._meta.columns as TableColumn[]).filter(column =>
        column.column_type_id === COLUMN_TYPE.FORMULA &&
        !context.params._meta.columnsIdsTransmitted.includes(column.id),
      )
    } else {
      // Only get the formula columns which use the updated columns
      // Iterate over the updated columns
      for (const updatedColumn of updatedColumnsWithChildren) {
        // Iterate over the child columns of the updated one
        for (const childColumn of (updatedColumn.children ?? [])) {
          if (childColumn.column_type_id === COLUMN_TYPE.FORMULA) {
            formulaColumnsToUpdate.push(childColumn)
          }
        }
      }
    }

    for (const formulaColumn of formulaColumnsToUpdate) {
      const formula = formulaColumn.settings?.formula

      // Only parse the formula if it is not done yet and if the formula exists
      if (formula && !formulaColumnsToUpdateIds.has(formulaColumn.id)) {
        // Get all columns ids used in the formula
        const usedColumnIds = getColumnIdsFromFormula(formula)
        // Get all columns used in the formula with their original type if we don't compute it yet
        for (const usedColumnId of usedColumnIds) {
          if (!allUsedColumnsInFormulas[usedColumnId]) {
            let currentUsedColumn: TableColumn = (context.params._meta.columnsDefinitionByColumnId)[usedColumnId]
            if (currentUsedColumn) {
              if (currentUsedColumn.column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
                currentUsedColumn = await context.app.service('column').get(currentUsedColumn.id, {
                  query: {
                    $eager: 'parents.^',
                  },
                })
              }
              allUsedColumnsInFormulas[usedColumnId] = currentUsedColumn
            }
          }
        }
        try {
          // Parse the formula
          const formulaResult = parse(formula, { functions, columns: allUsedColumnsInFormulas, columnsTypes: COLUMN_TYPE })
          // Get the SQL request that will be used to update the formula
          formulaColumnsToUpdateData[`data:${formulaColumn.id}`] = getSQLRequestFromFormula(
            formulaResult,
            getColumnsReferences(allUsedColumnsInFormulas),
          )
          // Indicate that this formula column will be updated
          formulaColumnsToUpdateIds.add(formulaColumn.id)
        } catch (error) {
          throw new GeneralError('Invalid formula: ' + (error.message as string), {
            code: 'INVALID_FORMULA_SYNTAX',
            location: error.location,
          })
        }
      }
    }

    if (formulaColumnsToUpdateIds.size === 0) return context

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
              // Need to specify the table name for the id to make the select query (automatically
              // executed after the patch request) works
              'table_row.id': {
                $in: context.result.map(row => row.id),
              },
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
      if (err.code !== 404) {
        throw new GeneralError('An error has been encountered when the formulas have been computed')
      }
    }
    return context
  }
}
