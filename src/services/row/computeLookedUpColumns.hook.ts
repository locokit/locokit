import { Hook, HookContext, Service } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableRow } from '../../models/tablerow.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { FunctionBuilder } from 'objection'
import { mergeSets } from '../../utils'
import { functions, getColumnsReferences, getSQLRequestFromFormula } from '../../utils/formulas'
import { GeneralError } from '@feathersjs/errors'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const formulasParser = require('../../utils/formulas/formulaParser.js')

function getColumnsToUpdate (
  columns: TableColumn[],
  columnsIdsTransmitted: string [],
  tableId: string,
  originalColumn?: TableColumn,
): Array<{
    columnIdOfUpdatedRow: string
    columnIdOfChildRow: string
    columnTypeIdOfUpdatedRow: COLUMN_TYPE
    relatedFormulaColumns: TableColumn[]
  }> {
  const result: Array<{
    columnIdOfUpdatedRow: string
    columnIdOfChildRow: string
    columnTypeIdOfUpdatedRow: COLUMN_TYPE
    relatedFormulaColumns: TableColumn[]
  }> = []
  columns.forEach(currentColumn => {
    if (columnsIdsTransmitted.includes(currentColumn.id) || currentColumn.column_type_id !== COLUMN_TYPE.FORMULA) {
      if (currentColumn.table_id === tableId) {
        result.push({
          columnIdOfUpdatedRow: originalColumn?.id as string,
          columnIdOfChildRow: currentColumn.id,
          columnTypeIdOfUpdatedRow: originalColumn?.column_type_id as COLUMN_TYPE,
          relatedFormulaColumns: currentColumn.children?.filter(c => c.column_type_id === COLUMN_TYPE.FORMULA) ?? [],
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
    formulasToUpdate: Record<string, { rowIds: Set<string>, columns: TableColumn[] }>
  } {
  // update each child row, by setting the new value for all columns related to this row
  const lookedUpColumnsPatchPromises: Array<Promise<TableRow>> = []
  const formulasToUpdate: Record<string, { rowIds: Set<string>, columns: TableColumn[] }> = {}

  currentChildrenRows.forEach(currentChildRow => {
    // find columns to update in the currentChildRow
    const columnsToUpdate = getColumnsToUpdate(linkedColumns, columnsIdsTransmitted, currentChildRow.table_id)

    const rowFormulasToUpdate: TableColumn[] = []

    const newData: Record<string, {
      reference: string
      value: string
    } | {}> = {}

    /**
     * For each column to update, we'll update the newData object.
     * Depending the column_type of the original column,
     * we'll use the currentValue directly, or destructure the currentValue in a { reference, value } object
     */
    columnsToUpdate.forEach(c => {
      // Save all the formula columns to update for the current row
      rowFormulasToUpdate.push(...c.relatedFormulaColumns)
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
            reference: (currentValue as { reference: string, value: string }).reference,
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
    if (rowFormulasToUpdate.length > 0) {
      formulasToUpdate[currentChildRow.table_id] = {
        rowIds: new Set([currentChildRow.id]),
        columns: rowFormulasToUpdate,
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
        if (Object.prototype.hasOwnProperty.call(formulasToUpdate, tableId)) {
          mergeSets(formulasToUpdate[tableId].rowIds, childFormulasToUpdate.rowIds)
          formulasToUpdate[tableId].columns.push(...childFormulasToUpdate.columns)
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

    // find if some of the columns are linked to other via table_column_relation
    const updatedColumnsWithChildren: TableColumn[] = context.params._meta.updatedColumnsWithChildren || await context.app.services.column.find({
      query: {
        id: {
          $in: context.params._meta.columnsIdsTransmitted,
        },
        $eager: 'children.^',
      },
      paginate: false,
    })

    // if not, just return the context
    if (updatedColumnsWithChildren.length === 0) return context

    // first, find rows linked to this current row (trr.table_row_from_id)
    const updatedRowsWithChildren = await context.app.services.row.find({
      query: {
        id: {
          $in: updatedRows.map(row => row.id),
        },
        $eager: '[children.^]',
      },
      paginate: false,
    }) as TableRow[]

    const allLookedUpColumnsPatchPromises: Array<Promise<TableRow>> = []
    const allFormulasToUpdate: Record<string, { rowIds: Set<string>, columns: TableColumn[] }> = {}

    // Get LOOKED_UP_COLUMNS and FORMULAS to update linked to each updated row
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
        if (Object.prototype.hasOwnProperty.call(allFormulasToUpdate, tableId)) {
          mergeSets(allFormulasToUpdate[tableId].rowIds, formulasToUpdate[tableId].rowIds)
          allFormulasToUpdate[tableId].columns.push(...formulasToUpdate[tableId].columns)
        } else {
          allFormulasToUpdate[tableId] = formulasToUpdate[tableId]
        }
      }
    })
    // Update LOOKED_UP_COLUMNS
    await Promise.all(allLookedUpColumnsPatchPromises)

    // Update FORMULAS
    if (Object.keys(allFormulasToUpdate).length > 0) {
      const formulaPatchPromises: Array<Promise<any>> = []
      // Make a patch request for each table to update the formula columns of specific rows
      for (const tableId in allFormulasToUpdate) {
        const { rowIds, columns: formulasToUpdate } = allFormulasToUpdate[tableId]
        if (rowIds.size > 0 && formulasToUpdate.length > 0) {
          const formulaColumnsToUpdateData: Record<string, FunctionBuilder> = {}
          // TODO Make multiple requests to avoid to have duplicated parents ?
          const formulaColumnsWithParents = await context.app.service('column').find({
            query: {
              id: {
                $in: formulasToUpdate.map(column => column.id),
              },
              $eager: 'parents.^',
            },
            paginate: false,
          }) as TableColumn[] ?? []
          const usedColumnsInFormula: Record<string, TableColumn> = formulaColumnsWithParents.reduce((pV: Record<string, TableColumn>, formulaColumn: TableColumn) => {
            if (Array.isArray(formulaColumn.parents)) {
              formulaColumn.parents.forEach(parentColumn => {
                parentColumn.settings.formula_type_id = parentColumn.originalTypeId()
                pV[parentColumn.id] = parentColumn
              })
            }
            return pV
          }, {})
          const columnsReferences = getColumnsReferences(usedColumnsInFormula)
          formulasToUpdate.forEach(formulaColumn => {
            const formula = formulaColumn.settings?.formula
            // Only parsed the formula if it exists
            if (formula) {
              try {
                const formulaResult = formulasParser.parse(formula, { functions, columns: usedColumnsInFormula, columnsTypes: COLUMN_TYPE })
                formulaColumnsToUpdateData[`data:${formulaColumn.id}`] = getSQLRequestFromFormula(formulaResult, columnsReferences)
              } catch (error) {
                throw new GeneralError('Invalid formula: ' + (error.message as string), {
                  code: 'INVALID_FORMULA_SYNTAX',
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
                  id: {
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
    }
    return context
  }
}
