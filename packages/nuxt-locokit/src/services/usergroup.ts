import { sdkClient } from './api'

const ITEMS_PER_PAGE = 20

export async function findUserGroups(params: Record<string, string> = {}) {
  return await sdkClient.service('user-group').find({
    query: {
      $limit: ITEMS_PER_PAGE,
      ...params,
    },
  })
}

export async function updateUserGroup(data: Record<string, string> = {}) {
  return await sdkClient.service('user-group').create(data)
}

export async function removeUserGroup({
  userId,
  groupId,
}: {
  userId: string
  groupId: string
}) {
  return await sdkClient.service('user-group').remove(`${userId},${groupId}`)
}
