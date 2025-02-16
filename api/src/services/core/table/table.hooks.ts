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
        allowedProfile: [USER_PROFILE.ADMIN],
        internalProvider: true,
        internalProviderProfileCheck: 'IF_USER_PROVIDED',
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
