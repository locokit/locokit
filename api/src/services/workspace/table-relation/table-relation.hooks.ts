import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { transaction } from '@/feathers-objection'
import { HookContext } from '@/declarations'

import { tableRelationResolvers } from './table-relation.resolver'
import { tableRelationDataValidator, tableRelationQueryValidator } from './table-relation.schema'
import { SERVICES } from '@locokit/definitions'
import { MethodNotAllowed } from '@feathersjs/errors/lib'
import { TableResult } from '../table/table.schema'

async function setWorkspaceSchema(context: HookContext) {
  const { transaction } = context.params
  if (['create', 'patch'].indexOf(context.method) === -1)
    throw new MethodNotAllowed(
      'Cannot set workspace schema. Only POST and PATCH methods are allowed',
    )

  const tableId = context.data.fromTableId
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

export const tableRelationHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [transaction.start()],
    create: [
      schemaHooks.resolveData(tableRelationResolvers.data.create),
      schemaHooks.validateData(tableRelationDataValidator),
      setWorkspaceSchema,
    ],
    patch: [
      schemaHooks.resolveData(tableRelationResolvers.data.patch),
      schemaHooks.validateData(tableRelationDataValidator),
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
