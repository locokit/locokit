import {
  AuthenticationBaseStrategy,
  AuthenticationRequest,
  AuthenticationResult,
} from '@feathersjs/authentication'
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
  async parse(): Promise<AuthenticationRequest | null> {
    publicLogger.info('parse()')

    return {
      strategy: 'public',
    }
  }

  async authenticate(): Promise<AuthenticationResult> {
    publicLogger.info('authenticate()')
    return {
      authentication: { strategy: this.name },
      authenticated: false,
      public: true,
    }
  }
}
