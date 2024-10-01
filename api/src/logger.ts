import { createLogger, format, transports } from 'winston'
import type { HookContext, NextFunction } from './declarations'
import util from 'node:util'
import * as Sentry from '@sentry/node'
import { FeathersError, NotAuthenticated } from '@feathersjs/errors'

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: process.env.LOGGER_LEVEL,
  format: format.combine(
    format.colorize(),
    format.ms(),
    format.timestamp(),
    format.splat(),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, ms, service, stack, ...meta }) => {
      let messageToDisplay = `${timestamp as string} ${level} ${
        service ? '[' + (service as string) + ']' : '[LocoKit]'
      } ${meta.name as string} : ${message as string} (${ms as string})`
      if (stack) messageToDisplay += `\n${stack as string}`
      // clean the meta from symbols
      const metaWithoutSymbol = Object.entries(meta).reduce((acc: Record<string, any>, [k, v]) => {
        /**
         * The key 'hook' is not formatable via util.format later...
         */
        if (k === 'hook') return acc
        if (typeof k !== 'symbol') acc[k as string] = v
        return acc
      }, {})

      if (Object.keys(metaWithoutSymbol).length > 0) {
        messageToDisplay += `\n${util.format(metaWithoutSymbol)}`
      }
      return messageToDisplay
    }),
  ),
  transports: [new transports.Console()],
  exitOnError: false,
})

logger.debug('Logger created !')

/**
 * Around hook used to manage the errors at the app level
 */
export const logErrorHook = async (_context: HookContext, next: NextFunction): Promise<void> => {
  try {
    await next()
  } catch (error) {
    /**
     * Capture exception only on production env
     */
    let captureException = process.env.NODE_ENV === 'production'
    /**
     * Manage cases where we don't want to capture the exception in Sentry (false positive)
     */
    if ((error as FeathersError).type === 'FeathersError') {
      switch((error as FeathersError).name) {
        case 'NotAuthenticated':
          if ((error as NotAuthenticated).data.name === 'TokenExpiredError') captureException = false
          break
      }
    } 
    logger.error(error)
    captureException === true && Sentry.captureException(error)
    throw error
  }
}
