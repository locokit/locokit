import lckClient from '@/services/lck-api'
import { BaseState } from './state'

class Workspace {
  text = ''
}

class WorkspaceData {
  workspaces: Workspace[] = []
}

class WorkspaceState extends BaseState<WorkspaceData> {}

export const workspaceState: WorkspaceState = {
  loading: false,
  error: null,
  data: {
    workspaces: []
  }
}

export async function retrieveWorkspaces () {
  workspaceState.loading = true
  try {
    const result = await lckClient.service('workspace').find()
    workspaceState.data.workspaces = result.data
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}

export async function retrieveChapters (workspaceId: number) {
  workspaceState.loading = true
  try {
    const result = await lckClient.service('chapter').find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { workspace_id: workspaceId, $eager: 'pages' }
    })
    return result.data
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}

export async function retrieveTables () {
  workspaceState.loading = true
  try {
    const result = await lckClient.service('table').find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { $joinRelation: 'columns' }
    })
    await lckClient.service('table').create({
      text: 'Pouet',
      // eslint-disable-next-line @typescript-eslint/camelcase
      database_id: 1
    })
    return result.data
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}

export async function retrieveRows () {
  workspaceState.loading = true
  try {
    const result = await lckClient.service('row').find()
    return result.data
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}
