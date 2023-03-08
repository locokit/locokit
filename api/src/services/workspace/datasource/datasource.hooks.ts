import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { convertDBTypeToFieldType, SERVICES } from '@locokit/definitions'
import { iff } from 'feathers-hooks-common'

import { transaction } from '@/feathers-objection'
import { HookContext } from '@/declarations'
import { WorkspaceResult } from '@/services/core/workspace/core-workspace.schema'
import { logger } from '@/logger'

import { datasourceResolvers } from './datasource.resolver'
import { datasourceDataValidator, datasourceQueryValidator, DatasourceResult } from './datasource.schema'
import { Datasource, Migration } from './datasource.class'
import { TableResult } from '../table/table.schema'
import { TableFieldResult } from '../table-field/table-field.schema'

const datasourceHooksLogger = logger.child({ service: 'datasource-hooks' })

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
          .service('workspace')
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
          .service('workspace')
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
          .service('workspace')
          .get(context.data.workspaceId)
        context.service.schema = `w_${workspace.slug}`
        return context
      },
    ],
  },
  after: {
    all: [
      iff(context => context.method !== 'sync', transaction.end())
    ],
    sync: [
      async (context: HookContext<Datasource>) => {
        datasourceHooksLogger.debug('datasource hook after %s', context.method)
        const { datasource, diff } = context.result as { datasource: DatasourceResult, diff: Migration[] }
        if (diff.length > 0) {
          datasourceHooksLogger.debug('applying migration for datasource %s', context.data.id)

          /**
           * Build the initial matching with existant tables and fields in the datasource
           */
          const matchingIds = new Map()
          // const currentDatasource = await context.service.get(context.data?.id as Id, { query: { $eager: '[tables.[fields]]' } }) as DatasourceResult
          datasource.tables?.forEach((t: TableResult) => {
            matchingIds.set('table_' + t.name, t.id)
            t.fields?.forEach((f: TableFieldResult) => {
              matchingIds.set('field_' + t.name + '_' + f.name, f.id)
            })
          })

          datasourceHooksLogger.debug('current matching ids', matchingIds)

          /**
           * Creating tables
           */
          await Promise.all(diff
            .filter(m => m.direction === 'METAMODEL' && m.target === 'TABLE' && m.action === 'CREATE')
            .map(async m => {
              datasourceHooksLogger.debug('creating table %s', m.settings.name, {
                name: m.settings.name,
                slug: m.settings.name,
                datasourceId: context.id
              })
              const table = await context.app.service(SERVICES.WORKSPACE_TABLE)
                .create({
                  name: m.settings.name,
                  slug: m.settings.name,
                  datasourceId: context.data.id
                }, {
                  transaction: context.params.transaction,
                })
              matchingIds.set('table_' + m.settings.name, table.id)
            })
          )

          /**
           * Creating fields
           */
          await Promise.all(diff
            .filter(m => m.direction === 'METAMODEL' && m.target === 'FIELD' && m.action === 'CREATE')
            .map(async m => {

              const tableId = matchingIds.get('table_' + m.settings.table)
              datasourceHooksLogger.debug('creating field %s', m.settings.name, {
                name: m.settings.name,
                slug: m.settings.name,
                type: convertDBTypeToFieldType(datasource.client, m.settings.dbType),
                dbType: m.settings.dbType,
                settings: m.settings,
                tableId: matchingIds.get('table_' + m.settings.table)
              })
              if (!tableId) throw new Error(`Sync error, no table matching for field ${m.settings.table}.${m.settings.name}`)

              const field = await context.app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
                name: m.settings.name,
                slug: m.settings.name,
                type: convertDBTypeToFieldType(datasource.client, m.settings.dbType),
                dbType: m.settings.dbType,
                settings: m.settings,
                tableId: matchingIds.get('table_' + m.settings.table)
              }, {
                transaction: context.params.transaction,
              })
              matchingIds.set('field_' + m.settings.table + '_' + m.settings.name, field.id)
            })
          )

          /**
           * Creating relations
           */
          await Promise.all(diff
            .filter(m => m.direction === 'METAMODEL' && m.target === 'RELATION' && m.action === 'CREATE')
            .map(async m => {
              const fromTableId = matchingIds.get('table_' + m.settings.fromTable)
              const toTableId = matchingIds.get('table_' + m.settings.toTable)
              const fromFieldId = matchingIds.get('field_' + m.settings.fromTable + '_' + m.settings.fromField)
              const toFieldId = matchingIds.get('field_' + m.settings.toTable + '_' + m.settings.toField)
              if (!fromTableId || !toTableId || !fromFieldId || !toFieldId)
                throw new Error(`Sync error, missing table/field matching for relation between ${m.settings.fromTable} and ${m.settings.toTable}`)

              datasourceHooksLogger.debug('creating relation %s', m.settings.name, {
                fromTableId,
                fromFieldId,
                toTableId,
                toFieldId,
                type: '1-n',
                settings: m.settings,
              })

              const relation = await context.app.service(SERVICES.WORKSPACE_TABLE_RELATION).create({
                fromTableId,
                fromFieldId,
                toTableId,
                toFieldId,
                type: '1-n',
                settings: m.settings,
              }, {
                transaction: context.params.transaction,
              })
              // matchingIds.set('relation_' + m.settings.fromTable + ', relation.id)
            })
          )


        }
        return context
      },
      transaction.end()
    ]
  },
  error: {
    all: [transaction.rollback()],
  },
}
