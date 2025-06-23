import { createApp } from '@/app'
import {
  builderTestEnvironment,
  SetupData,
  LocoKitEngineTestType,
  createEventDatasource,
} from '@/configure.test'
import { DatasourceResult } from '@/services/core/datasource/datasource.schema'
import { SERVICES } from '@locokit/definitions'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('table service', () => {
  const app = createApp()
  const port = (app.get('port') as number) || 8998
  const builder = builderTestEnvironment('workspace-table', app)
  let setupData: SetupData
  let currentData: Record<string, LocoKitEngineTestType | DatasourceResult> = {}

  beforeAll(async () => {
    await app.listen(port)
    setupData = await builder.setupWorkspace()
    currentData = await createEventDatasource(setupData, app)
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
    await app.teardown()
  })

  it('registered the service', () => {
    const service = app.service(SERVICES.WORKSPACE_TABLE)
    expect(service).toBeDefined()
  })

  it('allow internal calls to create a new table', async () => {
    expect.assertions(2)
    const service = app.service(SERVICES.WORKSPACE_TABLE)
    const table = await service.create(
      {
        name: 'Table 1',
        documentation: 'Documentation of table 1',
        datasourceId: (currentData.datasource as DatasourceResult).id,
      },
      {
        route: {
          workspaceSlug: setupData.publicWorkspace.slug,
        },
      },
    )
    expect(table).toBeDefined()
    expect(table.slug).toBe('table_1')
  })
  it.todo('allow internal calls to patch a table')
  it.todo('allow internal calls to remove a table')
  it.todo('allow workspace creator or ADMIN users to create a table')
  it.todo('allow workspace creator or ADMIN users to patch a table')
  it.todo('allow workspace creator or ADMIN users to remove a table')
  it.todo('allow user to import a file and creating a table directly')
  it.todo('use the right role to access dedicated schema')
})
