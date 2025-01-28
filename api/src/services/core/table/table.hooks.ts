import { authenticate } from '@feathersjs/authentication'
import { transaction } from '@/feathers-objection'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { coreTablePatchResolver } from './table.resolver'
import { isInternalCallOrInternalAndAdminProfile } from '@/hooks/profile.hooks'

export const coreTableHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [isInternalCallOrInternalAndAdminProfile, transaction.start()],
    patch: [schemaHooks.resolveData(coreTablePatchResolver)],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
