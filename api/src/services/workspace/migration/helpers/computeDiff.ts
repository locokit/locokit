import { Diff } from '@locokit/definitions'
import { type ConnexionSQL, type Table, createAdapter } from '@locokit/engine'
import { type ForeignKey, type Column } from '@directus/schema'
import { GeneralError } from '@feathersjs/errors'

import { logger } from '@/logger'

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
} from '../migration.helpers'
import { TableResult } from '@/services/workspace/table/table.schema'
import { TableFieldResult } from '@/services/workspace/table-field/table-field.schema'
import { TableRelationResult } from '@/services/workspace/table-relation/table-relation.schema'

const migrationLogger = logger.child({ service: 'migration-helper computeDiff' })

export async function computeDiff(
  direction: 'both' | 'from-datasource-to-metamodel' | 'from-metamodel-to-datasource',
  datasourceFromMetaModel: any,
): Promise<Diff> {
  /**
   * This custom method will analyze diffs
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */

  /**
   * Compute the diff to apply
   */
  migrationLogger.info('computing migration...')

  /**
   * Retrieve related datasource
   */
  migrationLogger.info('retrieving datasources metamodel and inspect remote schema')

  /**
   * TODO: extract retrieval of schema / tables / fields
   * for local / remote datasources
   * to respect the SRP
   */
  const dsParams: ConnexionSQL = {
    type: datasourceFromMetaModel.client,
    options: datasourceFromMetaModel.connection,
  }

  switch (datasourceFromMetaModel.type) {
    case 'local':
      const localSchema = `ds_${datasourceFromMetaModel.id as string}`
      // const role = `${schema as string}_ro`
      dsParams.options = process.env.LCK_DATABASE_URL as string
      // TODO: enable the read only role : https://github.com/locokit/locokit/issues/243
      // actually there is an error when the ro role access to the schema inspector
      // a function pg_get_serial_sequence try to access some schemas (tiger) the role can't
      // see knex-schema-inspector/lib/dialect/postgres.ts L302
      // dsParams.role = role
      dsParams.schema = localSchema
      break
    case 'remote':
      break
    default:
      throw new Error(
        'Other than "local" / "remote" type is not yet implemented for your datasource. Please ask us to create it, or create a pull request with the implementation.',
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

  if (direction === 'both' || direction === 'from-datasource-to-metamodel') {
    migrationLogger.info('from datasource to metamodel')

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
            diff: diffsTableSettings.diff,
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
                diff: diffsFieldSettings.diff,
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
                (r) => r.settings.name === foreignKey.constraint_name,
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
                      diff: diffsRelationsSettings.diff,
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
  }
  /**
   * Compute the diff between meta model and datasource
   */
  if (direction === 'both' || direction === 'from-metamodel-to-datasource') {
    migrationLogger.info('from metamodel to datasource')

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
                diff: diffsFieldSettings.diff,
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
                diff: diffsRelationsSettings.diff,
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
  }
  /**
   * Destroy the adapter
   */
  await adapter.destroy()

  // actually, we set diffToApply and the schema is not "accepting it"
  // we could do the computation of diffToApply in a resolver,
  // but errors thrown are encapsulated in a generic BadRequest error
  // cf https://github.com/locokit/locokit/issues/244
  return diffToApply
}
