import { SERVICES } from '@locokit/definitions'
import { type UserGroupData } from '@locokit/sdk'
import { sdkClient } from '../sdk'

const ITEMS_PER_PAGE = 20

export async function findUserGroups(params: Record<string, string> = {}) {
  return await sdkClient.service(SERVICES.CORE_USERGROUP).find({
    query: {
      $limit: ITEMS_PER_PAGE,
      ...params,
    },
  })
}
