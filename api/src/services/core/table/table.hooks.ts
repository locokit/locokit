import { authenticate } from '@feathersjs/authentication'
import { transaction } from '@/feathers-objection'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { coreTablePatchResolver } from './table.resolver'
import { checkUserHasAccess } from '@/hooks/profile.hooks'
import { USER_PROFILE } from '@locokit/definitions'

export const coreTableHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [
      checkUserHasAccess({
        userProfile: [USER_PROFILE.ADMIN],
        internalProvider: true,
        internalProviderProfileCheck: 'ALWAYS',
      }),
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
