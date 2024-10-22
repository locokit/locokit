import { createLogger, format, transports } from 'winston'
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
    format.printf(({ level, message, timestamp, ms, service, stack, name, ...meta }) => {
      let messageToDisplay = `${timestamp as string} ${level} ${
        service ? '[' + (service as string) + ']' : '[LocoKit]'
      } ${name as string} : ${message as string} (${ms as string})`
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
        messageToDisplay += `\n${util.format?.(metaWithoutSymbol)}`
      }
      return messageToDisplay
    }),
  ),
  transports: [
    new transports.Console({
      // level: 'error',
    }),
  ],
  exitOnError: false,
})

logger.debug('Logger created !')