import { TooManyRequests } from '@feathersjs/errors'
import { Params } from '@feathersjs/feathers'
import { SERVICES, USER_PROFILE } from '@locokit/definitions'
import { RateLimiterMemory } from 'rate-limiter-flexible'

import { Application } from '@/declarations'
import { logger } from '../../../logger'
import { UserSignUpData } from './user-signup.schema'

const userSignupClassLogger = logger.child({ service: 'user-signup' })

export class UserSignUpService {
  app: Application
  // public docs: ServiceSwaggerOptions
  rateLimiter: RateLimiterMemory

  constructor(app: Application) {
    this.app = app
    this.rateLimiter = new RateLimiterMemory({
      keyPrefix: 'usersignup_consecutive',
      points: 5, // 5 requests for ctx.ip
      duration: 60, // per 60 second
      blockDuration: 60 * 2, // block user during 120 second
    })
  }

  async create(credentials: UserSignUpData, params?: Params): Promise<UserSignUpData> {
    userSignupClassLogger.info(
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
        userSignupClassLogger.error('Rate limiter enabled for connexion... ? for 120s.')
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
    try {
      userSignupClassLogger.info(
        'Creating user %s with profile %s',
        credentials.username,
        USER_PROFILE.CREATOR,
      )
      await this.app.service(SERVICES.CORE_USER).create(
        {
          username: credentials.username,
          email: credentials.email,
          profile: USER_PROFILE.CREATOR, // we set to CREATOR to allow the user create new workspace
        },
        {
          headers: {
            'x-lck-notification': false,
          },
        },
      )
      userSignupClassLogger.info('Creation ok.')
    } catch (error: any) {
      userSignupClassLogger.error(
        `Creation nok for user ${credentials.username}/${credentials.email} with error "${
          error.name as string
        }"`,
      )
      throw error
    }
    return credentials
  }
}
