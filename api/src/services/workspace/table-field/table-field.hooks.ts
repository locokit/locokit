import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { transaction } from '@/feathers-objection'
import { HookContext } from '@/declarations'

import { tableFieldResolvers } from './table-field.resolver'
import { tableFieldDataValidator, tableFieldQueryValidator } from './table-field.schema'
import { SERVICES } from '@locokit/definitions'
import { TableResult } from '../table/table.schema'

async function setWorkspaceSchema(context: HookContext) {
  const { transaction } = context.params
  const tableId = context.method === 'create' ? context.data.tableId : context.params.query.tableId
  const table = (await context.app.service(SERVICES.CORE_TABLE).get(tableId, {
    transaction,
    query: {
      $eager: 'datasource',
    },
  })) as TableResult
  const workspace = await context.app
    .service(SERVICES.CORE_WORKSPACE)
    .get(table.datasource.workspaceId, {
      transaction,
    })
  context.service.schema = `w_${workspace.slug}`
  return context
}

export const tableFieldHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    get: [
      schemaHooks.resolveQuery(tableFieldResolvers.query),
      schemaHooks.validateData(tableFieldQueryValidator),
      setWorkspaceSchema,
    ],
    find: [
      schemaHooks.resolveQuery(tableFieldResolvers.query),
      schemaHooks.validateData(tableFieldQueryValidator),
      setWorkspaceSchema,
    ],
    create: [
      schemaHooks.resolveData(tableFieldResolvers.data.create),
      schemaHooks.validateData(tableFieldDataValidator),
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
