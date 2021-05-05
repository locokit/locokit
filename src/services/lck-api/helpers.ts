/* eslint-disable @typescript-eslint/camelcase */
import { Paginated } from '@feathersjs/feathers'
import saveAs from 'file-saver'
import {
  WorkBook,
  WorkSheet,
  XLSX$Utils
} from 'xlsx'

import {
  LckGroup,
  LckTableRow,
  LckTableRowData,
  LckTableViewColumn,
  SelectValue,
  LckUser,
  LckAttachment
} from './definitions'
import { lckServices } from './services'
import { lckClient } from './client'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { getColumnDisplayValue } from '../lck-utils/columns'
import FileType from 'file-type/browser'

/**
 * Contact the API for searching items.
 * Useful for autocomplete fields.
 *
 * @param columnTypeId
 * @param tableId
 * @param query
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

/**
 * Get the columns and rows from the current TableView
 *
 * @param tableViewId
 * @param filters
 * @return {Promise<{viewData: LckTableRow[], viewColumns: LckTableViewColumn[]}>}
 */
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

/**
 * Get value for data export
 *
 * @param currentColumn
 * @param currentRowValue
 * @returns string|undefined
 */
function getValueExport (currentColumn: LckTableViewColumn, currentRowValue: LckTableRowData): string|undefined {
  switch (currentColumn.column_type_id) {
    case COLUMN_TYPE.SINGLE_SELECT:
      return (getColumnDisplayValue(
        currentColumn,
        currentRowValue
      ) as SelectValue)?.label
    case COLUMN_TYPE.FILE:
      const values = getColumnDisplayValue(
        currentColumn,
        currentRowValue
      )
      if (Array.isArray(values) && values.length > 0) {
        return values.map(x => x.filename).join(', ')
      }
      return ''
    default:
      return getColumnDisplayValue(
        currentColumn,
        currentRowValue
      ) as string|undefined
  }
}

/**
 * Export data in xls
 *
 * @param tableViewId
 * @param filters
 * @param fileName
 */
export async function exportTableRowDataXLS (tableViewId: string, filters: object = {}, fileName = 'Export') {
  const { viewData, viewColumns } = await retrieveTableViewData(tableViewId, filters)
  const exportXLS = viewData.map((currentRow) => {
    const formatedData: Record<string, string | undefined> = {}
    // eslint-disable-next-line no-unused-expressions
    viewColumns.forEach(currentColumn => {
      const value = getValueExport(currentColumn, currentRow.data[currentColumn.id])
      const sanitizedValue = typeof value === 'string' ? value.replaceAll('\n', ' ') : value
      formatedData[currentColumn.text] = sanitizedValue as string
    })
    return formatedData
  })

  // Dynamic import
  import(/* webpackChunkName: "lck-sheetjs-xlsx" */'xlsx').then(XLSX => {
    const utils = XLSX.utils as XLSX$Utils
    const ws: WorkSheet = utils.json_to_sheet(exportXLS)
    const wb: WorkBook = utils.book_new()
    const exportName = fileName + '.xlsx'
    utils.book_append_sheet(wb, ws, 'Sheet 1')
    XLSX.writeFile(wb, exportName)
  })
}

/**
 * Export data in csv
 *
 * @param tableViewId
 * @param filters
 * @param fileName
 */
export async function exportTableRowDataCSV (tableViewId: string, filters: object = {}, fileName: string) {
  const { viewData, viewColumns } = await retrieveTableViewData(tableViewId, filters)
  let exportCSV = '\ufeff' + viewColumns.map(c => '"' + c.text + '"').join(',') + '\n'
  exportCSV += viewData.map(currentRow =>
    viewColumns.map(currentColumn => {
      const value = getValueExport(currentColumn, currentRow.data[currentColumn.id])
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

/**
 * Get the Blob data of an attachment.
 * Use a fetch request to inject Authorization header in HTTP Request.
 * It allows to retrieve protected files.
 *
 * @param url URL of the attachment
 * @returns Blob
 */
export async function getAttachmentBlob (url: string) {
  const jwtToken = await lckClient.authentication.getAccessToken()
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + jwtToken)
  // Fetch the image.
  const response = await fetch(url, { headers })

  // Create an object URL from the data.
  return await response.blob()
}

/**
 * Download an attachment
 * by retrieving the blob
 * then saving it to the user file sytem.
 *
 * Need to be improved with a signed request
 * instead of a download by the web browser.
 *
 * @param url URL of the attachment
 * @param filename Filename of the attachment
 * @param mime Mime Type of the attachment
 */
export async function downloadAttachment (url: string, filename: string, mime: string) {
  const blob = await getAttachmentBlob(url)
  saveAs(
    blob,
    filename,
    {
      type: `${mime};`
    }
  )
}

/**
 * Upload several files and returns all attachment ids
 */
export async function uploadMultipleFiles (fileList: FileList, workspaceId: string) {
  const uploadPromises: Promise<LckAttachment>[] = []
  for (let i = 0; i < fileList.length; i++) {
    uploadPromises.push(new Promise((resolve, reject) => {
      const file = fileList[i]
      const reader = new FileReader()
      // encode dataURI
      reader.readAsDataURL(file)

      // when encoded, upload
      reader.addEventListener('load', async () => {
        /**
         * Find the mime type of the file to upload
         */
        const fileType = await FileType.fromBlob(file)
        lckServices.upload.create({
          uri: reader.result as string,
          fileName: file.name,
          ...fileType
        }, {
          query: {
            workspaceId,
            fileName: file.name,
            ...fileType
          }
        })
          .then(resolve)
          .catch(reject)
      }, false)
    }))
  }
  return await Promise.all(uploadPromises)
}

export default {
  searchItems,
  exportTableRowDataXLS,
  exportTableRowDataCSV,
  getColumnDisplayValue,
  downloadAttachment,
  getAttachmentBlob,
  uploadMultipleFiles
}
