import { feathers } from '@feathersjs/feathers'
import restClient from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'

// import { manageExpiredToken } from './hooks'
import { SDK, SDKOptions } from './declarations'

export function createSDK(options: SDKOptions): SDK {
  const sdkClient = feathers()
  const sdkAuth = auth({
    storageKey: 'locokit-next-jwt',
  })

  sdkClient.configure(sdkAuth)
  const sdkRestClient = restClient(options.apiURL)
  sdkClient.configure(sdkRestClient.fetch(options.fetch))

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

  return {
    client: sdkClient,
    services: {
      workspace: sdkClient.service('w'),
      user: sdkClient.service('user'),
      group: sdkClient.service('group'),
    },
  }
}

// Connect to the `http://feathers-api.com/messages` service
// const messages = lckClient.service('messages')

// lckClient.service('messages').create({
//   text: 'A new message'
// })
