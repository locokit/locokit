import { Conflict, Forbidden, TooManyRequests } from '@feathersjs/errors'
import { Params } from '@feathersjs/feathers'
import { PROFILE } from '@locokit/definitions'
import { ServiceSwaggerOptions } from 'feathers-swagger'
import { JSONSchema } from 'objection'
import { RateLimiterMemory } from 'rate-limiter-flexible'

import { Application } from '../../declarations'
import { logger } from '../../logger'
import { authManagementSettings } from '../authmanagement/authmanagement.settings'

class SignUpModel {
  email!: string
  name!: string

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        email: { type: 'string' },
        name: { type: 'string' },
      },
    }
  }
}
export class SignUpService {
  app: Application
  public docs: ServiceSwaggerOptions
  rateLimiter: RateLimiterMemory

  constructor(app: Application) {
    this.app = app
    this.docs = {
      description: 'Signup service, allow user to create an account',
      definition: SignUpModel.jsonSchema,
    }
    this.rateLimiter = new RateLimiterMemory({
      keyPrefix: 'signup_consecutive',
      points: 5, // 5 requests for ctx.ip
      duration: 60, // per 60 second
      blockDuration: 60 * 2, // block user during 120 second
    })
  }

  async create(credentials: SignUpModel, params: Params): Promise<SignUpModel> {
    console.log(params.headers)
    try {
      await this.rateLimiter.consume(params.headers?.ip as string)
    } catch (rejRes) {
      logger.error('[signup] Rate limiter enabled for connexion... ? for 120s.')
      throw new TooManyRequests(
        'Your IP is now rate limited. Please wait 120 seconds before trying to signup again.',
      )
    }
    /**
     * Check that the registration is allowed
     *
     * This is a double check as, normally,
     * the signup service is not registered if the signup hasn't been allowed
     * in the API config.
     */
    const isSignupAllowed = this.app.get('settings').signup?.allowed
    if (!isSignupAllowed) throw new Forbidden()

    try {
      logger.debug('[signup] Creating user...')
      await this.app.service('users').create({
        name: credentials.name,
        email: credentials.email,
        profile: PROFILE.CREATOR, // we set to CREATOR to allow the user create new workspace
      })
      logger.debug('[signup] Creation ok.')
    } catch (error) {
      logger.error(
        `[signup] Creation nok for user ${credentials.name}/${credentials.email}`,
      )
      /**
       * We don't throw an error if there was already a user with the e-mail address
       * to avoid giving information to a potential black hat.
       *
       * Nevertheless, we inform the user that someone try to recreate an account
       * with its email.
       */
      if (error instanceof Conflict) {
        await authManagementSettings(this.app as Application).notifier(
          'informUserConflict',
          credentials,
        )
      } else {
        throw error
      }
    }
    return credentials
  }
}
