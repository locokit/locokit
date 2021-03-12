// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { HookContext } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'
import { iff, debug } from 'feathers-hooks-common'

export default {
  before: {
    all: [
      debug('app debug'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [
      iff(
        process.env.NODE_ENV === 'production',
        (context: HookContext) => {
          if (context.error) {
            const error = context.error
            // console.log(error.code, error.message, error.stack)
            if (!error.code) {
              const newError = new GeneralError('server error')
              context.error = newError
              return context
            }
            if (error.code === 404) {
              error.stack = null
            }
            return context
          }
        },
      ),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
