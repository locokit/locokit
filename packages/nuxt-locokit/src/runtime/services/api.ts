// import { manageExpiredToken } from './hooks'
import restClient from '@feathersjs/rest-client'
import { createClient } from '@locokit/sdk'

const fetchConnection =
  typeof window !== 'undefined' ? window.fetch.bind(window) : fetch

const sdkRestClient = restClient('http://localhost:3030')
export const sdkClient = createClient(sdkRestClient.fetch(fetchConnection), {
  storageKey: 'locokit-next-jwt',
})
