// Initializes the `signup` service on path `/signup`
import { ServiceAddons } from '@feathersjs/feathers'

import { Application } from '../../declarations'
import { rateLimiter } from '../../utils/rateLimiter'
import { SignUp } from './signup.class'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'signup': SignUp & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const signupConfig = app.get('authentication').signup
  if (signupConfig.isAllowed === 'true') {
    const signUpRateLimiter = rateLimiter(
      parseInt(signupConfig.rateLimit.max, 10) || 10,
      parseInt(signupConfig.rateLimit.timeframe, 10) || 60000,
    )
    // Initialize our service with any options it requires
    app.use('/signup', signUpRateLimiter, new SignUp(app))
  }
}
