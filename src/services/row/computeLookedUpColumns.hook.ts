import { Hook, HookContext, Service } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableRow } from '../../models/tablerow.model'
import { TableColumn } from '../../models/tablecolumn.model'
import { functions, getColumnsReferences, ColumnsReferences, getSQLRequestFromFormula } from '../../formulas/formulas'
import { GeneralError } from '@feathersjs/errors'

const formulasParser = require('../../formulas/formulaParser.js')

function getColumnsToUpdate (
  columns: TableColumn[],
  tableId: string,
  originalColumn?: TableColumn
) {
  const result: {
    columnIdOfUpdatedRow: string,
    columnIdOfChildRow: string,
    columnTypeIdOfUpdatedRow: COLUMN_TYPE,
    formulaIdRelated: TableColumn[]
  }[] = []
  columns.forEach(currentColumn => {
    if (currentColumn.table_id === tableId && currentColumn.column_type_id !== COLUMN_TYPE.FORMULA) {
      result.push({
        columnIdOfUpdatedRow: originalColumn?.id as string,
        columnIdOfChildRow: currentColumn.id,
        columnTypeIdOfUpdatedRow: originalColumn?.column_type_id as COLUMN_TYPE,
        formulaIdRelated: currentColumn.children?.filter(c => c.column_type_id === COLUMN_TYPE.FORMULA) || []
      })
    }
    if ((currentColumn.children || []).length > 0) {
      result.push(...getColumnsToUpdate(
        currentColumn.children as TableColumn[],
        tableId,
        originalColumn || currentColumn
      ))
    }
  })
  return result
}

function getParsedFormula (formulaColumn: TableColumn, data: {}, columns: TableColumn[], columnsReferences: ColumnsReferences) {
  const formula = formulaColumn.settings?.formula
  // Only parsed the formula if it exists
  if (formula) {
    try {
      const formulaResult = formulasParser.parse(formula, { functions, columns: columns, columnsTypes: COLUMN_TYPE })
      return getSQLRequestFromFormula(formulaResult, columnsReferences)
    } catch (error) {
      throw new GeneralError('Invalid formula: ' + error.message, {
        code: 'INVALID_FORMULA_SYNTAX'
      })
    }
  }
  return {}
}

function makePatchRequest (
  currentRow: TableRow,
  linkedColumns: TableColumn[],
  currentChildrenRows: TableRow[],
  service: Service<TableRow>,
  columnService: Service<TableColumn>
): Promise<TableRow>[] {
  // update each child row, by setting the new value for all columns related to this row
  return currentChildrenRows.flatMap(currentChildRow => {
    // find columns to update in the currentChildRow
    const columnsToUpdate: {
      columnIdOfUpdatedRow: string,
      columnIdOfChildRow: string,
      columnTypeIdOfUpdatedRow: COLUMN_TYPE,
      formulaIdRelated: TableColumn[]
    }[] = getColumnsToUpdate(linkedColumns, currentChildRow.table_id)

    const newData: Record<string, {
        reference: string,
        value: string
      } | {}> = {}

    const formulasToUpdate: TableColumn[] = []

    /**
     * For each column to update, we'll update the newData object.
     * Depending the column_type of the original column,
     * we'll use the currentValue directly, or destructure the currentValue in a { reference, value } object
     */
    columnsToUpdate.forEach(c => {
      formulasToUpdate.push(...c.formulaIdRelated)
      const currentValue = currentRow.data[c.columnIdOfUpdatedRow]
      switch (c.columnTypeIdOfUpdatedRow) {
        case COLUMN_TYPE.USER:
          newData['data:' + c.columnIdOfChildRow] = {
            ...currentValue as { reference: string; value: string }
          }
          break
        case COLUMN_TYPE.MULTI_USER:
          newData['data:' + c.columnIdOfChildRow] = {
            reference: (currentValue as { reference: string; value: string }).reference,
            value: (currentValue as unknown as { reference: string; value: string[] }).value.join(', ')
          }
          break
        case COLUMN_TYPE.FORMULA:
          break
        default:
          newData['data:' + c.columnIdOfChildRow] = {
            reference: currentRow.id,
            value: currentRow.data?.[c.columnIdOfUpdatedRow] as string
          }
      }
    })

    /**
     * Now we can update the row,
     * and we use the _patch method instead of patch
     * to avoid all hooks that will, for example,
     * forbid the update of LOOKED_UP_COLUMN... (checkColumnDefinitionMatching hook)
     */
    const promises: Promise<TableRow>[] = [
      service._patch(currentChildRow.id, newData, { query: { $noSelect: true } })
    ]
    if (currentChildRow.children) {
      promises.push(...makePatchRequest(
        currentRow,
        linkedColumns,
        currentChildRow.children,
        service,
        columnService
      ))
    }
    return promises
  })
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
          $in: context.params._meta.columnsIdsTransmitted
        },
        $eager: 'children.^'
      },
      paginate: false
    })

    // if not, just return the context
    if (updatedColumnsWithChildren.length === 0) return context

    // first, find rows linked to this current row (trr.table_row_from_id)
    const updatedRowsWithChildren = await context.app.services.row.find({
      query: {
        id: {
          $in: updatedRows.map(row => row.id)
        },
        $eager: '[children.^]'
      },
      paginate: false
    }) as TableRow[]

    // update the rows linked to each updated row
    const rowPatchPromises: Promise<any>[] = []

    updatedRows.forEach(currentUpdatedRow => {
      rowPatchPromises.push(...makePatchRequest(
        currentUpdatedRow,
        updatedColumnsWithChildren,
        updatedRowsWithChildren.find(r => r.id === currentUpdatedRow.id)?.children || [],
        context.service,
        context.app.service('column')
      ))
    })

    await Promise.all(rowPatchPromises)

    return context
  }
}
