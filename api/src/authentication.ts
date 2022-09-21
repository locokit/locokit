import {
  AuthenticationService,
  JWTStrategy,
  AuthenticationBaseStrategy,
  AuthenticationRequest,
  AuthenticationParams,
  AuthenticationResult,
} from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { NotAuthenticated } from '@feathersjs/errors/lib'
import { IncomingMessage } from 'http'

import type { Application } from './declarations'

class ApiKeyStrategy extends AuthenticationBaseStrategy {
  async parse (req: IncomingMessage): Promise<AuthenticationRequest | null> {
    const apiKey = req.headers[this.configuration.header]

    if (!apiKey) return null

    return {
      strategy: 'api-key',
      token: apiKey,
    }
  }

  async authenticate (
    authentication: AuthenticationRequest,
    params: AuthenticationParams,
  ): Promise<AuthenticationResult> {
    /**
     * Find if the api key really exist
     * and to which user it's linked
     */
    // const service = this.app?.service(this.configuration.service)
    // console.log(service)
    console.log('api key', authentication, this.name, this.configuration)
    const { token } = authentication
    const { entity } = this.authentication?.configuration

    const config = this.authentication?.configuration[this.name as string]
    console.log(config, entity)
    const match = token === 'POUET'
    if (!match) throw new NotAuthenticated('Bad API Key')
    const user = await this.app?.service('users').get(1)
    console.log(match, user)
    return {
      authentication: { strategy: this.name },
      [entity]: user,
    }
  }
}
declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export const authentication = (app: Application): void => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('api-key', new ApiKeyStrategy())

  app.use('authentication', authentication)
}
