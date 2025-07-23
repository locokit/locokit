import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { SERVICES } from '@locokit/definitions'
import { createApp } from '@/app'
import {
  builderTestEnvironment,
  SetupData,
  createEventDatasource,
  LocoKitEngineTestType,
} from '@/configure.test'
import { Application } from '@/declarations'
import { Server } from 'http'
import { WorkspacePolicyTableResult } from '../policy-table/policy-table.schema'
import { WorkspacePolicyResult } from '../policy/policy.schema'
import { WorkspacePolicyVariableResult } from '../policy-variable/policy-variable.schema'
import { WorkspaceGroupResult } from '../group/group.schema'
import { WorkspaceGroupPolicyVariableResult } from '../group-policy-variable/group-policy-variable.schema'

describe.only('table-record service', () => {
  let app: Application
  let server: Server
  let port: number
  let builder: ReturnType<typeof builderTestEnvironment>
  let setupData: SetupData
  let currentData: Record<string, LocoKitEngineTestType> = {}

  beforeAll(async function tableRecordBeforeAll() {
    setTimeout(() => console.log(new Date().toISOString()), 1000)
    app = createApp()
    builder = builderTestEnvironment('table-record', app)
    port = app.get('port') || 8998
    setupData = await builder.setupWorkspace()
    server = await app.listen(port)
    currentData = await createEventDatasource(setupData, app)
    console.log(currentData)
  }, 20000)

  afterAll(async () => {
    console.log('déjà fini ?')
    await builder.teardownWorkspace()
    await app.teardown(server)
  })

  it('registered the service', () => {
    const service = app.service(SERVICES.WORKSPACE_TABLE_RECORD)
    expect(service).toBeDefined()
  })

  describe.skip('respect basic goals', () => {
    it('allow internal calls to retrieve records of a table', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.WORKSPACE_TABLE_RECORD).find({
        route: {
          workspaceSlug: setupData.publicWorkspace.slug,
          datasourceSlug: currentData.datasource.slug,
          tableSlug: 'event',
        },
      })
      expect(result.total).toBe(1)
      expect(result.data.length).toBe(1)
    })
  })
  describe.skip('respect validation of remote models', () => {
    it.todo('fail on a patch if validation is not ok')
    it.todo('fail on a create if validation is not ok')
    it.todo('fail on a patch if validation is data is wrong ?')
  })

  describe('respect policies defined', () => {
    /**
     * Configure a workspace with tables + policies
     */
    const policyRefs = {
      policy: null as WorkspacePolicyResult | null,
      policyVariables: [] as WorkspacePolicyVariableResult[],
      policyTables: [] as WorkspacePolicyTableResult[],
      groups: [] as WorkspaceGroupResult[],
      groupPolicyVariables: [] as WorkspaceGroupPolicyVariableResult[],
    }
    beforeAll(async () => {
      // const tablePolicy
      policyRefs.policy = await app.service(SERVICES.WORKSPACE_POLICY).create(
        {
          name: 'Access policy n°1',
          documentation: 'For testing purpose',
          manager: false,
          public: false,
        },
        {
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        },
      )
      policyRefs.policyTables.push(
        await app.service(SERVICES.WORKSPACE_POLICY_TABLE).create(
          {
            policyId: policyRefs.policy!.id,
            documentation: 'Rules for table event',
            tableId: currentData.tables.event.id,
            read: {
              allow: true,
            },
            create: {
              allow: true,
            },
            patch: {
              allow: false,
            },
            remove: {
              allow: false,
            },
          },
          {
            route: {
              workspaceSlug: setupData.publicWorkspace.slug,
            },
          },
        ),
      )
    })
    it('forbid (404) user to retrieve records of a table he does not have access', async () => {
      expect.assertions(1)
      const request = app.service(SERVICES.WORKSPACE_TABLE_RECORD).find(
        {},
        {
          workspaceSlug: setupData.publicWorkspace.slug,
          datasourceSlug: currentData.datasource.slug,
          tableSlug: currentData.tables.event.slug,
        },
      )
      await expect(request).rejects.toThrowError(/Forbidden/)
    })
    it.todo(
      'forbid (404) user to retrieve records on a workspace he does not have access',
      async () => {
        expect.assertions(1)
        const request = app.service(SERVICES.WORKSPACE_TABLE_RECORD).find(
          {},
          {
            workspaceSlug: setupData.publicWorkspace.slug,
            datasourceSlug: currentData.datasource.slug,
            tableSlug: currentData.tables.event.slug,
          },
        )
        await expect(request).rejects.toThrowError(/Forbidden/)
      },
    )

    it.todo('use the right role to access dedicated schema for GET')
    it.todo('use the right role to access dedicated schema for POST')
    it.todo('use the right role to access dedicated schema for PUT')
    it.todo('use the right role to access dedicated schema for DELETE')
    it.todo('use the right role to access dedicated schema for find')
    it.todo('allow $join from user and security $join work together for a find')
    it.todo(
      'forbid access to the endpoint on a table if public access is granted for the workspace but not the table',
    )
    it.todo('filter relations authorized with permissions')
    it.todo('allow user to retrieve records of a table according its fields permissions')
    it.todo('allow user to retrieve records of a table according its filters permissions')
    it.todo('allow to create a new record if policy allow it')
    it.todo('forbid to create a new record if policy forbid it')
    it.todo('allow to patch a record if policy allow it')
    it.todo('forbid to patch a record if policy forbid it')
    it.todo('allow to update a record if policy allow it')
    it.todo('forbid to update a record if policy forbid it')
    it.todo('allow to delete a record if policy allow it')
    it.todo('forbid to delete a record if policy forbid it')
    it.todo('allow access to the endpoint if public access is granted for a specific table')
    it.todo('allow access to the endpoint if public access is granted for the workspace')
  })

  // Are missing :

  // tests on all related endpoints for synchronization
  // tests on record Create / Update / Delete using validators & resolvers
  // tests on record query through nested relations using validators

  it.todo(
    'allow to retrieve records from tables that could be named the same way than the locokit ones, to avoid conflicts in validators',
  )
  it.todo(
    'return a boolean (true/false) for boolean fields in a SQLite datasource (need to use resolver ?)',
  )
  it.todo('validate a creation with nullable fields')
  it.todo('validate a creation after a migration has been done correctly (model objection updates)')

  it.todo('accept to join on several relation')
  it.todo('restrict filters for relation fields')
  it.todo('forbid filters for unauthorized relations')
  it.todo('allow to retrieve one nested level of relation')
  it.todo('allow to retrieve two nested level of relation')
  it.todo('go faster when creating a new record (because validator already exist)')
  it.todo('test the regexp for filtering relations')

  it.todo('allow $fetch in a GET / .find request')
  it.todo('allow $join in a GET / .find request')
})
