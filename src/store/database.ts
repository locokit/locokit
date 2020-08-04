/* eslint-disable @typescript-eslint/camelcase */
import lckClient from '@/services/lck-api'
import { BaseState } from './state'

class Database {
  text = ''
}

class DatabaseState extends BaseState<Database> {}

export const databaseState: DatabaseState = {
  loading: false,
  error: null,
  data: new Database()
}

export async function retrieveDatabaseByWorkspaceId (databaseId: string) {
  databaseState.loading = true
  try {
    const result = await lckClient.service('database').get(databaseId, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { $eager: 'tables' }
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
      query: { table_id: tableId }
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
