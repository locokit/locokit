import { createLogger, format, transports } from 'winston'
import type { HookContext, NextFunction } from './declarations'

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'debug',
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()],
})

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
