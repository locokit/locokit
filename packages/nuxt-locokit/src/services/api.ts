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

// process.env.NODE_ENV === 'test'
// ? async function (): Promise<void> {
//   return await new Promise(resolve => {
//     resolve()
//   })
// }
// : window.fetch),
// )
// sdkClient.hooks({
//   error: manageExpiredToken,
// })

sdkClient.service('w')
sdkClient.service('user')
sdkClient.service('group')

// Connect to the `http://feathers-api.com/messages` service
// const messages = lckClient.service('messages')

// lckClient.service('messages').create({
//   text: 'A new message'
// })
