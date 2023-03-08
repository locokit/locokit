import { feathers } from '@feathersjs/feathers'
import restClient from '@feathersjs/rest-client'
import authentication from '@feathersjs/authentication-client'

// import { manageExpiredToken } from './hooks'

export const sdkClient = feathers()

const sdkAuth = authentication({
  storageKey: 'locokit-next-jwt',
})

const fetchConnection =
  typeof window !== 'undefined' ? window.fetch.bind(window) : fetch

sdkClient.configure(sdkAuth)
const sdkRestClient = restClient('http://localhost:3030')
sdkClient.configure(sdkRestClient.fetch(fetchConnection))
