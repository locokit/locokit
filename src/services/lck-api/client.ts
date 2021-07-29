import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'

import { manageExpiredToken } from './hooks'

export const lckClient = feathers()

// Connect to a different URL
const restClient = rest(LCK_SETTINGS.API_URL)

// Configure an AJAX library (see below) with that client
lckClient.configure(
  restClient.fetch(
    process.env.NODE_ENV === 'test' ? {} : window.fetch,
  ),
)
lckClient.configure(auth({
  storageKey: LCK_SETTINGS.LOCALSTORAGE_KEY,
}))

// Add the hooks to the client
lckClient.hooks({
  error: manageExpiredToken,
})
// Connect to the `http://feathers-api.com/messages` service
// const messages = lckClient.service('messages')

// lckClient.service('messages').create({
//   text: 'A new message'
// })
