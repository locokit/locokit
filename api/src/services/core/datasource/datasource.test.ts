import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createApp } from '@/app'
import { SERVICES } from '@locokit/definitions'
import { builderTestEnvironment, SetupData } from '@/configure.test'
import { WorkspaceResult } from '@/services/core/workspace/workspace.schema'
import { DatasourceResult } from '@/services/core/datasource/datasource.schema'
import { Forbidden, MethodNotAllowed } from '@feathersjs/errors/lib'

describe('[core] datasource service', () => {
  const app = createApp()
  const builder = builderTestEnvironment('core-workspace')
  let setupData: SetupData
  const port = app.get('port') || 8998
  // const getUrl = (pathname: string) =>
  //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  //   new URL(`http://${app.get('host') || 'localhost'}:${port}${pathname}`).toString()

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
      const service = app.service(SERVICES.CORE_DATASOURCE)
      expect(service).toBeDefined()
    })
    it('allow user to retrieve datasource from a workspace id', async () => {
      expect.assertions(5)
      const workspaces = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $eager: 'datasources',
          name: 'Testing workspace datasource',
        },
      })
      expect(workspaces.total).toBe(1)
      expect(workspaces.data[0].datasources?.length).toBe(1)
      expect(workspaces.data[0].datasources?.[0].id).toBe(generalDatasource.id)

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

  describe('manage permissions / forbid methods', async () => {
    let forbidDatasource: DatasourceResult
    beforeAll(async () => {
      forbidDatasource = await app.service(SERVICES.WORKSPACE_DATASOURCE).create({
        name: 'Testing datasource forbids',
        client: 'pg',
        type: 'local',
        connection: '',
        workspaceId: workspace.id,
      })
    })

    it('forbid create', async () => {
      expect.assertions(1)
      await expect(
        app.service(SERVICES.CORE_DATASOURCE).create({
          name: 'Testing datasource general',
          client: 'pg',
          type: 'local',
          connection: '',
          workspaceId: workspace.id,
        }),
      ).rejects.toThrowError(MethodNotAllowed)
    })
    it('forbid update', async () => {
      expect.assertions(1)
      await expect(
        app.service(SERVICES.CORE_DATASOURCE).update(forbidDatasource.id, {
          name: 'Testing datasource general',
          client: 'pg',
          type: 'local',
          connection: '',
          workspaceId: workspace.id,
        }),
      ).rejects.toThrowError(MethodNotAllowed)
    })
    it('forbid patch', async () => {
      expect.assertions(1)
      await expect(
        app.service(SERVICES.CORE_DATASOURCE).patch(forbidDatasource.id, {
          name: 'Testing datasource general',
          client: 'pg',
          type: 'local',
          connection: '',
          workspaceId: workspace.id,
        }),
      ).rejects.toThrowError(MethodNotAllowed)
    })
    it('forbid remove', async () => {
      expect.assertions(1)
      await expect(
        app.service(SERVICES.CORE_DATASOURCE).remove(forbidDatasource.id),
      ).rejects.toThrowError(MethodNotAllowed)
    })

    it('forbid external calls for non ADMIN users', async () => {
      expect.assertions(1)
      await expect(
        app.service(SERVICES.CORE_DATASOURCE).get(forbidDatasource.id, {
          provider: 'external',
          authenticated: true,
          user: setupData.user1,
          authentication: setupData.user1Authentication,
        }),
      ).rejects.toThrowError(Forbidden)
    })

    it('forbid internal calls for non ADMIN users', async () => {
      expect.assertions(1)
      await expect(
        app.service(SERVICES.CORE_DATASOURCE).get(forbidDatasource.id, {
          authenticated: true,
          user: setupData.user1,
          authentication: setupData.user1Authentication,
        }),
      ).rejects.toThrowError(Forbidden)
    })

    it('allow internal calls for ADMIN users', async () => {
      expect.assertions(2)
      const datasource = await app.service(SERVICES.CORE_DATASOURCE).get(forbidDatasource.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
      expect(datasource).toBeDefined()
      expect(datasource.id).toBe(forbidDatasource.id)
    })

    afterAll(async () => {
      await app.service(SERVICES.WORKSPACE_DATASOURCE).remove(forbidDatasource.id)
    })
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
