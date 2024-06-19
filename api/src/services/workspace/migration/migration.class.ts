import type { KnexAdapterParams } from '@feathersjs/knex'
import {
  MigrationDataInternal,
  MigrationResult,
  MigrationQuery,
  MigrationPatch,
  migrationDataInternalValidator,
} from './migration.schema'
import { ObjectionService } from '@/feathers-objection'
import { GeneralError, NotAcceptable, NotImplemented } from '@feathersjs/errors'
import { Id } from '@feathersjs/feathers'

import { logger } from '@/logger'
import {
  convertDBTypeToFieldType,
  DB_TYPE,
  DiffItemRelationSettings,
  SERVICES,
  Diff,
  DiffItemTable,
  DiffItemField,
  DiffItemRelation,
} from '@locokit/definitions'
import {
  computeDiffFieldSettings,
  computeDiffTableSettings,
  getFieldSettingsFromDatasource,
  getFieldSettingsFromMetaModel,
  getTableSettingsFromMetaModel,
  getTableSettingsFromDatasource,
  getRelationSettingsFromDatasource,
  getRelationSettingsFromMetaModel,
  computeDiffRelationsSettings,
} from './migration.helpers'
import { Column } from 'knex-schema-inspector/dist/types/column'
import { ForeignKey } from 'knex-schema-inspector/dist/types/foreign-key'

import { Application } from '@/declarations'
import { TableResult } from '../table/table.schema'
import { TableFieldResult } from '../table-field/table-field.schema'
import { type ConnexionSQL, type Table, createAdapter } from '@locokit/engine'
import { TableRelationResult } from '../table-relation/table-relation.schema'

const migrationLogger = logger.child({ service: 'datasource' })

export interface MigrationParams extends KnexAdapterParams<MigrationQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class Migration extends ObjectionService<
  MigrationResult,
  MigrationDataInternal,
  MigrationParams,
  MigrationPatch
> {
  app!: Application

  setup(app: Application) {
    this.app = app
  }

  async create(data: MigrationDataInternal, params?: MigrationParams): Promise<MigrationResult>
  async create(data: MigrationDataInternal[], params?: MigrationParams): Promise<MigrationResult[]>
  async create(
    data: MigrationDataInternal | MigrationDataInternal[],
    params?: MigrationParams,
  ): Promise<MigrationResult | MigrationResult[]> {
    if (Array.isArray(data)) throw new NotImplemented('Creation of migration is not yet available.')
    /**
     * This custom method will analyze diffs
     * between real schema and meta model stored in LocoKit
     *
     * Real schema > Meta model
     */

    /**
     * Compute the diff to apply
     */
    migrationLogger.info('Computing diffToApply')

    /**
     * Retrieve related datasource
     */
    migrationLogger.debug('computing diff between remote schema and meta model')

    const { authentication, provider, transaction, authenticated, user, route } =
      params as MigrationParams

    const datasourceFromMetaModel = await this.app
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
      type: datasourceFromMetaModel.client,
      options: datasourceFromMetaModel.connection,
    }

    switch (datasourceFromMetaModel.type) {
      case 'local':
        const schema = `ds_${datasourceFromMetaModel.id as string}`
        // const role = `${schema as string}_ro`
        dsParams.options = process.env.LCK_DATABASE_URL as string
        // TODO: enable the read only role : https://github.com/locokit/locokit/issues/243
        // actually there is an error when the ro role access to the schema inspector
        // a function pg_get_serial_sequence try to access some schemas (tiger) the role can't
        // see knex-schema-inspector/lib/dialect/postgres.ts L302
        // dsParams.role = role
        dsParams.schema = schema
        break
      default:
        throw new Error(
          'Diff is not yet implemented for your datasource. Please ask us to create it, or create a pull request with the implementation.',
        )
    }

    const adapter = await createAdapter(dsParams)
    const schemaTables = await adapter.retrieveSchema(dsParams.schema)

    /**
     * Compute the diff between datasource and meta model
     */
    const diffToApply: Diff = {
      datasource: [],
      metamodel: [],
    }
    const datasourceTables: string[] = []
    const datasourceTableFields: string[] = []
    const datasourceTableRelations: string[] = []
    // const metamodelTables: string[] = []

    schemaTables.forEach((table) => {
      datasourceTables.push(table.name)
      /**
       * Check if table already exist
       */
      const tableFromMetaModel = datasourceFromMetaModel.tables?.find(
        (t: TableResult) => t.slug === table.name,
      )

      /**
       * Create table and fields if not exist
       */
      if (!tableFromMetaModel) {
        diffToApply.metamodel.push({
          action: 'CREATE',
          target: 'TABLE',
          settings: getTableSettingsFromDatasource(table),
        })

        /**
         * Add all fields to the diff to apply
         */
        table.fields?.forEach((field) => {
          datasourceTableFields.push(`${table.name}.${field.name}`)
          diffToApply.metamodel.push({
            action: 'CREATE',
            target: 'FIELD',
            settings: getFieldSettingsFromDatasource(field, table),
          })

          const fieldForeignKeys = table.foreigns?.filter(
            (f) => f.column === field.name && f.table === table.name,
          )

          fieldForeignKeys?.forEach((foreignKey: ForeignKey) => {
            datasourceTableRelations.push(
              foreignKey.constraint_name ?? 'FK_' + table.name + '_' + field.name,
            )

            diffToApply.metamodel.push({
              action: 'CREATE',
              target: 'RELATION',
              settings: getRelationSettingsFromDatasource(foreignKey, table),
            })
          })
        })
      } else {
        /**
         * Else, find diffs at the table & fields level
         */
        /**
         * Find diff for the current table
         */
        const diffsTableSettings = computeDiffTableSettings(table, tableFromMetaModel)

        if (diffsTableSettings.diff.length > 0) {
          diffToApply.metamodel.push({
            action: 'UPDATE',
            target: 'TABLE',
            settings: diffsTableSettings.tableSettingsFromDatasource,
          })
        }
        /**
         * For each field, create table-field if it does not already exist
         */
        table.fields?.forEach((field) => {
          datasourceTableFields.push(`${table.name}.${field.name}`)

          const fieldFromMetaModel: TableFieldResult = tableFromMetaModel.fields?.find(
            (f) => f.slug === field.name,
          )
          const fieldForeignKeys = table.foreigns?.filter(
            (f) => f.column === field.name && f.table === table.name,
          )

          if (!fieldFromMetaModel) {
            diffToApply.metamodel.push({
              action: 'CREATE',
              target: 'FIELD',
              settings: getFieldSettingsFromDatasource(field, table),
            })

            fieldForeignKeys?.forEach((foreignKey: ForeignKey) => {
              datasourceTableRelations.push(
                foreignKey.constraint_name ?? 'FK_' + table.name + '_' + field.name,
              )

              diffToApply.metamodel.push({
                action: 'CREATE',
                target: 'RELATION',
                settings: getRelationSettingsFromDatasource(foreignKey, table),
              })
            })
          } else {
            /**
             * Find difference for the field !
             */
            const diffsFieldSettings = computeDiffFieldSettings(
              field,
              table,
              fieldFromMetaModel,
              tableFromMetaModel,
            )

            if (diffsFieldSettings.diff.length > 0) {
              diffToApply.metamodel.push({
                action: 'UPDATE',
                target: 'FIELD',
                settings: diffsFieldSettings.fieldSettingsFromDatasource,
              })
            }

            fieldForeignKeys?.forEach((foreignKey: ForeignKey) => {
              datasourceTableRelations.push(
                foreignKey.constraint_name ?? 'FK_' + table.name + '_' + field.name,
              )
              /**
               * Find the matching relation(s) in table from metamodel
               */
              const relationsFromMetaModel = tableFromMetaModel.relations?.filter(
                (r) => r.slug === foreignKey.constraint_name,
              )

              if (relationsFromMetaModel) {
                if (relationsFromMetaModel.length > 1)
                  throw new GeneralError(
                    `More than one matching for the relation ${table.name}.${field.name} > ${
                      foreignKey.foreign_key_table ?? '[UNKNOWN]'
                    }.${foreignKey.foreign_key_column}`,
                  )
                if (relationsFromMetaModel.length === 0)
                  diffToApply.metamodel.push({
                    action: 'CREATE',
                    target: 'RELATION',
                    settings: getRelationSettingsFromDatasource(foreignKey, table),
                  })
                else {
                  /**
                   * There is already a relation, we check differences
                   */
                  const diffsRelationsSettings = computeDiffRelationsSettings(
                    foreignKey,
                    table,
                    relationsFromMetaModel[0],
                    tableFromMetaModel,
                  )

                  if (diffsRelationsSettings.diff.length > 0) {
                    diffToApply.metamodel.push({
                      action: 'UPDATE',
                      target: 'RELATION',
                      settings: diffsRelationsSettings.relationSettingsFromDatasource,
                    })
                  }
                }
              } else {
                diffToApply.metamodel.push({
                  action: 'CREATE',
                  target: 'RELATION',
                  settings: getRelationSettingsFromDatasource(foreignKey, table),
                })
              }
            })
          }
        })
      }
    })

    /**
     * Compute the diff between meta model and datasource
     */
    datasourceFromMetaModel.tables?.forEach((table: TableResult) => {
      /**
       * Does the table already exist in datasource ?
       */
      if (datasourceTables.includes(table.slug)) {
        const tableFromDatasource = schemaTables.find((t: Table) => t.name === table.slug) as Table

        /**
         * If yes, check each field
         */
        table.fields?.forEach((field: TableFieldResult) => {
          /**
           * Does the field already exist ?
           */
          if (datasourceTableFields.includes(`${table.slug}.${field.slug}`)) {
            const fieldFromDatasource = tableFromDatasource?.fields?.find(
              (t: Table) => t.name === field.slug,
            ) as Column
            /**
             * Find difference for the field
             */
            const diffsFieldSettings = computeDiffFieldSettings(
              fieldFromDatasource,
              tableFromDatasource,
              field,
              table,
            )

            if (diffsFieldSettings.diff.length > 0) {
              diffToApply.datasource.push({
                action: 'UPDATE',
                target: 'FIELD',
                settings: diffsFieldSettings.fieldSettingsFromMetamodel,
              })
            }
          } else {
            /**
             * If no, create the field
             */
            diffToApply.datasource.push({
              action: 'CREATE',
              target: 'FIELD',
              settings: getFieldSettingsFromMetaModel(field, table),
            })
          }
        })

        table.relations?.forEach((relation: TableRelationResult) => {
          /**
           * Does the relation already exist ?
           */
          if (datasourceTableRelations.includes(relation.slug)) {
            /**
             * If yes, check settings
             */
            const foreignKeyFromDatasource = tableFromDatasource?.foreigns?.find(
              (t: ForeignKey) => t.constraint_name === relation.slug,
            ) as ForeignKey
            const diffsRelationsSettings = computeDiffRelationsSettings(
              foreignKeyFromDatasource,
              tableFromDatasource,
              relation,
              table,
            )

            if (diffsRelationsSettings.diff.length > 0) {
              diffToApply.metamodel.push({
                action: 'UPDATE',
                target: 'RELATION',
                settings: diffsRelationsSettings.relationSettingsFromDatasource,
              })
            }
          } else {
            /**
             * If no, create the relation
             */
            diffToApply.datasource.push({
              action: 'CREATE',
              target: 'RELATION',
              settings: getRelationSettingsFromMetaModel(relation, table),
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
          settings: getTableSettingsFromMetaModel(table),
        })
        table.fields?.forEach((field: TableFieldResult) => {
          diffToApply.datasource.push({
            action: 'CREATE',
            target: 'FIELD',
            settings: getFieldSettingsFromMetaModel(field, table),
          })
        })
        table.relations?.forEach((relation: TableRelationResult) => {
          diffToApply.datasource.push({
            action: 'CREATE',
            target: 'RELATION',
            settings: getRelationSettingsFromMetaModel(relation, table),
          })
        })
      }
    })

    /**
     * Destroy the adapter
     */
    await adapter.destroy()

    /**
     * Check the migration is not a two-way one (ds > mm, mm > ds)
     */
    if (diffToApply.datasource.length > 0 && diffToApply.metamodel.length > 0)
      throw new NotAcceptable('The migration is a two-way one. This is not yet implemented.')

    /**
     * Check that there is at least a migration to apply, else raise an Error
     */
    if (diffToApply.datasource.length === 0 && diffToApply.metamodel.length === 0) {
      throw new NotAcceptable('No diff found between datasource and metamodel.')
    }

    // actually, we set diffToApply and the schema is not "accepting it"
    // we could do the computation of diffToApply in a resolver,
    // but errors thrown are encapsulated in a generic BadRequest error
    // cf https://github.com/locokit/locokit/issues/244
    data.diffToApply = diffToApply

    await migrationDataInternalValidator(data)

    return await this._create(data, params)
  }

  /**
   * This custom method will sync all updates
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  async apply({ id }: { id: Id }, params?: MigrationParams): Promise<MigrationResult> {
    /**
     * Retrieve the migration to apply and which schema
     */
    const migration = await this._get(id, params)
    const datasourceId = migration.datasourceId

    migrationLogger.debug('applying migration for datasource %s', datasourceId)

    /**
     * Check the migration is not a two-way one (ds > mm, mm > ds)
     */
    if (migration.diffToApply.datasource.length > 0 && migration.diffToApply.metamodel.length > 0)
      throw new NotAcceptable('The migration is a two-way one. This is not yet implemented.')

    /**
     * Build the initial matching with existant tables and fields in the datasource
     */
    const matchingIds = new Map()
    const datasource = await this.app
      .service(SERVICES.WORKSPACE_DATASOURCE)
      .get(datasourceId, { query: { $eager: '[tables.[fields]]' } })
    datasource.tables?.forEach((t: TableResult) => {
      matchingIds.set('table_' + t.slug, t.id)
      t.fields?.forEach((f: TableFieldResult) => {
        matchingIds.set('field_' + t.slug + '_' + f.slug, f.id)
      })
      t.relations?.forEach((r: TableRelationResult) => {
        matchingIds.set('relation_' + t.slug + '_' + r.slug, r.id)
      })
    })

    migrationLogger.debug('current matching ids', matchingIds)

    /**
     * Create all resources (table / field / relation)
     * in one single transaction for distant database
     */
    if (migration.diffToApply.datasource?.length > 0) {
      const dsParams: ConnexionSQL = {
        type: datasource.client,
        options: datasource.connection,
      }

      switch (datasource.type) {
        case 'local':
          const schema = `ds_${datasource.id as string}`
          const role = `${schema as string}_alter`
          dsParams.options = process.env.LCK_DATABASE_URL as string
          dsParams.role = role
          dsParams.schema = schema
      }
      const adapter = await createAdapter(dsParams)
      await adapter.applyMigration(migration.diffToApply.datasource)
    } else {
      /**
       * Create all resources (table / field / relation)
       * in one single transaction for meta model
       */
      /**
       * Creating tables
       */
      const tables = migration.diffToApply.metamodel.filter(
        (m) => m.target === 'TABLE' && m.action === 'CREATE',
      ) as DiffItemTable[]
      await tables.reduce(async (p: Promise<any>, m: DiffItemTable) => {
        migrationLogger.debug('creating table %s', m.settings.name, {
          name: m.settings.name,
          slug: m.settings.name,
          datasourceId,
        })
        const table = await this.app.service(SERVICES.WORKSPACE_TABLE).create(
          {
            name: m.settings.name as string,
            datasourceId,
            documentation: m.settings.documentation,
          },
          {
            transaction: params?.transaction,
          },
        )
        matchingIds.set(`table_${m.settings.name as string}`, table.id)
      }, Promise.resolve())

      /**
       * Creating fields
       */
      const fields = migration.diffToApply.metamodel.filter(
        (m) => m.target === 'FIELD' && m.action === 'CREATE',
      ) as DiffItemField[]
      await fields.reduce(async (p: Promise<any>, m: DiffItemField) => {
        await p
        const tableId = matchingIds.get(`table_${m.settings.table as string}`)
        migrationLogger.debug('creating field %s', m.settings.name, {
          name: m.settings.name,
          slug: m.settings.name,
          type: convertDBTypeToFieldType(datasource.client, m.settings.dbType, m.settings.primary),
          dbType: m.settings.dbType,
          settings: m.settings,
          tableId,
        })
        if (!tableId)
          throw new Error(
            `Sync error, no table matching for field ${m.settings.table as string}.${
              m.settings.name as string
            }`,
          )

        const field = await this.app.service(SERVICES.WORKSPACE_TABLE_FIELD).create(
          {
            name: m.settings.name as string,
            documentation: m.settings.documentation,
            type: convertDBTypeToFieldType(
              datasource.client,
              m.settings.dbType,
              m.settings.primary,
            ),
            dbType: m.settings.dbType as DB_TYPE,
            settings: m.settings,
            tableId,
          },
          {
            transaction: params?.transaction,
          },
        )
        matchingIds.set(
          'field_' + (m.settings.table as string) + '_' + (m.settings.name as string),
          field?.id,
        )
      }, Promise.resolve())

      /**
       * Creating relations
       */
      const relations = migration.diffToApply.metamodel.filter(
        (m) => m.target === 'RELATION' && m.action === 'CREATE',
      ) as DiffItemRelation[]
      await relations.reduce(async (p: Promise<any>, m: DiffItemRelation) => {
        await p
        const settings = m.settings as DiffItemRelationSettings
        const fromTableId = matchingIds.get('table_' + (settings.fromTable as string))
        const toTableId = matchingIds.get('table_' + (settings.toTable as string))
        const fromFieldId = matchingIds.get(
          'field_' + (settings.fromTable as string) + '_' + (settings.fromField as string),
        )
        const toFieldId = matchingIds.get(
          'field_' + (settings.toTable as string) + '_' + (settings.toField as string),
        )
        migrationLogger.debug('creating relation %s', settings.name, {
          fromTableId,
          fromFieldId,
          toTableId,
          toFieldId,
          type: '1-n',
          settings,
        })
        if (!fromTableId || !toTableId || !fromFieldId || !toFieldId)
          throw new Error(
            `Sync error, missing table/field matching for relation between ${
              settings.fromTable as string
            } and ${settings.toTable as string}`,
          )

        // const relation =
        const relation = await this.app.service(SERVICES.WORKSPACE_TABLE_RELATION).create(
          {
            fromTableId,
            fromFieldId,
            toTableId,
            toFieldId,
            type: '1-n',
            settings,
            name: `${settings.fromTable as string}.${settings.fromField as string} > ${
              settings.toTable as string
            }.${settings.toField as string}`,
          },
          {
            transaction: params?.transaction,
          },
        )
        matchingIds.set(
          'relation_' + (settings.fromTable as string) + '_' + (relation.slug as string),
          relation.id,
        )
      }, Promise.resolve())
    }

    return await this._patch(
      id,
      { applied: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { transaction: params?.transaction },
    )
  }

  async revert() {
    throw new NotImplemented('revert migration is not yet implemented')
  }
}
