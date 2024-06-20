import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { transaction } from '@/feathers-objection'

import { migrationResolvers } from './migration.resolver'
import {
  migrationDataExternalValidator,
  migrationDiffInternalValidator,
  migrationPatchValidator,
  migrationQueryValidator,
} from './migration.schema'
import { setLocoKitContext } from '@/hooks/locokit'

export const migrationHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      schemaHooks.resolveQuery(migrationResolvers.query),
      schemaHooks.validateQuery(migrationQueryValidator),
      setLocoKitContext,
    ],
    find: [
      schemaHooks.resolveQuery(migrationResolvers.query),
      schemaHooks.validateQuery(migrationQueryValidator),
      setLocoKitContext,
    ],
    create: [
      setLocoKitContext,
      schemaHooks.validateData(migrationDataExternalValidator),
      schemaHooks.resolveData(migrationResolvers.data.create),
    ],
    patch: [
      setLocoKitContext,
      schemaHooks.validateData(migrationPatchValidator),
      schemaHooks.resolveData(migrationResolvers.data.patch),
    ],
    remove: [setLocoKitContext],
    diff: [setLocoKitContext, schemaHooks.validateData(migrationDiffInternalValidator)],
    apply: [setLocoKitContext],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
