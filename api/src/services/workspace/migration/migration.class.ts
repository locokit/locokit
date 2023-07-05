import type { KnexAdapterParams } from '@feathersjs/knex'
import type { MigrationData, MigrationResult, MigrationQuery } from './migration.schema'
import { ObjectionService } from '@/feathers-objection'
import { NotImplemented } from '@feathersjs/errors/lib'
import { Id } from '@feathersjs/feathers'

import { logger } from '@/logger'
import { convertDBTypeToFieldType, DB_TYPE, SERVICES } from '@locokit/definitions'
import { Application } from '@/declarations'
import { TableResult } from '../table/table.schema'
import { TableFieldResult } from '../table-field/table-field.schema'
import { ConnexionSQL } from '@locokit/engine/adapters/interface'
import { createAdapter } from '@locokit/engine'

const migrationLogger = logger.child({ service: 'datasource' })

export interface MigrationParams extends KnexAdapterParams<MigrationQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class Migration extends ObjectionService<MigrationResult, MigrationData, MigrationParams> {
  app!: Application

  setup(app: Application) {
    this.app = app
  }

  /**
   * This custom method will sync all updates
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  async apply(id: Id, params?: MigrationParams) {
    /**
     * Retrieve the migration to apply and which schema
     */
    const migration = await this._get(id, params)
    const datasourceId = migration.datasourceId

    migrationLogger.debug('applying migration for datasource %s', datasourceId)

    /**
     * Build the initial matching with existant tables and fields in the datasource
     */
    const matchingIds = new Map()
    const datasource = await this.app
      .service(SERVICES.WORKSPACE_DATASOURCE)
      .get(datasourceId, { query: { $eager: '[tables.[fields]]' } })
    datasource.tables?.forEach((t: TableResult) => {
      matchingIds.set('table_' + t.name, t.id)
      t.fields?.forEach((f: TableFieldResult) => {
        matchingIds.set('field_' + t.name + '_' + f.name, f.id)
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
    }

    /**
     * Create all resources (table / field / relation)
     * in one single transaction for meta model
     */
    if (migration.diffToApply.metamodel?.length > 0) {
      /**
       * Creating tables
       */
      const tables = migration.diffToApply.metamodel.filter(
        (m) => m.target === 'TABLE' && m.action === 'CREATE',
      )
      await Promise.all(
        tables.map(async (m) => {
          migrationLogger.debug('creating table %s', m.settings.name, {
            name: m.settings.name,
            slug: m.settings.name,
            datasourceId,
          })
          const table = await this.app.service(SERVICES.WORKSPACE_TABLE).create(
            {
              name: m.settings.name as string,
              datasourceId,
            },
            {
              transaction: params?.transaction,
            },
          )
          matchingIds.set(`table_${m.settings.name as string}`, table.id)
        }),
      )

      /**
       * Creating fields
       */
      const fields = migration.diffToApply.metamodel.filter(
        (m) => m.target === 'FIELD' && m.action === 'CREATE',
      )
      await Promise.all(
        fields.map(async (m) => {
          const tableId = matchingIds.get(`table_${m.settings.table as string}`)
          migrationLogger.debug('creating field %s', m.settings.name, {
            name: m.settings.name,
            slug: m.settings.name,
            type: convertDBTypeToFieldType(datasource.client, m.settings.dbType),
            dbType: m.settings.dbType,
            settings: m.settings,
            tableId: matchingIds.get(`table_${m.settings.table as string}`),
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
              type: convertDBTypeToFieldType(datasource.client, m.settings.dbType),
              dbType: m.settings.dbType as DB_TYPE,
              settings: m.settings,
              tableId: matchingIds.get('table_' + (m.settings.table as string)),
            },
            {
              transaction: params?.transaction,
            },
          )
          matchingIds.set(
            'field_' + (m.settings.table as string) + '_' + (m.settings.name as string),
            field?.id,
          )
        }),
      )

      /**
       * Creating relations
       */
      const relations = migration.diffToApply.metamodel.filter(
        (m) => m.target === 'RELATION' && m.action === 'CREATE',
      )
      await Promise.all(
        relations.map(async (m) => {
          const fromTableId = matchingIds.get('table_' + (m.settings.fromTable as string))
          const toTableId = matchingIds.get('table_' + (m.settings.toTable as string))
          const fromFieldId = matchingIds.get(
            'field_' + (m.settings.fromTable as string) + '_' + (m.settings.fromField as string),
          )
          const toFieldId = matchingIds.get(
            'field_' + (m.settings.toTable as string) + '_' + (m.settings.toField as string),
          )
          if (!fromTableId || !toTableId || !fromFieldId || !toFieldId)
            throw new Error(
              `Sync error, missing table/field matching for relation between ${
                m.settings.fromTable as string
              } and ${m.settings.toTable as string}`,
            )

          migrationLogger.debug('creating relation %s', m.settings.name, {
            fromTableId,
            fromFieldId,
            toTableId,
            toFieldId,
            type: '1-n',
            settings: m.settings,
          })

          // const relation =
          await this.app.service(SERVICES.WORKSPACE_TABLE_RELATION).create(
            {
              fromTableId,
              fromFieldId,
              toTableId,
              toFieldId,
              type: '1-n',
              settings: m.settings,
            },
            {
              transaction: params?.transaction,
            },
          )
          // matchingIds.set('relation_' + m.settings.fromTable + ', relation.id)
        }),
      )
    }

    // throw new NotImplemented('apply migration is not yet implemented')
  }

  async revert() {
    throw new NotImplemented('revert migration is not yet implemented')
  }
}
