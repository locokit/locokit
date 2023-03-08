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
import { DB_TYPE } from '@locokit/definitions/src/fieldType'

const datasourceLogger = logger.child({ service: 'datasource' })

export interface DatasourceParams extends KnexAdapterParams<DatasourceQuery> { }

export interface Migration {
  action: 'CREATE' | 'UPDATE' | 'REMOVE'
  target: 'TABLE' | 'FIELD' | 'RELATION'
  direction: 'METAMODEL' | 'DATASOURCE'
  settings: Partial<KnexInspectorTable> & Partial<KnexInspectorColumn> & Partial<{
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
  /**
   * This custom method will analyze diffs
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  async diff(data: { id: string }, params: DatasourceParams): Promise<{
    datasource: DatasourceResult,
    diff: Migration[]
  }> {
    datasourceLogger.debug('computing diff between remote schema and meta model')

    const { authentication, provider, transaction, authenticated, user, route } = params

    const datasource = await this.get(data.id, {
      authentication,
      provider,
      transaction,
      authenticated,
      user,
      route,
      query: {
        $eager: '[tables.[fields]]', // relations
      },
    }) as DatasourceResult

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
          }
        })

        /**
         * Add all fields to the diff to apply
         */
        table.fields.forEach(field => {
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
              maxLength: field.max_length
            }
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
                toSchema: field.foreign_key_schema
              }
            })
          }
        })

      }
      /**
       * Else, find diffs at the table & fields level
      */
      else {
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
          }
        })
        /**
         * For each field, create table-field if it does not already exist
         */
        table.fields.forEach(field => {
          const fieldFromMetaModel: TableFieldResult = tableFromMetaModel.fields?.find(f => f.slug === field.name)
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
                maxLength: field.max_length
              }
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
                  toSchema: field.foreign_key_schema
                }
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
                maxLength: field.max_length
              }
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
                  toSchema: field.foreign_key_schema
                }
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
      diff: diffToApply
    }
  }

  /**
   * This custom method will sync all updates
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  async sync(data: { id: string }, params: DatasourceParams): Promise<{
    datasource: DatasourceResult,
    diff: Migration[]
  }> {
    datasourceLogger.debug('syncing the datasource %s, no matter which diff there are', data.id, data)
    return this.diff(data, params)
  }
}
