/* eslint-disable @typescript-eslint/camelcase */
import lckClient from '@/services/lck-api'
import { BaseState } from './state'

class Database {
  text = ''
  tables = []
}

class DatabaseState extends BaseState<Database> {
}

export const databaseState: DatabaseState = {
  loading: false,
  error: null,
  data: new Database()
}

export async function retrieveDatabaseTableAndViewsDefinitions (databaseId: string) {
  databaseState.loading = true
  try {
    const result = await lckClient.service('database').get(databaseId, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { $eager: 'tables.[columns]' }
    })
    databaseState.data = result
    return result
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableColumsAndTableRows (tableId: string) {
  databaseState.loading = true
  try {
    return await lckClient.service('table').get(tableId, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { $eager: '[columns, rows]' }
    })
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableColumns (tableId: string) {
  databaseState.loading = true
  try {
    const result = await lckClient.service('column').find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { table_id: tableId, $limit: 50 }

    })
    return result.data
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableRows (tableId: string, pageIndex = 0) {
  databaseState.loading = true
  const ITEMS_PER_PAGE = 10

  try {
    return await lckClient.service('row').find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: {
        table_id: tableId,
        $limit: ITEMS_PER_PAGE,
        $skip: pageIndex * ITEMS_PER_PAGE
      }
    })
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableRowsWithSkipAndLimit (
  tableId: string,
  skip = 0,
  limit = 20,
  sort = {
    createdAt: 1
  }
) {
  databaseState.loading = true
  try {
    return await lckClient.service('row').find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: {
        table_id: tableId,
        $limit: limit,
        $skip: skip,
        $sort: sort
      }
    })
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function retrieveTableViews (tableId: string) {
  databaseState.loading = true

  try {
    const result = await lckClient.service('view').find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { table_id: tableId }
    })
    return result.data
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}

export async function saveTableData (formData: object) {
  databaseState.loading = true

  try {
    const result = await lckClient.service('row').create(formData)
    databaseState.loading = false
    return result
  } catch ({ code, name }) {
    databaseState.loading = false
    return { code, name }
  }
}

export async function deleteTableData (rowId: string) {
  databaseState.loading = true

  try {
    const result = await lckClient.service('row').remove(rowId)
    databaseState.loading = false
    return result
  } catch ({ code, name }) {
    databaseState.loading = false
    return { code, name }
  }
}

export async function patchTableData (rowId: string, formData: object) {
  databaseState.loading = true
  try {
    const result = await lckClient.service('row').patch(rowId, formData)
    return result
  } catch ({ code, name }) {
    databaseState.error = new Error(`${code}: ${name}`)
  }
  databaseState.loading = false
}
