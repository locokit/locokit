import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { DiffItemRelation, FIELD_TYPE, SERVICES } from '@locokit/definitions'
import { createApp } from '@/app'
import { builderTestEnvironment, SetupData } from '@/configure.test'
import { WorkspaceResult } from '@/services/core/workspace/workspace.schema'
import { DatasourceResult } from '@/services/core/datasource/datasource.schema'
import { MigrationResult } from '../migration/migration.schema'
import { NotAcceptable } from '@feathersjs/errors'

describe('[workspace] datasource service', () => {
  const app = createApp()
  const builder = builderTestEnvironment('core-workspace')
  let setupData: SetupData
  const port = app.get('port') || 8998
  let workspace: WorkspaceResult

  beforeAll(async () => {
    setupData = await builder.setupWorkspace()
    await app.listen(port)

    workspace = await app.service(SERVICES.CORE_WORKSPACE).create({
      name: 'Testing workspace datasource',
      createdBy: setupData.user1.id,
    })
  })

  describe('general purpose', async () => {
    let generalDatasource: DatasourceResult
    beforeAll(async () => {
      generalDatasource = await app.service(SERVICES.WORKSPACE_DATASOURCE).create({
        name: 'Testing datasource general',
        client: 'pg',
        type: 'local',
        connection: '',
        workspaceId: workspace.id,
      })
    })

    it('registered the service', () => {
      const service = app.service(SERVICES.WORKSPACE_DATASOURCE)
      expect(service).toBeDefined()
    })
    it('allow user to retrieve datasource from a workspace id', async () => {
      expect.assertions(3)
      const workspaces = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $eager: 'datasources',
          name: 'Testing workspace datasource',
        },
      })
      expect(workspaces.total).toBe(1)
      expect(workspaces.data[0].datasources?.length).toBe(1)
      expect(workspaces.data[0].datasources?.[0].id).toBe(generalDatasource.id)
    })

    it('allow to retrieve datasource from a workspace id and endpoint datasource', async () => {
      expect.assertions(2)
      const datasources = await app.service(SERVICES.WORKSPACE_DATASOURCE).find({
        query: {
          workspaceId: workspace.id,
        },
      })
      expect(datasources.total).toBe(1)
      expect(datasources.data[0].id).toBe(generalDatasource.id)
    })

    it('allow to retrieve datasource from a workspace slug and endpoint datasource', async () => {
      expect.assertions(2)
      const datasources = await app.service(SERVICES.WORKSPACE_DATASOURCE).find({
        route: {
          workspaceSlug: 'testing_workspace_datasource',
        },
      })
      expect(datasources.total).toBe(1)
      expect(datasources.data[0].id).toBe(generalDatasource.id)
    })

    it('create a datasource in the dedicated schema but is also visible at the core datasource service', async () => {
      expect.assertions(2)
      const datasources = await app.service(SERVICES.CORE_DATASOURCE).find({
        query: {
          workspaceId: workspace.id,
        },
      })
      expect(datasources.total).toBe(1)
      expect(datasources.data[0].id).toBe(generalDatasource.id)
    })

    afterAll(async () => {
      await app.service(SERVICES.WORKSPACE_DATASOURCE).remove(generalDatasource.id)
    })
  })

  describe.todo('manage permission', () => {
    it.todo('forbid user to retrieve datasource of workspace they do not have access to')
    it.todo('allow user to patch datasource on workspace they manage')
    it.todo('does not return credentials when user is not admin / manager of the workspace')

    it.todo('forbid external calls for non ADMIN users')
    it.todo('forbid user to access datasource if he is not authorized to access this datasource')
    it.todo(
      'forbid user to access datasource if he is not authorized to access the related workspace',
    )
  })

  describe.todo('remote pg datasource', () => {
    it.todo('allow user to create a remote pg datasource')

    it.todo(
      'allow to sync the datasource model in locokit meta model (tables + fields + relations)',
    )
    it.todo(
      'allow to create a migration and apply it to sync datasource model in LocoKit meta model (tables + fields + relations)',
    )
    it.todo('allow to retrieve migrations')
  })
  describe.todo('remote sqlite datasource', () => {
    it.todo('allow user to create a remote sqlite datasource')
    it.todo(
      'allow to sync the datasource model in locokit meta model (tables + fields + relations)',
    )
    it.todo(
      'allow to create a migration and apply it to sync datasource model in LocoKit meta model (tables + fields + relations)',
    )
    it.todo('allow to retrieve migrations')
  })
  describe('local pg datasource', () => {
    let localPgDatasource: DatasourceResult
    let schemaName: string
    let migrationId: string
    let migration: MigrationResult

    beforeAll(async () => {
      // create a new datasource
      localPgDatasource = await app.service(SERVICES.WORKSPACE_DATASOURCE).create({
        workspaceId: workspace.id,
        name: 'Testing datasource general',
        client: 'pg',
        type: 'local',
        connection: '',
      })
      schemaName = `ds_${localPgDatasource.id as string}`

      // create a metamodel
      // create new table Event (name / date / place)
      const tableEvent = await app.service(SERVICES.WORKSPACE_TABLE).create({
        name: 'Event',
        documentation: 'Event table',
        datasourceId: localPgDatasource.id,
      })

      const fieldEventId = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Id',
        type: FIELD_TYPE.ID_NUMBER,
        tableId: tableEvent.id,
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fieldEventName = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Name',
        type: FIELD_TYPE.STRING,
        tableId: tableEvent.id,
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fieldEventDate = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Date',
        type: FIELD_TYPE.DATETIME,
        tableId: tableEvent.id,
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fieldEventPlace = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Place',
        type: FIELD_TYPE.GEOMETRY_POINT,
        tableId: tableEvent.id,
      })

      // create another table Person (name / age)
      const tablePerson = await app.service(SERVICES.WORKSPACE_TABLE).create({
        name: 'Person',
        documentation: 'Person table',
        datasourceId: localPgDatasource.id,
      })

      const fieldPersonId = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Id',
        type: FIELD_TYPE.ID_NUMBER,
        tableId: tablePerson.id,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fieldPersonName = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Name',
        type: FIELD_TYPE.STRING,
        tableId: tablePerson.id,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fieldPersonAge = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Age',
        type: FIELD_TYPE.NUMBER,
        tableId: tablePerson.id,
      })

      // create another table Registration
      const tableRegistration = await app.service(SERVICES.WORKSPACE_TABLE).create({
        name: 'Registration',
        documentation: 'Registration table',
        datasourceId: localPgDatasource.id,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fieldRegistrationId = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Id',
        type: FIELD_TYPE.ID_NUMBER,
        tableId: tableRegistration.id,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fieldRegistrationStatus = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Status',
        type: FIELD_TYPE.SINGLE_SELECT,
        tableId: tableRegistration.id,
        settings: {
          primary: false,
          unique: false,
          foreign: false,
          nullable: true,
          default: 'ACCEPTED',
          maxLength: null,
          values: [
            {
              value: 'ACCEPTED',
              class: 'bg-green-100 text-green-600',
              i18n: {
                FR_fr: 'Accepté',
                EN_en: 'Accepted',
              },
            },
            {
              value: 'WAITING_FOR_APPROVAL',
              class: 'bg-neutral-100 text-neutral-600',
              i18n: {
                FR_fr: 'En attente',
                EN_en: 'Waiting',
              },
            },
            {
              value: 'DECLINED',
              class: 'bg-red-100 text-red-600',
              i18n: {
                FR_fr: 'Décliné',
                EN_en: 'Declined',
              },
            },
          ],
        },
      })

      const fieldRegistrationCreatedBy = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'CreatedBy',
        type: FIELD_TYPE.ID_NUMBER,
        tableId: tableRegistration.id,
        settings: {
          primary: false,
          unique: false,
          foreign: true,
          nullable: false,
          default: null,
          maxLength: null,
        },
      })

      const fieldRegistrationEvent = await app.service(SERVICES.WORKSPACE_TABLE_FIELD).create({
        name: 'Event',
        type: FIELD_TYPE.ID_NUMBER,
        tableId: tableRegistration.id,
        settings: {
          primary: false,
          unique: false,
          foreign: true,
          nullable: false,
          default: null,
          maxLength: null,
        },
      })

      // create relations
      await app.service(SERVICES.WORKSPACE_TABLE_RELATION).create({
        name: 'created',
        fromTableId: tableRegistration.id,
        toTableId: tablePerson.id,
        fromFieldId: fieldRegistrationCreatedBy.id,
        toFieldId: fieldPersonId.id,
        type: '1-n',
        settings: {},
      })
      await app.service(SERVICES.WORKSPACE_TABLE_RELATION).create({
        name: 'for event',
        fromTableId: tableRegistration.id,
        toTableId: tableEvent.id,
        fromFieldId: fieldRegistrationEvent.id,
        toFieldId: fieldEventId.id,
        type: '1-n',
        settings: {},
      })
    })
    it('create a dedicated schema in database', async () => {
      // check if a dedicated schema has been created
      expect.assertions(1)
      const schemasBeforeDelete = await app
        .get('db')
        .raw('SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?;', [
          schemaName,
        ])
      expect(schemasBeforeDelete.rowCount).toBe(1)
    })
    it('can create a migration', async () => {
      expect.assertions(5)

      // create migration
      migration = await app.service(SERVICES.WORKSPACE_MIGRATION).create({
        datasourceId: localPgDatasource.id,
        name: 'First migration',
      })
      migrationId = migration.id

      // check the migration (table / fields / relations)
      expect(migration).toBeDefined()
      expect(migration.diffToApply.metamodel.length).toBe(0)
      expect(migration.diffToApply.datasource.filter((a) => a.target === 'TABLE').length).toBe(3)
      expect(migration.diffToApply.datasource.filter((a) => a.target === 'FIELD').length).toBe(11)
      expect(migration.diffToApply.datasource.filter((a) => a.target === 'RELATION').length).toBe(2)
    })

    it('explain precisely how relations need to be built', () => {
      expect.assertions(14)

      const relationsMigration = migration.diffToApply.datasource.filter(
        (a) => a.target === 'RELATION',
      ) as DiffItemRelation[]
      const firstRelation = relationsMigration[0]
      const secondRelation = relationsMigration[1]

      expect(firstRelation.settings.fromTable).toBe('registration')
      expect(firstRelation.settings.fromSchema).toBe(schemaName)
      expect(firstRelation.settings.fromField).toBe('created_by')
      expect(firstRelation.settings.toTable).toBe('person')
      expect(firstRelation.settings.toSchema).toBe(schemaName)
      expect(firstRelation.settings.toField).toBe('id')
      expect(firstRelation.settings.type).toBe('1-n')

      expect(secondRelation.settings.fromTable).toBe('registration')
      expect(secondRelation.settings.fromSchema).toBe(schemaName)
      expect(secondRelation.settings.fromField).toBe('event')
      expect(secondRelation.settings.toTable).toBe('event')
      expect(secondRelation.settings.toSchema).toBe(schemaName)
      expect(secondRelation.settings.toField).toBe('id')
      expect(secondRelation.settings.type).toBe('1-n')
    })

    it('can apply the migration to sync datasource model in LocoKit meta model (tables + fields + relations)', async () => {
      expect.assertions(5)

      // check the actual datasource schema is empty
      const actualTables = await app
        .get('db')
        .raw(
          "SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_type = 'BASE TABLE';",
          [schemaName],
        )
      expect(actualTables.rowCount).toBe(0)

      const actualFields = await app
        .get('db')
        .raw('SELECT * FROM information_schema.columns WHERE table_schema = ?;', [schemaName])
      expect(actualFields.rowCount).toBe(0)

      // apply the migration
      await app
        .service(SERVICES.WORKSPACE_MIGRATION)
        .apply({ id: migrationId, datasourceId: localPgDatasource.id })

      // check the dedicated datasource schema
      // we have to find 3 tables
      const injectedTables = await app
        .get('db')
        .raw(
          "SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_type = 'BASE TABLE';",
          [schemaName],
        )
      expect(injectedTables.rowCount).toBe(3)

      const injectedFields = await app
        .get('db')
        .raw('SELECT * FROM information_schema.columns WHERE table_schema = ?;', [schemaName])
      expect(injectedFields.rowCount).toBe(11)

      // 2 foreign keys between tables
      const injectedForeignKeys = await app.get('db').raw(
        `
          SELECT * FROM information_schema.table_constraints
          WHERE table_schema = ?
          AND constraint_type = 'FOREIGN KEY';
        `,
        [schemaName],
      )
      expect(injectedForeignKeys.rowCount).toBe(2)
    })
    it('raise an error if no diffToApply exist', async () => {
      expect.assertions(1)
      /**
       * Create a new migration, and raise an error as it should be empty
       */
      await expect(
        app.service(SERVICES.WORKSPACE_MIGRATION).create({
          datasourceId: localPgDatasource.id,
          name: 'After first migration',
        }),
      ).rejects.toThrowError(NotAcceptable)
    })
    it('can sync the datasource model in locokit meta model (tables + fields + relations)', async () => {
      expect.assertions(15)

      // add new fields / tables / relations in the datasource schema
      await app
        .get('db')
        .schema.withSchema(schemaName)
        .createTable('city', (table) => {
          table.uuid('id', { primaryKey: true }).defaultTo(app.get('db').raw('gen_random_uuid()'))
          table.string('name', 255).notNullable()
          table.string('state', 255).notNullable()
          table.unique(['name', 'state'])
          table.specificType('coordinates', 'public.geometry').notNullable()
        })
      await app
        .get('db')
        .schema.withSchema(schemaName)
        .table('person', (table) => {
          table.uuid('preferredCity')
          table
            .foreign('preferredCity', 'FK_person_city')
            .references('id')
            .inTable(`${schemaName}.city`)
          table.index('preferredCity', 'IDX_person_city')
        })

      // create migration
      const migration = await app.service(SERVICES.WORKSPACE_MIGRATION).create({
        datasourceId: localPgDatasource.id,
        name: 'Second migration',
      })
      migrationId = migration.id

      // check the migration (table / fields / relations)
      expect(migration).toBeDefined()
      expect(migration.diffToApply.datasource.length).toBe(0)
      expect(migration.diffToApply.metamodel.length).toBe(7)
      expect(migration.diffToApply.metamodel.filter((a) => a.target === 'TABLE').length).toBe(1)
      const fieldsMetaModel = migration.diffToApply.metamodel.filter((a) => a.target === 'FIELD')
      expect(fieldsMetaModel.length).toBe(5)
      const relationsMetaModel = migration.diffToApply.metamodel.filter(
        (a) => a.target === 'RELATION',
      )
      expect(relationsMetaModel.length).toBe(1)

      // apply migration
      await app.service(SERVICES.WORKSPACE_MIGRATION).apply({
        id: migrationId,
        datasourceId: localPgDatasource.id,
      })

      // check the metamodel synchronization
      // we normally will have 4 tables
      const datasource = await app
        .service(SERVICES.WORKSPACE_DATASOURCE)
        .get(localPgDatasource.id, {
          query: {
            $eager: 'tables.[fields, relations]',
          },
        })
      expect(datasource.tables?.length).toBe(4)
      expect(datasource.tables?.[0].fields?.length).toBe(4)
      expect(datasource.tables?.[1].fields?.length).toBe(4)
      expect(datasource.tables?.[2].fields?.length).toBe(4)
      expect(datasource.tables?.[3].fields?.length).toBe(4)

      expect(datasource.tables?.[0].relations?.length).toBe(0)
      expect(datasource.tables?.[1].relations?.length).toBe(1)
      expect(datasource.tables?.[2].relations?.length).toBe(2)
      expect(datasource.tables?.[3].relations?.length).toBe(0)
    })
    it('can retrieve migrations', async () => {
      expect.assertions(4)

      const migrations = await app.service(SERVICES.WORKSPACE_MIGRATION).find({
        query: {
          datasourceId: localPgDatasource.id,
        },
      })
      expect(migrations).toBeDefined()
      expect(migrations.data.length).toBe(2)
      expect(migrations.data[0].applied).toBeDefined()
      expect(migrations.data[1].applied).toBeDefined()
    })
    it.todo('prevent to sync at the same time the meta model ? (type of transaction ?)')

    it.todo('add a table when a new one appear in the datasource')
    it.todo('add a field when a new one appear in the datasource')
    it.todo('add a relation when a new one appear in the datasource')
    it.todo('update a table when it is updated in the datasource')
    it.todo('update a field when it is updated in the datasource')
    it.todo('update a relation when it is updated in the datasource')
    it.todo('remove a table when it is removed in the datasource')
    it.todo('remove a field when it is removed in the datasource')
    it.todo('remove a relation when it is removed in the datasource')

    it.todo('add a table when a new one appear in the metamodel')
    it.todo('add a field when a new one appear in the metamodel')
    it.todo('add a relation when a new one appear in the metamodel')
    it.todo('update a table when it is updated in the metamodel')
    it.todo('update a field when it is updated in the metamodel')
    it.todo('update a relation when it is updated in the metamodel')
    it.todo('remove a table when it is removed in the metamodel')
    it.todo('remove a field when it is removed in the metamodel')
    it.todo('remove a relation when it is removed in the metamodel')

    it.todo('create a relation named correctly')
    it.todo(
      'create a relation named correctly if there are several relations to the same destination table',
    )
    // afterAll(async () => {
    //   await app.service(SERVICES.CORE_DATASOURCE).remove(localPgDatasource.id)
    // })
  })
  describe.todo('remove with a soft-delete ?', () => {
    it.todo('should remove all tables / fields / ... related ressources')
    it.todo('should remove dedicated schema if this is a local pg datasource')
  })

  afterAll(async () => {
    await app.service(SERVICES.CORE_WORKSPACE).patch(workspace.id, {
      softDeletedAt: new Date().toISOString(),
    })
    await app.service(SERVICES.CORE_WORKSPACE).remove(workspace.id, {
      authenticated: true,
      user: setupData.userAdmin,
      authentication: setupData.userAdminAuthentication,
    })

    await builder.teardownWorkspace()
    await app.teardown()
  })
})
