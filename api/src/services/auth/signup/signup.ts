// Initializes the `signup` service on path `/signup`
import { SERVICES } from '@locokit/definitions'
import { Application } from '../../../declarations'
import { SignUpService } from './signup.class'

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [SERVICES.AUTH_SIGNUP]: SignUpService
  }
}

export function signup(app: Application): void {
  const signupConfig = app.get('settings').signup
  if (signupConfig?.allowed) {
    // Initialize our service with any options it requires
    app.use(SERVICES.AUTH_SIGNUP, new SignUpService(app))
  }
}
