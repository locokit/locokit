// import { manageExpiredToken } from './hooks'
import restClient from '@feathersjs/rest-client'
import { createClient } from '@locokit/sdk'
import { useRuntimeConfig } from '#imports'

const fetchConnection =
  typeof window !== 'undefined' ? window.fetch.bind(window) : fetch

export function useLocoKitClient() {
  const config = useRuntimeConfig()
  const sdkRestClient = restClient(config.public.LOCOKIT_API)
  return createClient(sdkRestClient.fetch(fetchConnection), {
    storageKey: 'locokit-next-jwt',
  })
}
