import { Conflict, Forbidden, TooManyRequests } from '@feathersjs/errors'
import { Params } from '@feathersjs/feathers'
import { SERVICES, USER_PROFILE } from '@locokit/definitions'
import { RateLimiterMemory } from 'rate-limiter-flexible'

import { Application } from '@/declarations'
import { logger } from '../../../logger'
import { authManagementSettings } from '../authmanagement/authmanagement.settings'
import { SignUpData } from './signup.schema'

const signupClassLogger = logger.child({ service: 'signup' })

export class SignUpService {
  app: Application
  // public docs: ServiceSwaggerOptions
  rateLimiter: RateLimiterMemory

  constructor(app: Application) {
    this.app = app
    this.rateLimiter = new RateLimiterMemory({
      keyPrefix: 'signup_consecutive',
      points: 5, // 5 requests for ctx.ip
      duration: 60, // per 60 second
      blockDuration: 60 * 2, // block user during 120 second
    })
  }

  async create(credentials: SignUpData, params?: Params): Promise<SignUpData> {
    signupClassLogger.info(
      '[create] email: %s, username: %s',
      credentials.email,
      credentials.username,
    )
    /**
     * Use the rate limiter to protect the platform of signup attacks
     */
    if (params?.headers?.ip) {
      try {
        await this.rateLimiter.consume(params?.headers?.ip as string)
      } catch {
        signupClassLogger.error('Rate limiter enabled for connexion... ? for 120s.')
        throw new TooManyRequests(
          'Your IP is now rate limited. Please wait 120 seconds before trying to signup again.',
        )
      }
    }
    /**
     * Check that the registration is allowed
     *
     * This is a double check as, normally,
     * the signup service is not registered if the signup hasn't been allowed
     * in the API config.
     */
    const isSignupAllowed = this.app.get('settings').signup?.allowed
    if (!isSignupAllowed) throw new Forbidden('Signup is not authorized on this platform.')

    try {
      signupClassLogger.info(
        'Creating user %s with profile %s',
        credentials.username,
        USER_PROFILE.CREATOR,
      )
      await this.app.service(SERVICES.CORE_USER).create({
        username: credentials.username,
        email: credentials.email,
        profile: USER_PROFILE.CREATOR, // we set to CREATOR to allow the user create new workspace
      })
      signupClassLogger.info('Creation ok.')
    } catch (error: any) {
      signupClassLogger.error(
        `Creation nok for user ${credentials.username}/${credentials.email} with error "${
          error.name as string
        }"`,
      )
      /**
       * We don't throw an error if there was already a user with the e-mail address
       * to avoid giving information to a potential black hat.
       *
       * Nevertheless, we inform the user that someone try to recreate an account
       * with its email.
       */
      if (error instanceof Conflict) {
        await authManagementSettings(this.app).notifier('informUserConflict', {
          ...credentials,
        })
      } else {
        throw error
      }
    }
    return credentials
  }
}
