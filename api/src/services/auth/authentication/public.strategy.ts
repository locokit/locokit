import {
  AuthenticationBaseStrategy,
  // AuthenticationParams,
  AuthenticationRequest,
  AuthenticationResult,
} from '@feathersjs/authentication'
// import { IncomingMessage } from 'node:http'
import { logger } from '@/logger'

const publicLogger = logger.child({ service: 'authentication-public' })

/**
 * The public strategy allow us to open some endpoints
 * to unauthenticated users.
 *
 * This is useful for public workspaces,
 * or public records (in public workspces).
 */
export class PublicStrategy extends AuthenticationBaseStrategy {
  async parse(/*_req: IncomingMessage*/): Promise<AuthenticationRequest | null> {
    publicLogger.info('parse()')

    return {
      strategy: 'public',
    }
  }

  async authenticate() // _authentication: AuthenticationRequest,
  // _params: AuthenticationParams,
  : Promise<AuthenticationResult> {
    publicLogger.info('authenticate()')
    return {
      authentication: { strategy: this.name },
      authenticated: false,
      public: true,
    }
  }
}
