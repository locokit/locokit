import { SERVICES } from '@locokit/definitions'
import type { WorkspaceData, WorkspacePatch } from '@locokit/sdk'
import { sdkClient } from '../sdk'

const ITEMS_PER_PAGE = 10

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getWorkspace(id: string, params?: any) {
  return await sdkClient.service(SERVICES.CORE_WORKSPACE).get(id, params)
}

export async function findWorkspaces(
  {
    params = {},
    pageIndex = 0,
    limit = ITEMS_PER_PAGE,
    sort = {
      createdAt: -1,
    },
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>
    pageIndex?: number
    limit?: number
    sort?: Record<string, number>
  } = {
    params: {},
    pageIndex: 0,
    limit: ITEMS_PER_PAGE,
    sort: {
      createdAt: -1,
    },
  },
) {
  return await sdkClient.service(SERVICES.CORE_WORKSPACE).find({
    query: {
      $limit: limit,
      $skip: pageIndex * limit,
      $sort: sort,
      ...params,
    },
  })
}

export async function createWorkspace(data: WorkspaceData) {
  return await sdkClient.service(SERVICES.CORE_WORKSPACE).create(data)
}

export async function patchWorkspace(id: string, data: WorkspacePatch) {
  return await sdkClient.service(SERVICES.CORE_WORKSPACE).patch(id, data)
}
