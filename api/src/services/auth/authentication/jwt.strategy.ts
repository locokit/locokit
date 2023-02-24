import {
  AuthenticationParams,
  AuthenticationRequest,
  JWTStrategy,
} from '@feathersjs/authentication'
import { AnyMongoAbility } from '@casl/ability'

import { UserResult } from '../user/user.schema'
import { logger } from '../../../logger'
import { defineAbilities } from './authentication.abilities'

const jwtLogger = logger.child({ service: 'authentication-jwt-enhanced' })

/**
 * The JWT "Enhanced" allow us
 * to compute abilities and propagate them
 * in the context, so through resolvers, hooks, ...
 */
export class JWTStrategyEnhanced extends JWTStrategy {
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
    ability: AnyMongoAbility
  }> {
    jwtLogger.info('authenticate() with params', params)
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
      ability: defineAbilities(superResult.user) as AnyMongoAbility,
    }
    return result
  }
}
