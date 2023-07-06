import { resolve } from '@feathersjs/schema'
import type { HookContext, stringNumberUndefined } from '@/declarations'

import type {
  MigrationDataInternal,
  MigrationPatch,
  MigrationResult,
  MigrationQuery,
} from './migration.schema'
import { logger } from '@/logger'
import { DB_TYPE, SERVICES } from '@locokit/definitions'
import { createAdapter } from '@locokit/engine'
import { TableResult } from '../table/table.schema'
import { ConnexionSQL, GenericMigration } from '@locokit/engine/adapters/interface'
import { TableFieldResult } from '../table-field/table-field.schema'
import { TableRelationResult } from '../table-relation/table-relation.schema'

const migrationLogger = logger.child({ service: 'migration-resolver' })

// Resolver for the basic data model (e.g. creating new entries)
export const migrationDataResolver = resolve<MigrationDataInternal, HookContext>({
  async createdAt(createdAt) {
    let stringToConvert: stringNumberUndefined = createdAt
    if (!stringToConvert) stringToConvert = Date.now()
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return createdAt
  },

  async updatedAt(updatedAt) {
    let stringToConvert: stringNumberUndefined = updatedAt
    if (!stringToConvert) stringToConvert = Date.now()
    if (typeof stringToConvert === 'number') {
      return new Date(stringToConvert).toISOString()
    } else return updatedAt
  },
  /**
   * This custom method will analyze diffs
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  async diffToApply(_, data, context): Promise<GenericMigration> {
    migrationLogger.info('Computing diffToApply')

    /**
     * Retrieve related datasource
     */
    migrationLogger.debug('computing diff between remote schema and meta model')

    const { authentication, provider, transaction, authenticated, user, route } = context.params

    const datasource = await context.app
      .service(SERVICES.WORKSPACE_DATASOURCE)
      .get(data.datasourceId, {
        authentication,
        provider,
        transaction,
        authenticated,
        user,
        route,
        query: {
          $eager:
            '[tables.[fields, relations.[toTable,throughTable,fromField,toField,throughField]]]', // relations
        },
      })

    const dsParams: ConnexionSQL = {
      type: datasource.client,
      options: datasource.connection,
    }

    switch (datasource.type) {
      case 'local':
        const schema = `ds_${datasource.id as string}`
        const role = `${schema as string}_ro`
        dsParams.options = process.env.LCK_DATABASE_URL as string
        dsParams.role = role
        dsParams.schema = schema
    }

    const adapter = await createAdapter(dsParams)
    const schema = await adapter.retrieveSchema(dsParams.schema)

    /**
     * Compute the diff between datasource and meta model
     */
    const diffToApply: GenericMigration = {
      datasource: [],
      metamodel: [],
    }
    const datasourceTables: string[] = []
    const datasourceTableFields: string[] = []
    const datasourceTableRelations: string[] = []
    // const metamodelTables: string[] = []

    schema.forEach((table) => {
      datasourceTables.push(table.name)
      /**
       * Check if table already exist
       */
      const tableFromMetaModel = datasource.tables?.find((t: TableResult) => t.slug === table.name)

      /**
       * Create table and fields if not exist
       */
      if (!tableFromMetaModel) {
        diffToApply.metamodel.push({
          action: 'CREATE',
          target: 'TABLE',
          settings: {
            name: table.name,
            schema: table.schema,
            documentation: table.comment,
          },
        })

        /**
         * Add all fields to the diff to apply
         */
        table.fields?.forEach((field) => {
          datasourceTableFields.push(`${table.name}.${field.name}`)
          diffToApply.metamodel.push({
            action: 'CREATE',
            target: 'FIELD',
            settings: {
              table: table.name,
              schema: table.schema,
              name: field.name,
              documentation: field.comment,
              dbType: field.data_type as DB_TYPE,
              nullable: field.is_nullable,
              primary: field.is_primary_key,
              default: field.default_value,
              foreign: !!field.foreign_key_column,
              maxLength: field.max_length,
            },
          })

          if (field.foreign_key_column) {
            diffToApply.metamodel.push({
              action: 'CREATE',
              target: 'RELATION',
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
        diffToApply.metamodel.push({
          action: 'UPDATE',
          target: 'TABLE',
          settings: {
            table: table.name,
            schema: table.schema,
            documentation: table.comment,
          },
        })
        /**
         * For each field, create table-field if it does not already exist
         */
        table.fields?.forEach((field) => {
          const fieldFromMetaModel: TableFieldResult = tableFromMetaModel.fields?.find(
            (f) => f.slug === field.name,
          )
          if (!fieldFromMetaModel) {
            diffToApply.metamodel.push({
              action: 'CREATE',
              target: 'FIELD',
              settings: {
                table: table.name,
                schema: table.schema,
                name: field.name,
                documentation: field.comment,
                dbType: field.data_type as DB_TYPE,
                nullable: field.is_nullable,
                primary: field.is_primary_key,
                default: field.default_value,
                foreign: !!field.foreign_key_column,
                maxLength: field.max_length,
              },
            })

            if (field.foreign_key_column) {
              diffToApply.metamodel.push({
                action: 'CREATE',
                target: 'RELATION',
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
            diffToApply.metamodel.push({
              action: 'UPDATE',
              target: 'FIELD',
              settings: {
                table: table.name,
                schema: table.schema,
                name: field.name,
                documentation: field.comment,
                dbType: field.data_type as DB_TYPE,
                nullable: field.is_nullable,
                primary: field.is_primary_key,
                default: field.default_value,
                foreign: !!field.foreign_key_column,
                maxLength: field.max_length,
              },
            })

            if (field.foreign_key_column) {
              diffToApply.metamodel.push({
                action: 'UPDATE',
                target: 'RELATION',
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
     * Compute the diff between meta model and datasource
     */
    datasource.tables?.forEach((table) => {
      /**
       * Does the table already exist in datasource ?
       */
      if (datasourceTables[table.slug]) {
        /**
         * If yes, check each field
         */
        table.fields?.forEach((field: TableFieldResult) => {
          /**
           * Does the field already exist ?
           */
          if (datasourceTableFields[field.slug]) {
            /**
             * If yes, check settings
             */
          } else {
            /**
             * If no, create the field
             */
            diffToApply.datasource.push({
              action: 'CREATE',
              target: 'FIELD',
              settings: {
                table: table.slug,
                schema: `ds_${datasource.id as string}`,
                name: field.slug,
                documentation: field.comment,
                dbType: field.dbType,
              },
            })
          }
        })
        /**
         * Does the relation already exist ?
         */
        table.relations?.forEach((relation: TableRelationResult) => {
          /**
           * Does the field already exist ?
           */
          if (datasourceTableRelations[relation.slug]) {
            /**
             * If yes, check settings
             */
          } else {
            /**
             * If no, create the relation
             */
            diffToApply.datasource.push({
              action: 'CREATE',
              target: 'RELATION',
              settings: {
                fromTable: table.slug,
                fromSchema: table.schema,
                fromField: relation.fromField.slug,
                toTable: relation.toTable.slug,
                toField: relation.toField.slug,
                toSchema: relation.toTable.schema,
                schema: `ds_${datasource.id as string}`,
              },
            })
          }
        })
      } else {
        /**
         * If no, create the table + fields + relations
         */
        diffToApply.datasource.push({
          action: 'CREATE',
          target: 'TABLE',
          settings: {
            name: table.slug,
            schema: `ds_${datasource.id as string}`,
            documentation: table.comment,
          },
        })
        table.fields?.forEach((field: TableFieldResult) => {
          diffToApply.datasource.push({
            action: 'CREATE',
            target: 'FIELD',
            settings: {
              table: table.slug,
              schema: `ds_${datasource.id as string}`,
              name: field.slug,
              documentation: field.comment,
              dbType: field.dbType,
              primary: field.type === 'ID_NUMBER' || field.type === 'ID_UUID',
            },
          })
        })
        table.relations?.forEach((relation: TableRelationResult) => {
          diffToApply.datasource.push({
            action: 'CREATE',
            target: 'RELATION',
            settings: {
              fromTable: table.slug,
              fromSchema: table.schema || `ds_${datasource.id as string}`,
              fromField: relation.fromField?.slug,
              toTable: relation.toTable?.slug,
              toField: relation.toField?.slug,
              toSchema: `ds_${relation.toTable?.datasourceId as string}`,
              type: relation.type,
            },
          })
        })
      }
    })

    /**
     * Check that there is no conflict between both directions MM <> DS,
     * eg if there is a migration for the same field / table / relation
     *
     * If so, raise an error for the moment to avoid any circular problem
     */

    /**
     * Destroy the adapter
     */
    await adapter.destroy()

    return diffToApply
  },
})

// Resolver for making partial updates
export const migrationPatchResolver = resolve<MigrationPatch, HookContext>({})
// Resolver for the data that is being returned
export const migrationResultResolver = resolve<MigrationResult, HookContext>({})

// Resolver for query properties
export const migrationQueryResolver = resolve<MigrationQuery, HookContext>({})

// Export all resolvers in a format that can be used with the resolveAll hook
export const migrationResolvers = {
  result: migrationResultResolver,
  data: {
    create: migrationDataResolver,
    update: migrationDataResolver,
    patch: migrationPatchResolver,
  },
  query: migrationQueryResolver,
}
