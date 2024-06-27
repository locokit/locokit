import type { KnexAdapterParams } from '@feathersjs/knex'
import {
  MigrationDataInternal,
  MigrationResult,
  MigrationQuery,
  MigrationPatch,
  migrationDataInternalValidator,
  MigrationDiffInternal,
  MigrationApply,
  MigrationDataExternal,
} from './migration.schema'
import { ObjectionService } from '@/feathers-objection'
import { NotAcceptable, NotImplemented } from '@feathersjs/errors'

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

import { Application } from '@/declarations'
import { TableResult } from '../table/table.schema'
import { TableFieldResult } from '../table-field/table-field.schema'
import { type ConnexionSQL, createAdapter } from '@locokit/engine'
import { TableRelationResult } from '../table-relation/table-relation.schema'
import { computeDiff } from './helpers/computeDiff'

const migrationLogger = logger.child({ service: 'datasource' })

export interface MigrationParams extends KnexAdapterParams<MigrationQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class Migration extends ObjectionService<
  MigrationResult,
  MigrationDataExternal,
  MigrationParams,
  MigrationPatch
> {
  app!: Application

  setup(app: Application) {
    this.app = app
  }

  /**
   * Create a new migration between a datasource and a metamodel.
   *
   * Can be created from datasource to metamodel,
   * or from metamodel to datasource.
   *
   */
  async _create(data: MigrationDataInternal, params?: MigrationParams): Promise<MigrationResult>
  async _create(data: MigrationDataInternal[], params?: MigrationParams): Promise<MigrationResult[]>
  async _create(
    data: MigrationDataInternal | MigrationDataInternal[],
    params?: MigrationParams,
  ): Promise<MigrationResult | MigrationResult[]> {
    if (Array.isArray(data)) throw new NotImplemented('Creation of migration is not yet available.')

    /**
     * Compute the diff to apply
     */
    migrationLogger.info('creating a migration...')
    migrationLogger.debug('retrieving datasources metamodel and inspect remote schema')

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

    data.diffToApply = await computeDiff(data.direction, datasourceFromMetaModel)

    /**
     * Check that there is at least a migration to apply, else raise an Error
     */
    if (data.diffToApply.datasource.length === 0 && data.diffToApply.metamodel.length === 0) {
      throw new NotAcceptable('No diff found between datasource and metamodel.', data.diffToApply)
    }

    await migrationDataInternalValidator(data)

    return await super._create(data, params)
  }

  /**
   * This custom method will analyze diffs
   * between real schema and meta model stored in LocoKit
   *
   * This does NOT create a new migration.
   *
   * Only for information purpose.
   *
   * Real schema > Meta model
   */

  async diff(data: MigrationDiffInternal, params?: MigrationParams): Promise<Diff> {
    console.log(data, params)
    migrationLogger.info('Creating the diff...')

    migrationLogger.debug('retrieving datasources metamodel and inspect remote schema')

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

    return computeDiff('both', datasourceFromMetaModel)
  }

  /**
   * This custom method will analyze diffs
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */

  /**
   * This custom method will sync all updates
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  async apply(
    { id, datasourceId }: MigrationApply,
    params?: MigrationParams,
  ): Promise<MigrationResult> {
    /**
     * Retrieve the migration to apply and which schema
     */
    const migration = await this._get(id, params)

    if (migration.applied) throw new NotAcceptable('Migration already applied.')

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

        const relation = await this.app.service(SERVICES.WORKSPACE_TABLE_RELATION).create(
          {
            fromTableId,
            fromFieldId,
            toTableId,
            toFieldId,
            type: '1-n',
            settings,
            // name: `${settings.fromTable as string}.${settings.fromField as string} > ${
            //   settings.toTable as string
            // }.${settings.toField as string}`,
            name: settings.name,
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
