/**
 * This is a draft for apikey strategy
 *
 * We need to go deeper with a database structure
 * holding apikeys for users, and storing uses of these apikeys (for rate limit)
 */

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
