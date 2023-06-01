import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  // afterEach,
  // beforeEach,
} from 'vitest'
import { createApp } from '@/app'
import { SERVICES } from '@locokit/definitions'
import { builderTestEnvironment, SetupData } from '@/configure.test'
import { WorkspaceResult } from '../workspace/core-workspace.schema'
import { CoreDatasourceResult } from '@/services/core/datasource/core-datasource.schema'
// import axios, { AxiosError, AxiosResponse } from 'axios'
// import { WorkspaceResult } from './core-workspace.schema'
// import { Paginated } from '@feathersjs/feathers'
// import { BadRequest, Forbidden } from '@feathersjs/errors/lib'
// import path from 'path'
// import fs from 'fs'

describe('datasource service', () => {
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
    let generalDatasource: CoreDatasourceResult
    beforeAll(async () => {
      generalDatasource = await app.service(SERVICES.CORE_DATASOURCE).create({
        workspaceId: workspace.id,
        name: 'Testing datasource general',
        client: 'pg',
        type: 'local',
        connection: '',
      })
    })
    it('registered the service', () => {
      const service = app.service(SERVICES.CORE_DATASOURCE)
      expect(service).toBeDefined()
    })
    it('allow user to retrieve datasource from a workspace id', async () => {
      expect.assertions(5)
      const datasources1 = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $eager: 'datasources',
        },
      })
      expect(datasources1.total).toBe(1)
      expect(datasources1.data[0].datasources?.length).toBe(1)
      expect(datasources1.data[0].datasources?.[0].id).toBe(generalDatasource.id)
      const datasources2 = await app.service(SERVICES.CORE_DATASOURCE).find({
        query: {
          workspaceId: workspace.id,
        },
      })
      expect(datasources2.total).toBe(1)
      expect(datasources2.data[0].id).toBe(generalDatasource.id)
    })
    afterAll(async () => {
      await app.service(SERVICES.CORE_DATASOURCE).remove(generalDatasource.id)
    })
  })

  describe.todo('manage permission', () => {
    it.todo('forbid user to retrieve datasource of workspace they do not have access to')
    it.todo('allow user to patch datasource on workspace they manage')
    it.todo('does not return credentials when user is not admin / manager of the workspace')
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
  describe.todo('local pg datasource', () => {
    it.todo('create a dedicated schema in database', async () => {})
    it.todo(
      'can create a migration and apply it to sync datasource model in LocoKit meta model (tables + fields + relations)',
      async () => {},
    )
    it.todo(
      'can sync the datasource model in locokit meta model (tables + fields + relations)',
      async () => {},
    )
    it.todo('can retrieve migrations', async () => {})
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
