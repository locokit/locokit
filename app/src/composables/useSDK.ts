import restClient from '@feathersjs/rest-client'
import { createClient } from '@locokit/sdk'

export function useSDK() {
  const sdkRestClient = restClient('https://next.locokit.io/api')
  const sdkClient = createClient(sdkRestClient.fetch(window.fetch.bind(window)), {
    storageKey: 'locokit-next-jwt',
  })

  return {
    sdkClient,
  }
}
