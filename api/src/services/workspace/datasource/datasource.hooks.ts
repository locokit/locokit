import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { transaction } from '@/feathers-objection'

import { workspaceDatasourceResolvers } from './datasource.resolver'
import {
  workspaceDatasourceDataValidator,
  workspaceDatasourceDataInternalValidator,
  workspaceDatasourceQueryValidator,
} from './datasource.schema'
import { setLocoKitContext } from '@/hooks/locokit'

export const workspaceDatasourceHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      setLocoKitContext,
      schemaHooks.resolveQuery(workspaceDatasourceResolvers.query),
      schemaHooks.validateQuery(workspaceDatasourceQueryValidator),
    ],
    find: [
      setLocoKitContext,
      schemaHooks.resolveQuery(workspaceDatasourceResolvers.query),
      schemaHooks.validateQuery(workspaceDatasourceQueryValidator),
    ],
    create: [
      // validator without slug property
      schemaHooks.validateData(workspaceDatasourceDataValidator),
      setLocoKitContext,
      schemaHooks.resolveData(workspaceDatasourceResolvers.data.create),
      // validator with slug property
      schemaHooks.validateData(workspaceDatasourceDataInternalValidator),
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
