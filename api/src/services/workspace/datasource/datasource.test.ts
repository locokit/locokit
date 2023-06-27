import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { SERVICES } from '@locokit/definitions'
import { createApp } from '@/app'
import { builderTestEnvironment, SetupData } from '@/configure.test'
import { WorkspaceResult } from '@/services/core/workspace/core-workspace.schema'
import { CoreDatasourceResult } from '@/services/core/datasource/core-datasource.schema'

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
    let generalDatasource: CoreDatasourceResult
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
    let localPgDatasource: CoreDatasourceResult
    let schemaName: string

    beforeAll(async () => {
      // create a new datasource
      localPgDatasource = await app.service(SERVICES.WORKSPACE_DATASOURCE).create({
        workspaceId: workspace.id,
        name: 'Testing datasource general',
        client: 'pg',
        type: 'local',
        connection: '',
      })
      schemaName = 'ds_' + localPgDatasource.id
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
    it('can create a migration and apply it to sync datasource model in LocoKit meta model (tables + fields + relations)', async () => {
      // create a metamodel
      // create new table Event (name / date / place)
      console.log(localPgDatasource)
      const tableEvent = await app.service(SERVICES.WORKSPACE_TABLE).create({
        name: 'Event',
        documentation: 'Event table',
        datasourceId: localPgDatasource.id,
      })

      // create another table Person (name / age)
      const tablePerson = await app.service(SERVICES.WORKSPACE_TABLE).create({
        name: 'Person',
        documentation: 'Person table',
        datasourceId: localPgDatasource.id,
      })
      // create another table Registration
      const tableRegistration = await app.service(SERVICES.WORKSPACE_TABLE).create({
        name: 'Registration',
        documentation: 'Registration table',
        datasourceId: localPgDatasource.id,
      })

      // create relations
      // create migration
      // check the migration (table / fields / relations)
      // apply the migration
      // check the dedicated datasource schema
    })
    it.todo(
      'can sync the datasource model in locokit meta model (tables + fields + relations)',
      async () => {
        // create new fields in datasource dedicated schema
        // create migration
        // check the new fields
        // apply migration
        // check the metamodel synchronization
      },
    )
    it.todo('can retrieve migrations', async () => {})
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
