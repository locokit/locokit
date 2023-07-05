import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { transaction } from '@/feathers-objection'

import { datasourceResolvers } from './datasource.resolver'
import {
  datasourceDataValidator,
  datasourceDataInternalValidator,
  datasourceQueryValidator,
} from './datasource.schema'
import { setLocoKitContext } from '@/hooks/locokit'

export const datasourceHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      setLocoKitContext,
      schemaHooks.resolveQuery(datasourceResolvers.query),
      schemaHooks.validateQuery(datasourceQueryValidator),
    ],
    find: [
      setLocoKitContext,
      schemaHooks.resolveQuery(datasourceResolvers.query),
      schemaHooks.validateQuery(datasourceQueryValidator),
    ],
    create: [
      // validator without slug property
      schemaHooks.validateData(datasourceDataValidator),
      setLocoKitContext,
      schemaHooks.resolveData(datasourceResolvers.data.create),
      // validator with slug property
      schemaHooks.validateData(datasourceDataInternalValidator),
    ],
    remove: [setLocoKitContext],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
