import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'

const lckClient = feathers()

// Connect to a different URL
const restClient = rest('http://localhost:3030')

// Configure an AJAX library (see below) with that client
lckClient.configure(restClient.fetch(window.fetch))
lckClient.configure(auth({
  storageKey: 'auth'
}))
// Connect to the `http://feathers-api.com/messages` service
// const messages = lckClient.service('messages')

// lckClient.service('messages').create({
//   text: 'A new message'
// })

export default lckClient
