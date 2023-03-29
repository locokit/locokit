import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'

import { transaction } from '@/feathers-objection'
import { HookContext } from '@/declarations'
import { WorkspaceResult } from '@/services/core/workspace/core-workspace.schema'

import { datasourceResolvers } from './datasource.resolver'
import { datasourceDataValidator, datasourceQueryValidator } from './datasource.schema'
import { SERVICES } from '@locokit/definitions'

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
        console.log('setWorkspaceSchema', context.params.query.workspaceId)
        const workspace: WorkspaceResult = await context.app
          .service(SERVICES.CORE_WORKSPACE)
          .get(context.params.query.workspaceId)
        context.service.schema = `w_${workspace.slug}`
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
      schemaHooks.resolveData(datasourceResolvers.data.create),
      schemaHooks.validateData(datasourceDataValidator),
      async function setWorkspaceSchema(context: HookContext) {
        const workspace: WorkspaceResult = await context.app
          .service(SERVICES.CORE_WORKSPACE)
          .get(context.data.workspaceId)
        context.service.schema = `w_${workspace.slug}`
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
