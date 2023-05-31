// Initializes the `signup` service on path `/signup`
import { SERVICES } from '@locokit/definitions'
import { Application } from '@/declarations'
import { SignUpService } from './signup.class'
import { validateData } from '@feathersjs/schema/lib'
import { signUpDataSchema, signUpDataValidator } from './signup.schema'
import { createSwaggerServiceOptions } from 'feathers-swagger'

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.AUTH_SIGNUP]: SignUpService
  }
}

export function signup(app: Application): void {
  const signupConfig = app.get('settings').signup
  if (signupConfig?.allowed) {
    // Initialize our service with any options it requires
    app.use(SERVICES.AUTH_SIGNUP, new SignUpService(app), {
      methods: ['create'],
      events: [],
      docs: createSwaggerServiceOptions({
        schemas: { createRequest: signUpDataSchema, createResponse: signUpDataSchema },
        docs: {
          description: 'Signup service, allow user to create an account',
          tag: 'auth > signup',
        },
      }),
    })

    app.service(SERVICES.AUTH_SIGNUP).hooks({
      before: {
        create: [validateData(signUpDataValidator)],
      },
    })
  }
}
