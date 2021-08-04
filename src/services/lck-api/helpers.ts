/* eslint-disable @typescript-eslint/camelcase */
import { Paginated } from '@feathersjs/feathers'
import saveAs from 'file-saver'
import {
  WorkBook,
  WorkSheet,
  XLSX$Utils,
} from 'xlsx'

import {
  LckGroup,
  LckTableRow,
  LckTableRowData,
  LckTableViewColumn,
  SelectValue,
  LckUser,
  LckAttachment,
  LckTableView,
  LckWorkspace,
  LckTableColumn,
  LckTableRowDataComplex,
  LckPage,
} from './definitions'
import { lckServices } from './services'
import { lckClient } from './client'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import { getColumnDisplayValue, getColumnTypeId } from '../lck-utils/columns'
import FileType from 'file-type/browser'
import { parseISO } from 'date-fns'

/**
 * Contact the API for searching items.
 * Useful for autocomplete fields.
 *
 * @param columnTypeId
 * @param tableId
 * @param query
 * @param groupId
 */
export async function searchItems ({
  columnTypeId,
  tableId,
  query,
  groupId,
}: { columnTypeId: number; tableId: string; query: object; groupId: string }) {
  let items = null
  if (columnTypeId === COLUMN_TYPE.USER || columnTypeId === COLUMN_TYPE.MULTI_USER) {
    const result = await lckServices.user.find({
      query: {
        blocked: false,
        name: {
          $ilike: `%${query}%`,
        },
        $sort: {
          name: 1,
        },
      },
    }) as Paginated<LckUser>
    items = result.data.map(d => ({
      label: d.name,
      value: d.id,
    }))
  } else if (columnTypeId === COLUMN_TYPE.GROUP) {
    const result = await lckServices.group.find({
      query: {
        name: {
          $ilike: `%${query}%`,
        },
        $sort: {
          name: 1,
        },
      },
    }) as Paginated<LckGroup>
    items = result.data.map(d => ({
      label: d.name,
      value: d.id,
    }))
    // eslint-disable-next-line @typescript-eslint/camelcase
  } else if (columnTypeId === COLUMN_TYPE.RELATION_BETWEEN_TABLES) {
    const result = await lckServices.tableRow.find({
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: tableId,
        text: {
          $ilike: `%${query}%`,
        },
        $lckGroupId: groupId,
        $sort: {
          text: 1,
        },
      },
    }) as Paginated<LckTableRow>
    items = result.data.map(d => ({
      label: d.text,
      value: d.id,
    }))
  }
  return items
}

/**
 * Search TableView
 * Find all tableviews matching a pattern
 *
 * @param query
 * @param workspaceId
 */
export async function searchTableView (query: object, workspaceId: string) {
  const tableViewResult = await lckServices.tableView.find({
    query: {
      'table:database.workspace_id': workspaceId,
      $joinRelation: 'table.[database]',
      $sort: {
        text: 1,
      },
      $select: ['table_view.text'],
      'table_view.text': {
        $ilike: `%${query}%`,
      },
    },
  }) as Paginated<LckTableView>
  return tableViewResult?.data.map(tr => ({
    text: tr.text,
    value: tr.id,
  }))
}

/**
 * Search Page
 * Find all pages matching a pattern
 * with possible additional filters
 * Also contains information on its chapter
 *
 * @param query
 * @param filters
 */
export async function searchPageWithChapter (query: object, filters: object = {}) {
  const pagesResult = await lckServices.page.find({
    query: {
      $joinRelation: 'chapter',
      $eager: 'chapter',
      $sort: {
        text: 1,
      },
      $select: ['page.text'],
      'page.text': {
        $ilike: `%${query}%`,
      },
      ...filters,
    },
  }) as Paginated<LckPage>
  return pagesResult?.data.map(page => ({
    text: `[${page?.chapter?.text}] ${page.text}`,
    value: page.id,
  }))
}

/**
 * Search Columns
 * Find all columns belonging to a table view and matching a pattern
 *
 * @param query
 * @param tableViewId
 */
export async function searchColumnsFromTableView (query: object, tableViewId: string) {
  const tableColumnResult = await lckServices.tableColumn.find({
    query: {
      'views.id': tableViewId,
      $joinRelation: 'views',
      $sort: {
        text: 1,
      },
      $select: ['table_column.text'],
      'table_column.text': {
        $ilike: `%${query}%`,
      },
      $or: [{
        column_type_id: COLUMN_TYPE.BOOLEAN,
      }, {
        settings: {
          formula_type_id: COLUMN_TYPE.BOOLEAN,
        },
      }],
    },
  }) as Paginated<LckTableColumn>
  return tableColumnResult.data.map(tc => ({
    text: tc.text,
    value: tc.id,
  }))
}

/**
 * Get columns and rows from the current TableView
 *
 * @param tableViewId
 * @param filters
 * @param groupId
 * @return {Promise<{viewData: LckTableRow[], viewColumns: LckTableViewColumn[]}>}
 */
async function retrieveTableViewData (tableViewId: string, filters: object = {}, groupId: string): Promise<{
  viewData: LckTableRow[];
  viewColumns: LckTableViewColumn[];
}> {
  const currentView = await lckServices.tableView.get(tableViewId, {
    query: {
      $eager: 'columns',
    },
  })
  currentView.columns = currentView.columns?.sort((a, b) => a.position - b.position).filter(c => c.displayed) || []
  const query: Record<string, string | number | object> = {
    table_view_id: tableViewId,
    $limit: -1,
    $sort: {
      createdAt: 1,
    },
    $lckGroupId: groupId,
    ...filters,
  }
  const viewData = await lckServices.tableRow.find({ query }) as LckTableRow[]

  return {
    viewData,
    viewColumns: currentView.columns,
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
        currentRowValue,
      ) as SelectValue)?.label
    case COLUMN_TYPE.FILE:
      const values = getColumnDisplayValue(
        currentColumn,
        currentRowValue,
      )
      if (Array.isArray(values) && values.length > 0) {
        return values.map(x => x.filename).join(', ')
      }
      return ''
    case COLUMN_TYPE.DATE:
    case COLUMN_TYPE.DATETIME:
      return currentRowValue as string
    default:
      return getColumnDisplayValue(
        currentColumn,
        currentRowValue,
      ) as string|undefined
  }
}

/**
 * Export data in xls
 *
 * @param tableViewId
 * @param filters
 * @param fileName
 * @param groupId
 */
export async function exportTableRowDataXLS (tableViewId: string, filters: object = {}, fileName = 'Export', groupId: string) {
  const { viewData, viewColumns } = await retrieveTableViewData(tableViewId, filters, groupId)
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
 * @param groupId
 */
export async function exportTableRowDataCSV (tableViewId: string, filters: object = {}, fileName: string, groupId: string) {
  const { viewData, viewColumns } = await retrieveTableViewData(tableViewId, filters, groupId)
  let exportCSV = '\ufeff' + viewColumns.map(c => '"' + c.text + '"').join(',') + '\n'
  exportCSV += viewData.map(currentRow =>
    viewColumns.map(currentColumn => {
      const value = getValueExport(currentColumn, currentRow.data[currentColumn.id])
      const sanitizedValue = typeof value === 'string' ? value.replaceAll('\n', ' ') : value
      return '"' + sanitizedValue + '"'
    }).join(','),
  ).join('\n')
  saveAs(
    new Blob([exportCSV]),
    (fileName === undefined ? 'Export' : fileName) + '.csv',
    {
      type: 'text/csv;charset=utf-8',
    },
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
      type: `${mime};`,
    },
  )
}

/**
 * Upload several files and returns all attachment ids
 *
 * @param fileList
 * @param workspaceId
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
          ...fileType,
        }, {
          query: {
            workspaceId,
            fileName: file.name,
            ...fileType,
          },
        })
          .then(resolve)
          .catch(reject)
      }, false)
    }))
  }
  return await Promise.all(uploadPromises)
}

/**
 * Get page with related chapter
 *
 * @param id
 */
export async function getPageWithChapters (id: string) {
  return await lckServices.page.get(id, {
    query: {
      $joinRelation: 'chapter',
      $eager: 'chapter',
      $sort: {
        text: 1,
      },
    },
  }) as LckPage
}

/**
 * Get workspace with all chapters and pages
 *
 * @param groupId
 */
export async function retrieveWorkspaceWithChaptersAndPages (groupId: string) {
  const group: LckGroup = await lckServices.group.get(groupId, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    query: { $eager: 'aclset' },
  })
  const workspace: LckWorkspace = await lckServices.workspace.get(group?.aclset?.workspace_id as string, {
    query: { $eager: '[chapters.[pages]]' },
  })
  return {
    ...workspace,
    chapters: workspace?.chapters?.map(c => ({
      ...c,
      pages: c.pages?.sort((a, b) => a.position - b.position),
    })),
  }
}

/**
 * Get page with all containers and blocks
 *
 * @param id
 */
export async function retrievePageWithContainersAndBlocks (id: string) {
  return await lckServices.page.get(id, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    query: { $eager: 'containers.[blocks.[displayTableView, displayField]]' },
  })
}

/**
 * Find specific view with columns, column's parents and action
 *
 * @param ids
 * @param skip
 */
export async function retrieveViewDefinition (ids: number[], skip = 0) {
  if (ids.length === 0) return []
  const result = await lckServices.tableView.find({
    // eslint-disable-next-line @typescript-eslint/camelcase
    query: {
      $eager: '[columns.[column_type, parents.^], actions]',
      $modifyEager: {
        columns: {
          transmitted: true,
        },
      },
      id: {
        $in: ids,
      },
      $skip: skip,
      $limit: 10,
    },
  }) as Paginated<LckTableView>

  // Reorder the columns of each view
  result.data.forEach(tableView => {
    tableView.columns = tableView.columns?.sort(
      (a: { position: number }, b: { position: number }) => (a.position < b.position ? -1 : 1)
    )
  })
  // Get the next views if there are ones
  if (result.limit + skip < result.total) {
    retrieveViewDefinition(ids, skip + result.limit).then(followingViews => {
      return result.data.concat(followingViews || [])
    })
  }
  return result.data
}

/**
 * Get records according to table view
 *
 * @param table_view_id
 * @param group_id
 * @param skip
 * @param limit
 * @param sort
 * @param filters
 */
export async function retrieveViewData (
  table_view_id: string,
  group_id: string,
  skip = 0,
  limit = 20,
  sort = {
    createdAt: 1,
  },
  filters = {},
) {
  return await lckServices.tableRow.find({
    // eslint-disable-next-line @typescript-eslint/camelcase
    query: {
      table_view_id,
      $lckGroupId: group_id,
      $limit: limit,
      $skip: skip,
      $sort: sort,
      ...filters,
    },
  })
}

/**
 * Convert every date field in a single data record in Date
 *
 * @param record
 * @param dateFields
 */
function convertDateInRecord (record: LckTableRow, dateFields: LckTableColumn[]) {
  dateFields.forEach(({ id, column_type_id }) => {
    if (!record.data[id]) return
    if (column_type_id === COLUMN_TYPE.LOOKED_UP_COLUMN) {
      if (!(record.data[id] as LckTableRowDataComplex).value) return
      (record.data[id] as LckTableRowDataComplex).value = parseISO((record.data[id] as LckTableRowDataComplex).value as string)
    } else {
      record.data[id] = parseISO(record.data[id] as string)
    }
  })
}

/**
 * Convert every date field in data records (from the LCK API) in Date
 * Match also formulas with
 * This allow prime calendar to be displayed with the good data
 *
 * @param records
 * @param fieldDefinition
 */
export function convertDateInRecords (records: LckTableRow | LckTableRow[], fieldDefinition: LckTableColumn[]): void {
  const dateFields = fieldDefinition.filter(f => {
    let keepField = false
    switch (f.column_type_id) {
      case COLUMN_TYPE.DATE:
      case COLUMN_TYPE.DATETIME:
        keepField = true
        break
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
      case COLUMN_TYPE.FORMULA:
        keepField = [
          COLUMN_TYPE.DATE,
          COLUMN_TYPE.DATETIME,
        ].includes(getColumnTypeId(f))
    }
    return keepField
  })
  if (Array.isArray(records)) {
    records.forEach(currentRecord => convertDateInRecord(currentRecord, dateFields))
  } else {
    convertDateInRecord(records, dateFields)
  }
}

export default {
  searchItems,
  searchPageWithChapter,
  searchTableView,
  searchColumnsFromTableView,
  exportTableRowDataXLS,
  exportTableRowDataCSV,
  getColumnDisplayValue,
  downloadAttachment,
  getAttachmentBlob,
  getPageWithChapters,
  uploadMultipleFiles,
  retrieveWorkspaceWithChaptersAndPages,
  retrieveTableViewData,
  retrieveViewData,
  retrieveViewDefinition,
  retrievePageWithContainersAndBlocks,
  convertDateInRecords,
}
