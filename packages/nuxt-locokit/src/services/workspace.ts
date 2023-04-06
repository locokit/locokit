import { sdkClient } from './api'

const ITEMS_PER_PAGE = 10

export async function findWorkspaces(params = {}) {
  try {
    return await sdkClient.service('workspace').find(params)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function createWorkspace(data: {
  name: string
  documentation: string | null
  public: boolean
  settings?: {
    color: string | null
    backgroundColor: string | null
    icon: string | null
  }
}) {
  try {
    return await sdkClient.service('workspace').create(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}
