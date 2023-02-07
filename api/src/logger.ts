import { createLogger, format, transports } from 'winston'
import type { HookContext, NextFunction } from './declarations'
import util from 'node:util'

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
    format.printf(({
      level,
      message,
      timestamp,
      ms,
      service,
      stack,
      ...meta
    }) => {
      let messageToDisplay = `${timestamp} ${level} ${service ? '[' + service + ']' : '[LocoKit]'} : ${message} (${ms})`
      if (stack) messageToDisplay += `\n${stack}`
      // clean the meta from symbols
      const metaWithoutSymbol = JSON.parse(JSON.stringify(meta))
      if (Object.keys(metaWithoutSymbol).length > 0) {
        messageToDisplay += `\n${util.format(metaWithoutSymbol)}`
      }
      return messageToDisplay
    })
  ),
  transports: [new transports.Console()],
  exitOnError: false,
})

logger.debug('Logger created !')

export const logErrorHook = async (
  _context: HookContext,
  next: NextFunction,
): Promise<void> => {
  try {
    await next()
  } catch (error) {
    logger.error(error)
    throw error
  }
}
