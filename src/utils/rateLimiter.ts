import rateLimit from 'express-rate-limit'
import { TooManyRequests } from '@feathersjs/errors'

/**
 * Build a rate limiter,
 * Restricting tries in a time frame for a same IP.
 *
 * @param max
 * Maximum number of tries
 *
 * @param windowMS
 * Timeframe during the maximum number of tries is limited
 */
export function rateLimiter (max: number, windowMs: number): rateLimit.RateLimit | Function {
  if (process.env.NODE_ENV !== 'test') {
    const apiLimiter = rateLimit({
      windowMs,
      max,
      handler: () => {
        throw new TooManyRequests()
      },
    })
    return apiLimiter
  }
  return () => {}
}
