/* eslint-disable @typescript-eslint/camelcase */
import lckClient from '@/services/lck-api'

export async function retrieveUsersData (pageIndex = 0) {
  const ITEMS_PER_PAGE = 10

  try {
    return await lckClient.service('user').find({
      query: {
        $limit: ITEMS_PER_PAGE,
        $skip: pageIndex * ITEMS_PER_PAGE
      }
    })
  } catch (error) {
    console.error(error)
  }
}
