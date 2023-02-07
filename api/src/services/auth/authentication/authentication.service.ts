import { AuthenticationService } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { API_PATH } from '@locokit/definitions'
import { ServiceSwaggerOptions } from 'feathers-swagger'

import type { Application } from '../../../declarations'
import { hooks } from './authentication.hooks'
import { JWTStrategyEnhanced } from './jwt.strategy'
import { PublicStrategy } from './public.strategy'

declare module '../../../declarations' {
  interface ServiceTypes {
    [API_PATH.AUTH.ROOT]: AuthenticationService
  }
}

declare module '@feathersjs/authentication' {
  class AuthenticationService {
    docs: ServiceSwaggerOptions
  }
}

export const authentication = (app: Application): void => {
  const authenticationService = new AuthenticationService(app)

  authenticationService.docs = {
    idNames: {
      remove: 'accessToken',
    },
    idType: 'string',
    securities: ['remove', 'removeMulti'],
    multi: ['remove'],
    schemas: {
      authRequest: {
        type: 'object',
        properties: {
          strategy: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      authResult: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          authentication: {
            type: 'object',
            properties: {
              strategy: { type: 'string' },
            },
          },
          payload: {
            type: 'object',
            properties: {}, // TODO
          },
          user: { $ref: '#/components/schemas/user' },
        },
      },
    },
    refs: {
      createRequest: 'authRequest',
      createResponse: 'authResult',
      removeResponse: 'authResult',
      removeMultiResponse: 'authResult',
    },
    operations: {
      remove: {
        description: 'Logout the currently logged in user',
        'parameters[0].description': 'accessToken of the currently logged in user',
      },
      removeMulti: {
        description: 'Logout the currently logged in user',
        parameters: [],
      },
    },
  }

  authenticationService.register('public', new PublicStrategy())
  authenticationService.register('local', new LocalStrategy())
  authenticationService.register('jwt', new JWTStrategyEnhanced())

  app.use(API_PATH.AUTH.ROOT, authenticationService)
  app.service(API_PATH.AUTH.ROOT).hooks(hooks)
}
