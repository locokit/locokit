import { sdkClient } from './api'

const ITEMS_PER_PAGE = 20

export async function findUserGroups(params: Record<string, string> = {}) {
  try {
    return await sdkClient.service('user-group').find({
      query: {
        $limit: ITEMS_PER_PAGE,
        ...params,
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function updateUserGroup(data: Record<string, string> = {}) {
  try {
    return await sdkClient.service('user-group').create(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function removeUserGroup({
  userId,
  groupId,
}: {
  userId: string
  groupId: string
}) {
  try {
    return await sdkClient.service('user-group').remove(`${userId},${groupId}`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}
