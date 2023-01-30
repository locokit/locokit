import { createLogger, format, transports } from 'winston'
import type { HookContext, NextFunction } from './declarations'

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.ms(),
    format.timestamp(),
    format.printf(
      ({
        level,
        message,
        timestamp,
        ms,
        service,
        ...args
      }: Record<string, string>) => {
        return `${timestamp} ${
          service ? '[' + service + ']' : '[LocoKit]'
        } ${level}: ${message} (${ms})`
      },
    ),
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
