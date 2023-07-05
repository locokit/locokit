import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { transaction } from '@/feathers-objection'
import { disallow } from 'feathers-hooks-common'

import { tableRelationResolvers } from './table-relation.resolver'
import {
  tableRelationDataValidator,
  tableRelationDataInternalValidator,
} from './table-relation.schema'
import { setLocoKitContext } from '@/hooks/locokit'

export const tableRelationHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],

    get: [disallow()],
    find: [disallow()],
    update: [disallow()],
    remove: [disallow()],

    create: [
      schemaHooks.validateData(tableRelationDataValidator),
      setLocoKitContext,
      schemaHooks.resolveData(tableRelationResolvers.data.create),
      schemaHooks.validateData(tableRelationDataInternalValidator),
    ],
    patch: [
      schemaHooks.resolveData(tableRelationResolvers.data.patch),
      schemaHooks.validateData(tableRelationDataValidator),
      setLocoKitContext,
    ],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
