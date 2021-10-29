// Initializes the `signup` service on path `/signup`
import { ServiceAddons } from '@feathersjs/feathers'

import { Application } from '../../declarations'
import { rateLimitter } from '../../utils/rateLimitter'
import { SignUp } from './signup.class'

const signUpRateLimitter = rateLimitter(5, 60000)

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'signup': SignUp & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  // Initialize our service with any options it requires
  app.use('/signup', signUpRateLimitter, new SignUp(app))
}
