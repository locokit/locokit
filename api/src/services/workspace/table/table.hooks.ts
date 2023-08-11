import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { transaction } from '@/feathers-objection'

import { tableResolvers } from './table.resolvers'
import { tableDataValidator, tableQueryValidator, tableDataInternalValidator } from './table.schema'
import { setLocoKitContext } from '@/hooks/locokit'

export const tableHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      schemaHooks.resolveQuery(tableResolvers.query),
      schemaHooks.validateQuery(tableQueryValidator),
      setLocoKitContext,
    ],
    find: [
      setLocoKitContext,
      schemaHooks.resolveQuery(tableResolvers.query),
      schemaHooks.validateQuery(tableQueryValidator),
    ],
    create: [
      schemaHooks.validateData(tableDataValidator),
      setLocoKitContext,
      schemaHooks.resolveData(tableResolvers.data.create),
      schemaHooks.validateData(tableDataInternalValidator),
    ],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
