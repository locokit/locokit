import { authenticate } from '@feathersjs/authentication'
import { transaction } from '@/feathers-objection'
import { HookContext } from '@/declarations'
import { USER_PROFILE } from '@locokit/definitions'
import { Forbidden } from '@feathersjs/errors/lib'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { coreTablePatchResolver } from './core-table.resolver'

export const coreTableHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [
      async function checkProfile(context: HookContext) {
        /**
         * Let the user pass if it's an internal call
         */
        if (!context.params.provider) return context

        /**
         * Check the user is an admin one
         */
        if (context.params.user.profile !== USER_PROFILE.ADMIN)
          throw new Forbidden("You can't access datasources.")
      },
      transaction.start(),
    ],
    patch: [schemaHooks.resolveData(coreTablePatchResolver)],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
