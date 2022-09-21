import { createSDK } from '@locokit/sdk'

const fetchConnection = typeof window !== 'undefined' ? window.fetch.bind(window) : fetch

export const sdk = createSDK({
  apiURL: 'http://localhost:3030',
  fetch: fetchConnection,
})
