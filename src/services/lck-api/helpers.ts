/* eslint-disable @typescript-eslint/camelcase */
import { Paginated } from '@feathersjs/feathers'
import {
  LckGroup,
  LckTableViewColumn,
  LckTableRow,
  LckUser
} from './definitions'
import { lckServices } from './services'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import saveAs from 'file-saver'
import XLSX from 'xlsx'
import { getColumnDisplayValue } from '../lck-utils/columns'

/**
 * Contact the API for searching items.
 * Useful for autocomplete fields.
 *
 * @param param0
 */
export async function searchItems ({
  columnTypeId,
  tableId,
  query
}: { columnTypeId: number; tableId: string; query: object }) {
  let items = null
  if (columnTypeId === COLUMN_TYPE.USER || columnTypeId === COLUMN_TYPE.MULTI_USER) {
    const result = await lckServices.user.find({
      query: {
        blocked: false,
        name: {
          $ilike: `%${query}%`
        }
      }
    }) as Paginated<LckUser>
    items = result.data.map(d => ({
      label: d.name,
      value: d.id
    }))
  } else if (columnTypeId === COLUMN_TYPE.GROUP) {
    const result = await lckServices.group.find({
      query: {
        name: {
          $ilike: `%${query}%`
        }
      }
    }) as Paginated<LckGroup>
    items = result.data.map(d => ({
      label: d.name,
      value: d.id
    }))
    // eslint-disable-next-line @typescript-eslint/camelcase
  } else if (columnTypeId === COLUMN_TYPE.RELATION_BETWEEN_TABLES) {
    const result = await lckServices.tableRow.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: tableId,
        text: {
          $ilike: `%${query}%`
        }
      }
    }) as Paginated<LckTableRow>
    items = result.data.map(d => ({
      label: d.text,
      value: d.id
    }))
  }
  return items
}

async function retrieveTableViewData (tableViewId: string, filters: object = {}): Promise<{
  viewData: LckTableRow[];
  viewColumns: LckTableViewColumn[];
}> {
  const currentView = await lckServices.tableView.get(tableViewId, {
    query: {
      $eager: 'columns'
    }
  })
  currentView.columns = currentView.columns?.sort((a, b) => a.position - b.position).filter(c => c.displayed) || []
  const query: Record<string, string | number | object> = {
    table_view_id: tableViewId,
    $limit: -1,
    $sort: {
      createdAt: 1
    },
    ...filters
  }
  const viewData = await lckServices.tableRow.find({ query }) as LckTableRow[]
  return {
    viewData,
    viewColumns: currentView.columns
  }
}

export async function exportTableRowDataXLS (tableViewId: string, filters: object = {}, fileName = 'Export') {
  const { viewData, viewColumns } = await retrieveTableViewData(tableViewId, filters)
  const exportXLS = viewData.map((currentRow) => {
    const formatedData: Record<string, string | undefined> = {}
    // eslint-disable-next-line no-unused-expressions
    viewColumns.forEach(currentColumn => {
      const value = getColumnDisplayValue(
        currentColumn,
        currentRow.data[currentColumn.id]
      )
      let sanitizedValue = value
      if (typeof value === 'string') sanitizedValue = value.replaceAll('\n', ' ')
      if ((value as { label: string | undefined; color: string | undefined; backgroundColor: string | undefined }).label) {
        sanitizedValue = (value as { label: string | undefined; color: string | undefined; backgroundColor: string | undefined }).label
      }
      formatedData[currentColumn.text] = sanitizedValue as string
    })
    return formatedData
  })
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportXLS)
  const wb: XLSX.WorkBook = XLSX.utils.book_new()
  const exportName = fileName + '.xlsx'
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1')
  XLSX.writeFile(wb, exportName)
}

export async function exportTableRowDataCSV (tableViewId: string, filters: object = {}, fileName: string) {
  const { viewData, viewColumns } = await retrieveTableViewData(tableViewId, filters)
  let exportCSV = '\ufeff' + viewColumns.map(c => '"' + c.text + '"').join(',') + '\n'
  exportCSV += viewData.map(currentRow =>
    viewColumns.map(currentColumn => {
      const value = getColumnDisplayValue(
        currentColumn,
        currentRow.data[currentColumn.id]
      )
      const sanitizedValue = typeof value === 'string' ? value.replaceAll('\n', ' ') : value
      return '"' + sanitizedValue + '"'
    }).join(',')
  ).join('\n')
  saveAs(
    new Blob([exportCSV]),
    (fileName === undefined ? 'Export' : fileName) + '.csv',
    {
      type: 'text/csv;charset=utf-8'
    }
  )
}

export default {
  searchItems,
  exportTableRowDataXLS,
  exportTableRowDataCSV,
  getColumnDisplayValue
}
