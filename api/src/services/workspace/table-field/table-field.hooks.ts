import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { transaction } from '@/feathers-objection'

import { tableFieldResolvers } from './table-field.resolver'
import {
  tableFieldDataValidator,
  tableFieldDataInternalValidator,
  tableFieldQueryValidator,
} from './table-field.schema'
import { setLocoKitContext } from '@/hooks/locokit'

export const tableFieldHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      schemaHooks.resolveQuery(tableFieldResolvers.query),
      schemaHooks.validateData(tableFieldQueryValidator),
      setLocoKitContext,
    ],
    find: [
      schemaHooks.resolveQuery(tableFieldResolvers.query),
      schemaHooks.validateData(tableFieldQueryValidator),
      setLocoKitContext,
    ],
    create: [
      schemaHooks.validateData(tableFieldDataValidator),
      setLocoKitContext,
      schemaHooks.resolveData(tableFieldResolvers.data.create),
      schemaHooks.validateData(tableFieldDataInternalValidator),
    ],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
