import { SERVICES } from '@locokit/definitions'
import type { WorkspaceData, WorkspacePatch } from '@locokit/sdk'
import { useLocoKitClient } from '../api'

const sdkClient = useLocoKitClient()

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
  try {
    return await sdkClient.service(SERVICES.CORE_WORKSPACE).find({
      query: {
        $limit: limit,
        $skip: pageIndex * limit,
        ...params,
        // $sort: sort,
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function createWorkspace(data: WorkspaceData) {
  return await sdkClient.service(SERVICES.CORE_WORKSPACE).create(data)
}

export async function patchWorkspace(id: string, data: WorkspacePatch) {
  return await sdkClient.service(SERVICES.CORE_WORKSPACE).patch(id, data)
}
