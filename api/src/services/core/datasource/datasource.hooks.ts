import { authenticate } from '@feathersjs/authentication'
import { transaction } from '@/feathers-objection'
import { HookContext } from '@/declarations'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'
import { disallow } from 'feathers-hooks-common'

export const coreDatasourceHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [
      async function checkProfile(context: HookContext) {
        /**
         * Check the user is an admin one
         */
        if (context.params.user && context.params.user.profile !== USER_PROFILE.ADMIN)
          throw new Forbidden("You can't access datasources.")

        /**
         * Let the user pass if it's an internal call
         */
        if (!context.params.provider) return context
      },
      transaction.start(),
    ],
    create: [disallow()],
    update: [disallow()],
    remove: [disallow()],
    patch: [disallow()],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
