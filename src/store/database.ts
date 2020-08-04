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
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}
