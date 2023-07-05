import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { transaction } from '@/feathers-objection'

import { migrationResolvers } from './migration.resolver'
import {
  migrationDataValidator,
  migrationDataInternalValidator,
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
      // async function setWorkspaceSchema(context: HookContext) {
      //   const migration: MigrationResult = await context.app
      //     .service(SERVICES.CORE_DATASOURCE)
      //     .get(context.id as Id)
      //   context.service.schema = `w_${migration.workspace?.slug as string}`
      //   return context
      // },
    ],
    find: [
      schemaHooks.resolveQuery(migrationResolvers.query),
      schemaHooks.validateQuery(migrationQueryValidator),
      setLocoKitContext,
      // async function setWorkspaceSchema(context: HookContext) {
      //   const workspace: WorkspaceResult = await context.app
      //     .service(SERVICES.CORE_WORKSPACE)
      //     .get(context.params.query.workspaceId)
      //   context.service.schema = `w_${workspace.slug as string}`
      //   return context
      // },
    ],
    create: [
      // validator without slug property
      setLocoKitContext,
      schemaHooks.validateData(migrationDataValidator),
      schemaHooks.resolveData(migrationResolvers.data.create),
      // validator with slug property
      schemaHooks.validateData(migrationDataInternalValidator),
    ],
    remove: [
      setLocoKitContext,
      // async function setWorkspaceSchema(context: HookContext) {
      //   const migration: MigrationResult = await context.app
      //     .service(SERVICES.CORE_DATASOURCE)
      //     .get(context.id as Id, { query: { $eager: 'workspace' } })
      //   context.service.schema = `w_${migration.workspace?.slug as string}`
      //   return context
      // },
    ],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
