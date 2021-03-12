import { HookContext, ServiceAddons } from '@feathersjs/feathers'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
// import { expressOauth } from '@feathersjs/authentication-oauth';

import { Application } from '../../declarations'
import { Forbidden } from '@feathersjs/errors'
import { alterItems, lowerCase } from 'feathers-hooks-common'

declare module '../../declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>
  }
}

export default function (app: Application) {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('/authentication', authentication)

  const service = app.service('authentication')
  service.hooks({
    before: {
      create: [lowerCase('email')],
    },
    after: {
      create: [
        (context: HookContext) => {
          if (!context.result.user.isVerified) {
            throw new Forbidden('User email is not verified. You can\'t login.')
          }
          return context
        },
        alterItems(rec => {
          delete rec.user.verifyToken
          delete rec.user.verifyShortToken
          delete rec.user.verifyExpires
          delete rec.user.verifyChanges
          delete rec.user.resetToken
          delete rec.user.resetShortToken
          delete rec.user.resetExpires
        }),
      ],
    },
  })
  // app.configure(expressOauth());
}
