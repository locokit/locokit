import rateLimit from 'express-rate-limit'
import { TooManyRequests } from '@feathersjs/errors'

export function rateLimitter (max: number, windowMs: number): rateLimit.RateLimit | Function {
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
