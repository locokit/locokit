// import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { createAdapter } from '@locokit/engine'
import { Column as KnexInspectorColumn } from 'knex-schema-inspector/dist/types/column'
import { Table as KnexInspectorTable } from 'knex-schema-inspector/dist/types/table'

import { ObjectionService } from '@/feathers-objection'
import { logger } from '@/logger'

import type { DatasourceData, DatasourceResult, DatasourceQuery } from './datasource.schema'
import { TableResult } from '../table/table.schema'
// import { TableField } from '../table-field/table-field.class'
import { TableFieldResult } from '../table-field/table-field.schema'
import { convertDBTypeToFieldType, DB_TYPE } from '@locokit/definitions/src/fieldType'
import { Application } from '@/declarations'
import { SERVICES } from '@locokit/definitions'

const datasourceLogger = logger.child({ service: 'datasource' })

export interface DatasourceParams extends KnexAdapterParams<DatasourceQuery> {}

export interface Migration {
  action: 'CREATE' | 'UPDATE' | 'REMOVE'
  target: 'TABLE' | 'FIELD' | 'RELATION'
  direction: 'METAMODEL' | 'DATASOURCE'
  settings: Partial<KnexInspectorTable> &
    Partial<KnexInspectorColumn> &
    Partial<{
      dbType: DB_TYPE
      documentation: string | null
      type: string | null
      nullable: boolean
      primary: boolean
      default: string | number | null
      foreign: boolean
      maxLength: number | null
      fromTable: string
      fromSchema: string | null
      fromField: string
      toTable: string | null
      toField: string
      toSchema: string | null
    }>
}

export class Datasource extends ObjectionService<
  DatasourceResult,
  DatasourceData,
  DatasourceParams
> {
  app!: Application

  async setup(app: Application) {
    this.app = app
  }
  /**
   * This custom method will analyze diffs
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  async diff(
    data: { id: string },
    params: DatasourceParams,
  ): Promise<{
    datasource: DatasourceResult
    diff: Migration[]
  }> {
    datasourceLogger.debug('computing diff between remote schema and meta model')

    const { authentication, provider, transaction, authenticated, user, route } = params

    const datasource = (await this.get(data.id, {
      authentication,
      provider,
      transaction,
      authenticated,
      user,
      route,
      query: {
        $eager: '[tables.[fields]]', // relations
      },
    })) as DatasourceResult

    const dsParams = {
      type: datasource.client,
      options: datasource.connection,
    }

    const adapter = await createAdapter(dsParams)
    const schema = await adapter.retrieveSchema()

    /**
     * Compute the diff between datasource and meta model
     */
    const diffToApply: Migration[] = []

    schema.map((table) => {
      /**
       * Check if table already exist
       */
      const tableFromMetaModel = datasource.tables?.find((t: TableResult) => t.slug === table.name)

      /**
       * Create table and fields if not exist
       */
      if (!tableFromMetaModel) {
        diffToApply.push({
          action: 'CREATE',
          target: 'TABLE',
          direction: 'METAMODEL',
          settings: {
            name: table.name,
            schema: table.schema,
            documentation: table.comment,
          },
        })

        /**
         * Add all fields to the diff to apply
         */
        table.fields.forEach((field) => {
          diffToApply.push({
            action: 'CREATE',
            target: 'FIELD',
            direction: 'METAMODEL',
            settings: {
              table: table.name,
              schema: table.schema,
              name: field.name,
              documentation: field.comment,
              dbType: field.data_type as DB_TYPE,
              nullable: field.is_nullable,
              primary: field.is_primary_key,
              default: field.default_value,
              foreign: field.foreign_key_column ? true : false,
              maxLength: field.max_length,
            },
          })

          if (field.foreign_key_column) {
            diffToApply.push({
              action: 'CREATE',
              target: 'RELATION',
              direction: 'METAMODEL',
              settings: {
                fromTable: table.name,
                fromSchema: table.schema,
                fromField: field.name,
                toTable: field.foreign_key_table,
                toField: field.foreign_key_column,
                toSchema: field.foreign_key_schema,
              },
            })
          }
        })
      } else {
        /**
         * Else, find diffs at the table & fields level
         */
        /**
         * Find diff for the current table ?
         */
        diffToApply.push({
          action: 'UPDATE',
          target: 'TABLE',
          direction: 'METAMODEL',
          settings: {
            table: table.name,
            schema: table.schema,
            documentation: table.comment,
          },
        })
        /**
         * For each field, create table-field if it does not already exist
         */
        table.fields.forEach((field) => {
          const fieldFromMetaModel: TableFieldResult = tableFromMetaModel.fields?.find(
            (f) => f.slug === field.name,
          )
          if (!fieldFromMetaModel) {
            diffToApply.push({
              action: 'CREATE',
              target: 'FIELD',
              direction: 'METAMODEL',
              settings: {
                table: table.name,
                schema: table.schema,
                name: field.name,
                documentation: field.comment,
                dbType: field.data_type as DB_TYPE,
                nullable: field.is_nullable,
                primary: field.is_primary_key,
                default: field.default_value,
                foreign: field.foreign_key_column ? true : false,
                maxLength: field.max_length,
              },
            })

            if (field.foreign_key_column) {
              diffToApply.push({
                action: 'CREATE',
                target: 'RELATION',
                direction: 'METAMODEL',
                settings: {
                  fromTable: table.name,
                  fromSchema: table.schema,
                  fromField: field.name,
                  toTable: field.foreign_key_table,
                  toField: field.foreign_key_column,
                  toSchema: field.foreign_key_schema,
                },
              })
            }
          } else {
            /**
             * Find difference for the field !
             */
            diffToApply.push({
              action: 'UPDATE',
              target: 'FIELD',
              direction: 'METAMODEL',
              settings: {
                table: table.name,
                schema: table.schema,
                name: field.name,
                documentation: field.comment,
                dbType: field.data_type as DB_TYPE,
                nullable: field.is_nullable,
                primary: field.is_primary_key,
                default: field.default_value,
                foreign: field.foreign_key_column ? true : false,
                maxLength: field.max_length,
              },
            })

            if (field.foreign_key_column) {
              diffToApply.push({
                action: 'UPDATE',
                target: 'RELATION',
                direction: 'METAMODEL',
                settings: {
                  fromTable: table.name,
                  fromSchema: table.schema,
                  fromField: field.name,
                  toTable: field.foreign_key_table,
                  toField: field.foreign_key_column,
                  toSchema: field.foreign_key_schema,
                },
              })
            }
          }
        })
      }
    })

    /**
     * Destroy the adapter
     */
    await adapter.destroy()

    return {
      datasource,
      diff: diffToApply,
    }
  }

  /**
   * This custom method will sync all updates
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  async sync(
    data: { id: string },
    params: DatasourceParams,
  ): Promise<{
    datasource: DatasourceResult
    diff: Migration[]
  }> {
    datasourceLogger.debug(
      'syncing the datasource %s, no matter which diff there are',
      data.id,
      data,
    )
    const { datasource, diff } = await this.diff(data, params)

    if (diff.length > 0) {
      datasourceLogger.debug('applying migration for datasource %s', data.id)

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

      datasourceLogger.debug('current matching ids', matchingIds)

      /**
       * Creating tables
       */
      await Promise.all(
        diff
          .filter(
            (m) => m.direction === 'METAMODEL' && m.target === 'TABLE' && m.action === 'CREATE',
          )
          .map(async (m) => {
            datasourceLogger.debug('creating table %s', m.settings.name, {
              name: m.settings.name,
              slug: m.settings.name,
              datasourceId: datasource.id,
            })
            const table = await this.app.service(SERVICES.WORKSPACE_TABLE).create(
              {
                name: m.settings.name as string,
                slug: m.settings.name as string,
                datasourceId: data!.id as string,
              },
              {
                transaction: params.transaction,
              },
            )
            matchingIds.set('table_' + m.settings.name, table.id)
          }),
      )

      /**
       * Creating fields
       */
      await Promise.all(
        diff
          .filter(
            (m) => m.direction === 'METAMODEL' && m.target === 'FIELD' && m.action === 'CREATE',
          )
          .map(async (m) => {
            const tableId = matchingIds.get('table_' + m.settings.table)
            datasourceLogger.debug('creating field %s', m.settings.name, {
              name: m.settings.name,
              slug: m.settings.name,
              type: convertDBTypeToFieldType(datasource.client, m.settings.dbType),
              dbType: m.settings.dbType,
              settings: m.settings,
              tableId: matchingIds.get('table_' + m.settings.table),
            })
            if (!tableId)
              throw new Error(
                `Sync error, no table matching for field ${m.settings.table}.${m.settings.name}`,
              )

            const field = await this.app.service(SERVICES.WORKSPACE_TABLE_FIELD).create(
              {
                name: m.settings.name as string,
                slug: m.settings.name as string,
                type: convertDBTypeToFieldType(datasource.client, m.settings.dbType),
                dbType: m.settings.dbType as DB_TYPE,
                settings: m.settings,
                tableId: matchingIds.get('table_' + m.settings.table),
              },
              {
                transaction: params.transaction,
              },
            )
            matchingIds.set('field_' + m.settings.table + '_' + m.settings.name, field.id)
          }),
      )

      /**
       * Creating relations
       */
      await Promise.all(
        diff
          .filter(
            (m) => m.direction === 'METAMODEL' && m.target === 'RELATION' && m.action === 'CREATE',
          )
          .map(async (m) => {
            const fromTableId = matchingIds.get('table_' + m.settings.fromTable)
            const toTableId = matchingIds.get('table_' + m.settings.toTable)
            const fromFieldId = matchingIds.get(
              'field_' + m.settings.fromTable + '_' + m.settings.fromField,
            )
            const toFieldId = matchingIds.get(
              'field_' + m.settings.toTable + '_' + m.settings.toField,
            )
            if (!fromTableId || !toTableId || !fromFieldId || !toFieldId)
              throw new Error(
                `Sync error, missing table/field matching for relation between ${m.settings.fromTable} and ${m.settings.toTable}`,
              )

            datasourceLogger.debug('creating relation %s', m.settings.name, {
              fromTableId,
              fromFieldId,
              toTableId,
              toFieldId,
              type: '1-n',
              settings: m.settings,
            })

            const relation = await this.app.service(SERVICES.WORKSPACE_TABLE_RELATION).create(
              {
                fromTableId,
                fromFieldId,
                toTableId,
                toFieldId,
                type: '1-n',
                settings: m.settings,
              },
              {
                transaction: params.transaction,
              },
            )
            // matchingIds.set('relation_' + m.settings.fromTable + ', relation.id)
          }),
      )
    }

    return { datasource, diff }
  }
}
