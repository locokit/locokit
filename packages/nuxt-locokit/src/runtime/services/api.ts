// import restClient from '@feathersjs/rest-client'
// import { createClient } from '@locokit/test-sdk'

// const fetchConnection =
//   typeof window !== 'undefined' ? window.fetch.bind(window) : fetch

// const sdkRestClient = restClient('http://localhost:3030')
// export const sdkClient = createClient(sdkRestClient.fetch(fetchConnection), {
//   storageKey: 'locokit-next-jwt',
// })

// report de code d'un ancien patch
// import { createSDK } from '@locokit/sdk'

// const fetchConnection =
//   typeof window !== 'undefined' ? window.fetch.bind(window) : fetch

// export const sdk = createSDK({
//   apiURL: 'http://localhost:3030',
//   fetch: fetchConnection,
// })

import { feathers } from '@feathersjs/feathers'
import restClient from '@feathersjs/rest-client'
import authentication from '@feathersjs/authentication-client'
import { SERVICES } from '@locokit/definitions'

// import { manageExpiredToken } from './hooks'

export const sdkClient = feathers()

const sdkAuth = authentication({
  storageKey: 'locokit-next-jwt',
  path: SERVICES.AUTH_AUTHENTICATION,
})

const fetchConnection =
  typeof window !== 'undefined' ? window.fetch.bind(window) : fetch

sdkClient.configure(sdkAuth)
const sdkRestClient = restClient('http://localhost:3030')
sdkClient.configure(sdkRestClient.fetch(fetchConnection))
