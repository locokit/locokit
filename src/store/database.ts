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

export async function retrieveDatabaseByWorkspaceId (workspaceId: string) {
  databaseState.loading = true
  try {
    const result = await lckClient.service('database').find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { workspace_id: workspaceId, $eager: 'tables' }
    })
    databaseState.data = result.data[0]
  } catch (error) {
    databaseState.error = error
  }
  databaseState.loading = false
}
