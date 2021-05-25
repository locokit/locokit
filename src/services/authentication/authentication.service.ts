import { ServiceAddons } from '@feathersjs/feathers'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
// import { expressOauth } from '@feathersjs/authentication-oauth';
import hooks from './authentication.hooks'

import { Application } from '../../declarations'
import { ServiceSwaggerOptions } from 'feathers-swagger/types'

declare module '../../declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const authentication: AuthenticationService & {docs?: ServiceSwaggerOptions } = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.docs = {
    description: 'The main authentication service',
    definition: {
      type: 'object',
      required: ['strategy', 'email', 'password'],
      properties: {
        strategy: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
    definitions: {
      authenticationResponse: {
        type: 'object',
        required: ['accessToken'],

        properties: {
          accessToken: {
            type: 'string',
          },
          authentication: {
            strategy: 'string',
            accessToken: 'string',
          },
          user: { id: 'integer' },
        },
      },
    },
    refs: {
      createResponse: 'authenticationResponse',
    },
  }

  app.use('/authentication', authentication)

  const service = app.service('authentication')
  service.hooks(hooks)
  // app.configure(expressOauth());
}
