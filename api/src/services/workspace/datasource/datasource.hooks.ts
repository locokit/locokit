import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { transaction } from '@/feathers-objection'
import { HookContext } from '@/declarations'
import { WorkspaceResult } from '@/services/core/workspace/core-workspace.schema'

import { datasourceResolvers } from './datasource.resolver'
import {
  datasourceDataValidator,
  datasourceDataInternalValidator,
  datasourceQueryValidator,
  DatasourceResult,
} from './datasource.schema'
import { SERVICES } from '@locokit/definitions'
import { Id } from '@feathersjs/feathers'

export const datasourceHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      schemaHooks.resolveQuery(datasourceResolvers.query),
      schemaHooks.validateQuery(datasourceQueryValidator),
      async function setWorkspaceSchema(context: HookContext) {
        const datasource: DatasourceResult = await context.app
          .service(SERVICES.CORE_DATASOURCE)
          .get(context.id as Id)
        context.service.schema = `w_${datasource.workspace.slug}`
        return context
      },
    ],
    find: [
      schemaHooks.resolveQuery(datasourceResolvers.query),
      schemaHooks.validateQuery(datasourceQueryValidator),
      async function setWorkspaceSchema(context: HookContext) {
        const workspace: WorkspaceResult = await context.app
          .service(SERVICES.CORE_WORKSPACE)
          .get(context.params.query.workspaceId)
        context.service.schema = `w_${workspace.slug}`
        return context
      },
    ],
    create: [
      // validator without slug property
      schemaHooks.validateData(datasourceDataValidator),
      schemaHooks.resolveData(datasourceResolvers.data.create),
      // validator with slug property
      schemaHooks.validateData(datasourceDataInternalValidator),
      async function setWorkspaceSchema(context: HookContext) {
        const workspace: WorkspaceResult = await context.app
          .service(SERVICES.CORE_WORKSPACE)
          .get(context.data.workspaceId)
        context.service.schema = `w_${workspace.slug}`
        return context
      },
    ],
    remove: [
      async function setWorkspaceSchema(context: HookContext) {
        const datasource: DatasourceResult = await context.app
          .service(SERVICES.CORE_DATASOURCE)
          .get(context.id as Id, { query: { $eager: 'workspace' } })
        context.service.schema = `w_${datasource.workspace.slug}`
        return context
      },
    ],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
