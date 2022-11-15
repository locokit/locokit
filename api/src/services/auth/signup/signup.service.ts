// Initializes the `signup` service on path `/signup`
import { API_PATH } from '@locokit/definitions'
import { Application } from '../../../declarations'
import { SignUpService } from './signup.class'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [API_PATH.AUTH.SIGNUP]: SignUpService
  }
}

export function signup(app: Application): void {
  const signupConfig = app.get('settings').signup
  if (signupConfig?.allowed === true) {
    // Initialize our service with any options it requires
    app.use(API_PATH.AUTH.SIGNUP, new SignUpService(app))
  }
}
