import {
  AuthenticationService,
  JWTStrategy,
  // AuthenticationBaseStrategy,
  // AuthenticationRequest,
  // AuthenticationParams,
  // AuthenticationResult,
} from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
// import { NotAuthenticated } from '@feathersjs/errors/lib'
// import { IncomingMessage } from 'http'

import type { Application } from '../../declarations'
// import { logger } from '../../logger'
// import { configurationSchema } from '../../schemas/configuration.schema'
// import { ApikeyService } from '../apikey/apikey.class'

// const apikeyLogger = logger.child({ service: 'authentication-apikey' })

// class ApiKeyStrategy extends AuthenticationBaseStrategy {
//   async parse(req: IncomingMessage): Promise<AuthenticationRequest | null> {
//     apikeyLogger.info('parse()')
//     const apiKey = req.headers[this.configuration.header]

//     apikeyLogger.info('api key found : ', apiKey)
//     if (!apiKey) return null

//     return {
//       strategy: 'api-key',
//       token: apiKey,
//     }
//   }

//   async authenticate(
//     authentication: AuthenticationRequest,
//     params: AuthenticationParams,
//   ): Promise<AuthenticationResult> {
//     apikeyLogger.info('authenticate()')
//     /**
//      * Find if the api key really exist
//      * and to which user it's linked
//      */
//     // const service = this.app?.service(this.configuration.service)
//     // console.log(service)
//     apikeyLogger.info(
//       'request / name / config',
//       authentication,
//       this.name,
//       this.configuration,
//     )
//     const { token } = authentication
//     // const { entity } = this.authentication?.configuration
//     const entity = this.authentication?.configuration.entity as string

//     const config = this.authentication?.configuration[
//       this.name as string
//     ] as typeof configurationSchema.properties.authentication.properties['api-key']
//     apikeyLogger.info('config / entity', config, entity)
//     const service = this.app?.service(config.service) as ApikeyService
//     const apikey = service?.find({
//       query: {
//         token,
//       },
//     })
//     if (apikey) const match = token === 'POUET'
//     if (!match) throw new NotAuthenticated('Bad API Key')
//     const user = await this.app?.service('users').get(1)
//     apikeyLogger.info('match / user', match, user)
//     return {
//       authentication: { strategy: this.name },
//       [entity]: user,
//     }
//   }
// }
declare module '../../declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export const authentication = (app: Application): void => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  // authentication.register('api-key', new ApiKeyStrategy())

  app.use('authentication', authentication)
}
