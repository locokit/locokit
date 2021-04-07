import { Hook, HookContext, Service } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableRow } from '../../models/tablerow.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { FunctionBuilder } from 'objection'
import { mergeSets } from '../../utils'
import { functions, getColumnsReferences, getSQLRequestFromFormula } from '../../utils/formulas'
import { GeneralError } from '@feathersjs/errors'
import { parse } from '../../utils/formulas/formulaParser'

function getColumnsToUpdate (
  columns: TableColumn[],
  columnsIdsTransmitted: string [],
  tableId: string,
  originalColumn?: TableColumn,
): Array<{
    columnIdOfUpdatedRow: string
    columnIdOfChildRow: string
    columnTypeIdOfUpdatedRow: COLUMN_TYPE
    relatedFormulaColumnsIds: string[]
  }> {
  const result: Array<{
    columnIdOfUpdatedRow: string
    columnIdOfChildRow: string
    columnTypeIdOfUpdatedRow: COLUMN_TYPE
    relatedFormulaColumnsIds: string[]
  }> = []
  columns.forEach(currentColumn => {
    if (columnsIdsTransmitted.includes(currentColumn.id) || currentColumn.column_type_id !== COLUMN_TYPE.FORMULA) {
      if (currentColumn.table_id === tableId) {
        result.push({
          columnIdOfUpdatedRow: originalColumn?.id as string,
          columnIdOfChildRow: currentColumn.id,
          columnTypeIdOfUpdatedRow: originalColumn?.column_type_id as COLUMN_TYPE,
          // relatedFormulaColumnsIds: currentColumn.children?.filter(c => c.column_type_id === COLUMN_TYPE.FORMULA).map(c => c.id) ?? [],
          relatedFormulaColumnsIds: currentColumn.children?.reduce((formulasColumns: string[], childColumn: TableColumn) => {
            if (childColumn.column_type_id === COLUMN_TYPE.FORMULA) formulasColumns.push(childColumn.id)
            return formulasColumns
          }, []) ?? [],
        })
      }
      if ((currentColumn.children ?? []).length > 0) {
        result.push(...getColumnsToUpdate(
          currentColumn.children as TableColumn[],
          columnsIdsTransmitted,
          tableId,
          originalColumn ?? currentColumn,
        ))
      }
    }
  })
  return result
}

function getLookedUpColumnsPatchPromisesAndFormulaToUpdate (
  currentRow: TableRow,
  linkedColumns: TableColumn[],
  currentChildrenRows: TableRow[],
  service: Service<TableRow>,
  columnsIdsTransmitted: string[],
): {
    lookedUpColumnsPatchPromises: Array<Promise<TableRow>>
    formulasToUpdate: Record<string, { rowIds: Set<string>, columnsIds: Set<string> }>
  } {
  const lookedUpColumnsPatchPromises: Array<Promise<TableRow>> = []
  const formulasToUpdate: Record<string, { rowIds: Set<string>, columnsIds: Set<string> }> = {}

  currentChildrenRows.forEach(currentChildRow => {
    // find columns to update in the currentChildRow
    const columnsToUpdate = getColumnsToUpdate(linkedColumns, columnsIdsTransmitted, currentChildRow.table_id)

    const currentFormulasIdsToUpdate: Set<string> = new Set()

    const newData: Record<string, {
      reference: string
      value: string
    }> = {}

    /**
     * For each column to update, we'll update the newData object.
     * Depending the column_type of the original column,
     * we'll use the currentValue directly, or destructure the currentValue in a { reference, value } object
     */
    columnsToUpdate.forEach(c => {
      // Save all the formula columns to update for the current row
      c.relatedFormulaColumnsIds.forEach(currentFormulasIdsToUpdate.add, currentFormulasIdsToUpdate)
      // Get the original value to update the LOOKED_UP_COLUMN of the current row
      const currentValue = currentRow.data[c.columnIdOfUpdatedRow]
      switch (c.columnTypeIdOfUpdatedRow) {
        case COLUMN_TYPE.USER:
          newData['data:' + c.columnIdOfChildRow] = {
            ...currentValue as { reference: string, value: string },
          }
          break
        case COLUMN_TYPE.MULTI_USER:
          newData['data:' + c.columnIdOfChildRow] = {
            reference: (currentValue as unknown as { reference: string, value: string[] }).reference,
            value: (currentValue as unknown as { reference: string, value: string[] }).value.join(', '),
          }
          break
        default:
          newData['data:' + c.columnIdOfChildRow] = {
            reference: currentRow.id,
            value: currentRow.data?.[c.columnIdOfUpdatedRow] as string,
          }
      }
    })

    /**
     * We use the _patch method instead of patch to avoid all hooks that will, for example,
     * forbid the update of LOOKED_UP_COLUMN... (checkColumnDefinitionMatching hook)
     */
    if (Object.keys(newData).length > 0) {
      lookedUpColumnsPatchPromises.push(
        service._patch(currentChildRow.id, newData, { query: { $noSelect: true } }),
      )
    }

    // Save all the formula columns to update for the current row
    if (currentFormulasIdsToUpdate.size > 0) {
      if (formulasToUpdate[currentChildRow.table_id]) {
        formulasToUpdate[currentChildRow.table_id].rowIds.add(currentChildRow.id)
        mergeSets(formulasToUpdate[currentChildRow.table_id].columnsIds, currentFormulasIdsToUpdate)
      } else {
        formulasToUpdate[currentChildRow.table_id] = {
          rowIds: new Set([currentChildRow.id]),
          columnsIds: currentFormulasIdsToUpdate,
        }
      }
    }
    if (currentChildRow.children) {
      const dataToUpdate = getLookedUpColumnsPatchPromisesAndFormulaToUpdate(
        currentRow,
        linkedColumns,
        currentChildRow.children,
        service,
        columnsIdsTransmitted,
      )
      lookedUpColumnsPatchPromises.push(...dataToUpdate.lookedUpColumnsPatchPromises)
      for (const tableId in dataToUpdate.formulasToUpdate) {
        const childFormulasToUpdate = dataToUpdate.formulasToUpdate[tableId]
        if (formulasToUpdate[tableId]) {
          mergeSets(formulasToUpdate[tableId].rowIds, childFormulasToUpdate.rowIds)
          mergeSets(formulasToUpdate[tableId].columnsIds, childFormulasToUpdate.columnsIds)
        } else {
          formulasToUpdate[tableId] = childFormulasToUpdate
        }
      }
    }
  })
  return { lookedUpColumnsPatchPromises, formulasToUpdate }
}

/**
 * Hook updating looked up columns linked to the current row
 * * by a field updated for the current row (tcr.table_column_from_id)
 * *
 */
export function computeLookedUpColumns (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    const updatedRows: TableRow[] = Array.isArray(context.result) ? context.result : [context.result]

    // find if some of the columns are linked to the updated ones via the table_column_relation
    const updatedColumnsWithChildren: TableColumn[] = context.params._meta.updatedColumnsWithChildren ?? await context.app.services.column.find({
      query: {
        id: {
          $in: context.params._meta.columnsIdsTransmitted,
        },
        $eager: 'children.^',
      },
      paginate: false,
    })

    // find if some of the rows are linked to the updated ones via the table_row_relation
    const updatedRowsWithChildren: TableRow[] = await context.app.services.row.find({
      query: {
        id: {
          $in: updatedRows.map(row => row.id),
        },
        $eager: '[children.^]',
      },
      paginate: false,
    })

    const allLookedUpColumnsPatchPromises: Array<Promise<TableRow>> = []
    const allFormulasToUpdate: Record<string, { rowIds: Set<string>, columnsIds: Set<string> }> = {}

    // Get related LOOKED_UP_COLUMNS and FORMULAS columns and rows to update them
    updatedRows.forEach(currentUpdatedRow => {
      const { lookedUpColumnsPatchPromises, formulasToUpdate } = getLookedUpColumnsPatchPromisesAndFormulaToUpdate(
        currentUpdatedRow,
        updatedColumnsWithChildren,
        updatedRowsWithChildren.find(r => r.id === currentUpdatedRow.id)?.children ?? [],
        context.service,
        context.params._meta.columnsIdsTransmitted,
      )
      // LOOKED_UP_COLUMNS promises
      allLookedUpColumnsPatchPromises.push(...lookedUpColumnsPatchPromises)
      // FORMULAS to update
      for (const tableId in formulasToUpdate) {
        if (allFormulasToUpdate[tableId]) {
          mergeSets(allFormulasToUpdate[tableId].rowIds, formulasToUpdate[tableId].rowIds)
          mergeSets(allFormulasToUpdate[tableId].columnsIds, formulasToUpdate[tableId].columnsIds)
        } else {
          allFormulasToUpdate[tableId] = formulasToUpdate[tableId]
        }
      }
    })
    // Update LOOKED_UP_COLUMNS
    await Promise.all(allLookedUpColumnsPatchPromises)

    // Update FORMULAS
    const formulaPatchPromises: Array<Promise<any>> = []
    // Make a patch request for each table to update the formula columns of specific rows
    for (const tableId in allFormulasToUpdate) {
      const { rowIds, columnsIds: formulaColumnsIds } = allFormulasToUpdate[tableId]
      if (rowIds.size > 0 && formulaColumnsIds.size > 0) {
        const formulaColumnsToUpdateData: Record<string, FunctionBuilder> = {}
        // Get the formula columns and the columns using in them
        const formulaColumnsToUpdateWithParents = await context.app.service('column').find({
          query: {
            id: {
              $in: [...formulaColumnsIds],
            },
            $eager: 'parents.^',
          },
          paginate: false,
        }) as TableColumn[] ?? []
        // Get an object containing the used columns
        const usedColumnsInFormula: Record<string, TableColumn> = formulaColumnsToUpdateWithParents.reduce((usedColumns: Record<string, TableColumn>, formulaColumn: TableColumn) => {
          if (Array.isArray(formulaColumn.parents)) {
            formulaColumn.parents.forEach(parentColumn => {
              usedColumns[parentColumn.id] = parentColumn
            })
          }
          return usedColumns
        }, {})
        // Get an object containing the references of each used column with the good cast
        const columnsReferences = getColumnsReferences(usedColumnsInFormula)
        formulaColumnsToUpdateWithParents.forEach(formulaColumn => {
          const formula = formulaColumn.settings?.formula
          // Only parsed the formula if it exists
          if (formula) {
            try {
              const formulaResult = parse(formula, { functions, columns: usedColumnsInFormula, columnsTypes: COLUMN_TYPE })
              formulaColumnsToUpdateData[`data:${formulaColumn.id}`] = getSQLRequestFromFormula(formulaResult, columnsReferences)
            } catch (error) {
              throw new GeneralError('Invalid formula: ' + (error.message as string), {
                code: 'INVALID_FORMULA_SYNTAX',
                location: error.location,
              })
            }
          }
        })
        formulaPatchPromises.push(
          context.service.patch(
            null,
            formulaColumnsToUpdateData,
            {
              query: {
                // Need to specify the table name for the id to make the select query (automatically
                // executed after the patch request) works (feathers-objection bug ?)
                'table_row.id': {
                  $in: [...rowIds],
                },
                table_id: tableId,
              },
              paginate: false,
            },
          ),
        )
      }
    }
    await Promise.all(formulaPatchPromises)
    return context
  }
}
