import { AbilityBuilder, MongoAbility } from '@casl/ability'
import {
  // AuthenticationBase,
  AuthenticationParams,
  AuthenticationRequest,
  AuthenticationService,
  JWTStrategy,
  // AuthenticationBaseStrategy,
  // AuthenticationRequest,
  // AuthenticationParams,
  // AuthenticationResult,
} from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { PROFILE, API_PATH } from '@locokit/definitions'
import { AppAbility, resolveAction } from '../../../abilities/definitions'
import makeAbilityFromRules from '../../../abilities/makeAbilityFromRules'
// import { NotAuthenticated } from '@feathersjs/errors/lib'
// import { IncomingMessage } from 'http'

import type { Application } from '../../../declarations'
import { UserResult } from '../user/user.schema'
import { hooks } from './authentication.hooks'
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
//     const user = await this.app?.service('user').get(1)
//     apikeyLogger.info('match / user', match, user)
//     return {
//       authentication: { strategy: this.name },
//       [entity]: user,
//     }
//   }
// }
declare module '../../../declarations' {
  interface ServiceTypes {
    [API_PATH.AUTH.ROOT]: AuthenticationService
  }
}

function defineAbilities(user: UserResult): MongoAbility {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, rules } = new AbilityBuilder(AppAbility)

  /**
   * TODO: add public rules for anonymous (e.g., read public workspaces ?)
   */
  switch (user?.profile) {
    case PROFILE.ADMIN:
      can('manage', 'all')
      break
    case PROFILE.CREATOR:
      can('create', 'workspace')
      can('read', 'workspace')
      // can('manage', 'user', { id: user.id })
      break
    /**
     * User connected can
     * * find their groups
     * * find workspace of their groups
     */
    case PROFILE.MEMBER:
      can('read', 'workspace')
      // can('manage', 'user', { id: user.id })
      break
  }

  return makeAbilityFromRules(rules, { resolveAction })
}

class JWTStrategyEnhanced extends JWTStrategy {
  async authenticate(
    authentication: AuthenticationRequest,
    params: AuthenticationParams,
  ): Promise<{
    accessToken: any
    authentication: {
      strategy: string
      accessToken: any
      payload: any
    }
    user: UserResult
    ability: MongoAbility
  }> {
    const superResult = (await super.authenticate(authentication, params)) as {
      accessToken: any
      authentication: {
        strategy: string
        accessToken: any
        payload: any
      }
      user: UserResult
    }
    const result = {
      ...superResult,
      ability: defineAbilities(superResult.user) as MongoAbility,
    }
    return result
  }
}

export const authentication = (app: Application): void => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategyEnhanced())
  authentication.register('local', new LocalStrategy())
  // authentication.register('api-key', new ApiKeyStrategy())

  app.use(API_PATH.AUTH.ROOT, authentication)
  app.service(API_PATH.AUTH.ROOT).hooks(hooks)
}
