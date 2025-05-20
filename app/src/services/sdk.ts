import restClient from '@feathersjs/rest-client'
import { createClient } from '@locokit/sdk'
import LCK_SETTINGS from '@/config'

const sdkRestClient = restClient(LCK_SETTINGS.API_URL)
export const sdkClient = createClient(sdkRestClient.fetch(window.fetch.bind(window)), {
  storageKey: LCK_SETTINGS.LOCALSTORAGE_KEY_AUTH_TOKEN,
})
