import { HookContext, ServiceAddons } from '@feathersjs/feathers'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
// import { expressOauth } from '@feathersjs/authentication-oauth';

import { Application } from '../../declarations'

declare module '../../declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('/authentication', authentication)

  const service = app.service('authentication')
  service.hooks({
    after: {
      create: [
        (context: HookContext) => {
          if (!context.result.user.isVerified) {
            throw new Error('User email is not verified. You can\'t login.')
          }
          return context
        }
      ]
    }
  })
  // app.configure(expressOauth());
}
