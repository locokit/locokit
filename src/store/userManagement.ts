/* eslint-disable @typescript-eslint/camelcase */
import lckClient from '@/services/lck-api'

// class UserCreateDTO {
//   email = ''
//   name = ''
//   password = ''
//   profile = ''
// }

interface UserGroupDTO {
  userId: number;
  groupId: string;
  role: string;
}

export async function retrieveUsersData (pageIndex = 0) {
  const ITEMS_PER_PAGE = 10

  try {
    return await lckClient.service('user').find({
      query: {
        $limit: ITEMS_PER_PAGE,
        $skip: pageIndex * ITEMS_PER_PAGE,
        $sort: { id: 1 }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function retrieveAllUsers () {
  const ITEMS_PER_PAGE = 150

  try {
    const res = await lckClient.service('user').find({
      query: {
        $limit: ITEMS_PER_PAGE,
        $sort: { id: 1 }
      }
    })
    return res.data
  } catch ({ code, name }) {
    return { code, name }
  }
}

export async function retrieveGroupsWithUsers (pageIndex = 0) {
  const ITEMS_PER_PAGE = 10

  try {
    const res = await lckClient.service('group').find({
      query: {
        $limit: ITEMS_PER_PAGE,
        $skip: pageIndex * ITEMS_PER_PAGE,
        $eager: 'users'
      }
    })
    return res.data
  } catch ({ code, name }) {
    return { code, name }
  }
}

export async function saveUserGroup (formData: UserGroupDTO) {
  try {
    return await lckClient.service('usergroup').create({
      user_id: formData.userId,
      group_id: formData.groupId,
      role: formData.role
    })
  } catch ({ code, name }) {
    return { code, name }
  }
}

export async function patchUserGroup (formData: UserGroupDTO) {
  try {
    return await lckClient.service('usergroup').patch(`${formData.userId},${formData.groupId}`, { role: formData.role })
  } catch ({ code, name }) {
    return { code, name }
  }
}

export async function deleteUserGroup (formData: UserGroupDTO) {
  try {
    return await lckClient.service('usergroup').remove(`${formData.userId},${formData.groupId}`)
  } catch ({ code, name }) {
    return { code, name }
  }
}
