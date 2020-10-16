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
  uhg_role: string;
}

export async function retrieveUsersData (pageIndex = 0) {
  const ITEMS_PER_PAGE = 20

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
