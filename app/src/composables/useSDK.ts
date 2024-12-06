import restClient from '@feathersjs/rest-client'
import { createClient } from '@locokit/sdk'

export function useSDK() {
  const sdkRestClient = restClient(LCK_SETTINGS.API_URL)
  const sdkClient = createClient(sdkRestClient.fetch(window.fetch.bind(window)), {
    storageKey: LCK_SETTINGS.LOCALSTORAGE_KEY_AUTH_TOKEN,
  })

  return {
    sdkClient,
  }
}
