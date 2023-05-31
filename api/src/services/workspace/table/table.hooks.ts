import { HookContext } from '@/declarations'
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { transaction } from '@/feathers-objection'

import { tableResolvers } from './table.resolvers'
import { tableDataValidator, tableQueryValidator } from './table.schema'
import { SERVICES } from '@locokit/definitions'

async function setWorkspaceSchema(context: HookContext) {
  const { transaction } = context.params

  const datasourceId =
    context.method === 'create' ? context.data.datasourceId : context.params.query.datasourceId

  const datasource = await context.app.service(SERVICES.CORE_DATASOURCE).get(datasourceId, {
    transaction,
    query: {
      $eager: 'workspace',
    },
  })
  context.service.schema = `w_${datasource.workspace?.slug as string}`
  return context
}

export const tableHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      schemaHooks.resolveQuery(tableResolvers.query),
      schemaHooks.validateQuery(tableQueryValidator),
      setWorkspaceSchema,
    ],
    find: [
      schemaHooks.resolveQuery(tableResolvers.query),
      schemaHooks.validateQuery(tableQueryValidator),
      setWorkspaceSchema,
    ],
    create: [
      schemaHooks.resolveData(tableResolvers.data.create),
      schemaHooks.validateData(tableDataValidator),
      setWorkspaceSchema,
    ],
  },
  after: {
    all: [transaction.end()],
  },
  error: {
    all: [transaction.rollback()],
  },
}
