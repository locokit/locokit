/* eslint-disable @typescript-eslint/camelcase */
import lckClient from '@/services/lck-api'

class UserCreateDTO {
  email = ''
  first_name = ''
  last_name = ''
  password = ''
  profile = ''
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

export async function createUser (data: UserCreateDTO) {
  try {
    return await lckClient.service('user').create(data)
  } catch (error) {
    console.error(error)
  }
}
