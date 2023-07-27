import { SERVICES } from '@locokit/definitions'
import { sdkClient } from './api'

const ITEMS_PER_PAGE = 20

export async function findUserGroups(params: Record<string, string> = {}) {
  return await sdkClient.service(SERVICES.CORE_USERGROUP).find({
    query: {
      $limit: ITEMS_PER_PAGE,
      ...params,
    },
  })
}

export async function updateUserGroup(data: Record<string, string> = {}) {
  return await sdkClient.service(SERVICES.CORE_USERGROUP).create(data)
}

export async function removeUserGroup({
  userId,
  groupId,
}: {
  userId: string
  groupId: string
}) {
  return await sdkClient
    .service(SERVICES.CORE_USERGROUP)
    .remove(`${userId},${groupId}`)
}
