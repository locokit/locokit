import { createApp } from '@/app'
import { SERVICES } from '@locokit/definitions'
import { expect, describe, it, beforeAll, afterAll, afterEach, beforeEach } from 'vitest'
import { builderTestEnvironment, SetupData } from '@/configure.test'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { WorkspaceResult } from './workspace.schema'
import { Id, Paginated } from '@feathersjs/feathers'
import { BadRequest, Forbidden } from '@feathersjs/errors/lib'
import path from 'path'
import fs from 'fs'

describe('[core] workspace service', () => {
  const app = createApp()
  const builder = builderTestEnvironment('core-workspace')
  let setupData: SetupData
  const port = app.get('port') || 8998
  const getUrl = (pathname: string) =>
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    new URL(`http://${app.get('host') || 'localhost'}:${port}${pathname}`).toString()

  beforeAll(async () => {
    setupData = await builder.setupWorkspace()
    await app.listen(port)
  })

  describe('general purpose', async () => {
    it('registered the service', () => {
      const service = app.service(SERVICES.CORE_WORKSPACE)
      expect(service).toBeDefined()
    })

    it('can create a workspace through internal calls', async () => {
      expect.assertions(3)
      const workspace = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'core-workspace public',
        documentation: 'Public workspace',
        public: true,
        createdBy: setupData.user1.id,
      })

      expect(workspace).toBeDefined()
      expect(workspace.public).toBe(true)
      expect(workspace.name).toBe('core-workspace public')

      await app.service(SERVICES.CORE_WORKSPACE).patch(workspace.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(workspace.id, {
        user: setupData.userAdmin,
        authenticated: true,
        authentication: setupData.userAdminAuthentication,
      })
    })

    it('returns the public workspace when making a find request of internal calls', async () => {
      expect.assertions(3)
      const publicWorkspaces = await app.service(SERVICES.CORE_WORKSPACE).find()

      expect(publicWorkspaces.total).toBe(1)
      expect(publicWorkspaces.data[0]).toBeDefined()
      expect(publicWorkspaces.data[0].name).toContain('Public workspace')
    })

    it('returns the public workspace when making a find request for unauthenticated users', async () => {
      expect.assertions(3)
      const response = (await axios.get(getUrl(SERVICES.CORE_WORKSPACE))) as AxiosResponse<
        Paginated<WorkspaceResult>
      >

      expect(response.data.total).toBe(1)
      expect(response.data.data[0]).toBeDefined()
      expect(response.data.data[0].name).toContain('Public workspace')
    })
  })

  describe('for unauthenticated users', () => {
    it("can't create a workspace for unauthenticated users", async () => {
      expect.assertions(1)
      await expect(
        axios.post(getUrl(SERVICES.CORE_WORKSPACE), {
          name: 'core-workspace public unauthenticated',
          documentation: 'unauthenticated workspace',
          public: false,
        }),
      ).rejects.toThrowError(/401/)
    })
    it("can't patch a workspace for unauthenticated users", async () => {
      expect.assertions(1)
      await expect(
        axios.patch(getUrl(SERVICES.CORE_WORKSPACE) + '/' + setupData.publicWorkspaceId, {
          name: 'core-workspace public unauthenticated',
          documentation: 'unauthenticated workspace',
          public: false,
        }),
      ).rejects.toThrowError(/401/)
    })
    it("can't update a workspace for unauthenticated users (405)", async () => {
      expect.assertions(1)
      await expect(
        axios.put(getUrl(SERVICES.CORE_WORKSPACE) + '/' + setupData.publicWorkspaceId, {
          name: 'core-workspace public unauthenticated',
          documentation: 'unauthenticated workspace',
          public: false,
        }),
      ).rejects.toThrowError(/405/)
    })
    it("can't remove a workspace for unauthenticated users", async () => {
      expect.assertions(1)
      await expect(
        axios.delete(getUrl(SERVICES.CORE_WORKSPACE) + '/' + setupData.publicWorkspaceId),
      ).rejects.toThrowError(/401/)
    })
  })

  describe.todo('for createdBy field', () => {
    it.todo('allow creation of workspace with createdBy when internal call', async () => {})
    it.todo('forbid creation of workspace with createdBy when external call', async () => {})
  })

  describe('create dedicated schema', () => {
    let ws: WorkspaceResult
    let schemaName: string
    beforeEach(async () => {
      ws = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: '[core-workspace] WS 1',
        documentation: 'Core workspace for testing creation of a dedicated SQL workspace',
        public: false,
        createdBy: setupData.user1.id,
      })
      schemaName = 'w_' + ws.slug
    })
    it('create a dedicated schema for new workspaces', async () => {
      expect.assertions(9)

      /**
       * check in the database if the tables exists
       */
      const hasTableDataset = await app.get('db').schema.withSchema(schemaName).hasTable('dataset')
      expect(hasTableDataset).toBe(true)

      const hasTableDatasetField = await app
        .get('db')
        .schema.withSchema(schemaName)
        .hasTable('datasetField')
      expect(hasTableDatasetField).toBe(true)

      const hasTableDatasource = await app
        .get('db')
        .schema.withSchema(schemaName)
        .hasTable('datasource')
      expect(hasTableDatasource).toBe(true)

      const hasTableGroup = await app.get('db').schema.withSchema(schemaName).hasTable('group')
      expect(hasTableGroup).toBe(true)

      const hasTablePolicy = await app.get('db').schema.withSchema(schemaName).hasTable('policy')
      expect(hasTablePolicy).toBe(true)

      const hasTableTable = await app.get('db').schema.withSchema(schemaName).hasTable('table')
      expect(hasTableTable).toBe(true)

      const hasTableTableField = await app
        .get('db')
        .schema.withSchema(schemaName)
        .hasTable('tableField')
      expect(hasTableTableField).toBe(true)

      const hasTableTableRelation = await app
        .get('db')
        .schema.withSchema(schemaName)
        .hasTable('tableRelation')
      expect(hasTableTableRelation).toBe(true)

      const hasTableUserGroup = await app
        .get('db')
        .schema.withSchema(schemaName)
        .hasTable('userGroup')
      expect(hasTableUserGroup).toBe(true)

      await app.service(SERVICES.CORE_WORKSPACE).patch(ws.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(ws.id, {
        user: setupData.userAdmin,
        authenticated: true,
        authentication: setupData.userAdminAuthentication,
      })
    })

    it('remove the dedicated schema when removing a workspace', async () => {
      expect.assertions(2)
      const schemasBeforeDelete = await app
        .get('db')
        .raw('SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?;', [
          schemaName,
        ])
      expect(schemasBeforeDelete.rowCount).toBe(1)

      await app.service(SERVICES.CORE_WORKSPACE).patch(ws.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(ws.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })

      const schemasAfterRemove = await app
        .get('db')
        .raw('SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?;', [
          schemaName,
        ])
      expect(schemasAfterRemove.rowCount).toBe(0)
    })
    it.todo('remove the related groups when removing a workspace')
    it.todo('remove the related roles when removing a workspace')
    it.todo('remove the related datasources when removing a workspace')
  })

  describe('with soft-deleted', () => {
    let resWorkspace: WorkspaceResult
    let alreadyRemoved = false
    let schemaName: string

    /**
     * First, we create a lambda workspace
     */
    beforeEach(async () => {
      resWorkspace = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'for removal purpose',
        documentation: 'Core workspace for testing forbid workspace removal for non admin users',
        public: false,
        createdBy: setupData.user1.id,
      })
      alreadyRemoved = false
      schemaName = 'w_' + resWorkspace.slug
    })

    it('mark as "soft-deleted" a workspace when owner try to remove it withtout being an admin user', async () => {
      expect.assertions(3)
      expect(resWorkspace.softDeletedAt).toBeNull()

      /**
       * Make a first deletion
       */
      await axios.delete(getUrl(SERVICES.CORE_WORKSPACE) + '/' + resWorkspace.id, {
        headers: {
          Authorization: 'Bearer ' + (setupData.user1Authentication.accessToken as string),
        },
      })

      const workspace = await app.service(SERVICES.CORE_WORKSPACE).get(resWorkspace.id)

      /**
       * The workspace is still there
       */
      expect(workspace.softDeletedAt).not.toBeNull()

      /**
       * The dedicated schema too
       */
      const hasTableDataset = await app.get('db').schema.withSchema(schemaName).hasTable('dataset')
      expect(hasTableDataset).toBe(true)
    })

    it.todo('send an email to the owner when the softDeletedAt is set', async () => {
      // create a workspace
      // remove it
      // check an email has been sent for the owner (soft-deleted)
      // check an email has been sent for the admin (soft-deleted)
      // remove it definitively
      // check another email has been sent for the owner (defintively deleted)
      // check another email has been sent for the admin (defintively deleted)
    })

    it('throw error when removing the workspace (not already soft-deleted) for admin user', async () => {
      expect.assertions(2)
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
          authenticated: true,
          user: setupData.userAdmin,
          authentication: setupData.userAdminAuthentication,
        }),
      ).rejects.toThrow(Forbidden)
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
          authenticated: true,
          user: setupData.userAdmin,
          authentication: setupData.userAdminAuthentication,
        }),
      ).rejects.toThrowError(/Only the owner of the workspace can remove it/)
    })
    it('set softDeletedAt for admin user if the user is the owner of the workspace', async () => {
      expect.assertions(1)
      // update the workspace by setting the owner to our admin user
      await app
        .get('db')
        .raw('UPDATE core.lck_workspace SET "createdBy" = ? WHERE id = ?', [
          setupData.userAdmin.id,
          resWorkspace.id,
        ])

      const resWsRemoved = await app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
      expect(resWsRemoved.softDeletedAt).not.toBeNull()
    })

    it('forbid workspace removal for users neither admin nor owner', async () => {
      expect.assertions(2)

      // try to remove it with another user
      // expect fail
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
          user: setupData.user2,
          authenticated: true,
          authentication: setupData.user2Authentication,
        }),
      ).rejects.toThrow(Forbidden)

      await expect(
        app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
          user: setupData.user2,
          authenticated: true,
          authentication: setupData.user2Authentication,
        }),
      ).rejects.toThrowError(
        /You're not authorized to remove the workspace "for removal purpose": you're neither an admin or the workspace's owner./,
      )
    })

    it('forbid workspace removal for owner when workspace is already "soft-deleted"', async () => {
      expect.assertions(2)

      // first removal, we have a softDeletedAt
      const wsFirstRemoval = await app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
        user: setupData.user1,
        authenticated: true,
        authentication: setupData.user1Authentication,
      })
      expect(wsFirstRemoval.softDeletedAt).not.toBeNull()

      // second removal, we have an error
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
          user: setupData.user1,
          authenticated: true,
          authentication: setupData.user1Authentication,
        }),
      ).rejects.toThrowError(/Workspace is already soft-deleted./)
    })

    it('returns only workspace not "soft-deleted"', async () => {
      expect.assertions(2)
      // find workspaces, expect 2
      const workspaces = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $limit: 0,
        },
      })
      expect(workspaces.total).toBe(2)

      // remove workspace as owner (so soft-deleted)
      await app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
        authenticated: true,
        user: setupData.user1,
        authentication: setupData.user1Authentication,
      })
      // find again, expect one less
      const workspacesAfter = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $limit: 0,
        },
      })
      expect(workspacesAfter.total).toBe(1)
    })

    it('returns workspace "soft-deleted" if asked by the workspace owner', async () => {
      // remove workspace as owner (so soft-deleted)
      // find workspaces with workspace owner, expect to not find the soft-deleted one
      // find workspaces with soft-deleted set to != null and workspace owner,
      // expect to find it
      expect.assertions(3)
      // find workspaces, expect 2 (I think)
      const workspaces = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $limit: 0,
        },
      })
      expect(workspaces.total).toBe(2)

      // remove workspace as owner (so soft-deleted)
      await app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
        authenticated: true,
        user: setupData.user1,
        authentication: setupData.user1Authentication,
      })
      // find again, expect the same
      const workspacesAfter = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          softDeletedAt: {
            $ne: null,
          },
        },
      })
      expect(workspacesAfter.total).toBe(1)
      expect(workspacesAfter.data[0].id).toBe(resWorkspace.id)
    })

    // need permissions implemented before doing this test
    it.todo(
      'does not return workspace "soft-deleted" even if asked for non workspace owner',
      async () => {
        // create a workspace
        // find workspaces with non workspace owner, expect to find all
        // remove workspace as owner (so soft-deleted)
        // find workspaces with soft-deleted set to != null and non workpspace owner,
        // expect to not find it
        // remove it with admin user
      },
    )

    it('allow patch softDeletedAt for admin', async () => {
      expect.assertions(1)
      const dataISOString = new Date().toISOString()
      const resPatched = await app.service(SERVICES.CORE_WORKSPACE).patch(
        resWorkspace.id,
        {
          softDeletedAt: dataISOString,
        },
        {
          authenticated: true,
          user: setupData.userAdmin,
          authentication: setupData.userAdminAuthentication,
        },
      )
      expect(resPatched.softDeletedAt?.toISOString()).toBe(dataISOString)
    })
    it('forbid patch softDeletedAt for owner', async () => {
      expect.assertions(1)
      const dataISOString = new Date().toISOString()
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).patch(
          resWorkspace.id,
          {
            softDeletedAt: dataISOString,
          },
          {
            authenticated: true,
            user: setupData.user1,
            authentication: setupData.user1Authentication,
          },
        ),
      ).rejects.toThrow(BadRequest)
    })
    it('forbid patch softDeletedAt for other users', async () => {
      expect.assertions(1)
      const dataISOString = new Date().toISOString()
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).patch(
          resWorkspace.id,
          {
            softDeletedAt: dataISOString,
          },
          {
            authenticated: true,
            user: setupData.user2,
            authentication: setupData.user2Authentication,
          },
        ),
      ).rejects.toThrow(BadRequest)
    })

    afterEach(async () => {
      // check the workspace still exist before removing it
      if (alreadyRemoved) return

      // remove it with admin user
      await app.service(SERVICES.CORE_WORKSPACE).patch(resWorkspace.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(resWorkspace.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
    })
  })

  // don't know if we need to implement this usecase
  // need to be checked with permissions implementation
  describe.todo('for authenticated users', () => {
    it.todo(
      'returns only workspace available for a user (owner or not) when using the $forCurrentUser option',
      () => {},
    )

    it.todo(
      'returns all workspaces of the current logged user AND public workspaces he is not member when not using the $forCurrentUser option',
      () => {},
    )
  })

  describe('for filtering,', () => {
    let privateWorkspace: WorkspaceResult
    let privateWorkspace2: WorkspaceResult

    beforeEach(async function createPrivateWorkspace() {
      privateWorkspace = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'private repo for filtering',
        documentation: 'Core workspace for testing filtering public workspace',
        public: false,
        createdBy: setupData.user1.id,
      })
      privateWorkspace2 = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'private repo 2 for filtering',
        documentation: 'Core workspace 2 for testing filtering public workspace',
        public: false,
        createdBy: setupData.user2.id,
      })
    })

    it("allows to filter on the owner's username and public workspaces for unauthenticated users with $joinEager", async () => {
      expect.assertions(2)

      // first check the number of workspaces
      const result = await axios.get<Paginated<WorkspaceResult>>(getUrl(SERVICES.CORE_WORKSPACE))
      expect(result.data.total).toBe(1)

      const resultFilter = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $joinEager: 'owner',
          'owner.username': setupData.user1.username,
        },
        authenticated: false,
        authentication: {
          strategy: 'public',
        },
        provider: 'external',
      })
      expect(resultFilter.total).toBe(1)
    })
    it("allows to filter on the owner's username and public workspaces for unauthenticated users with $joinRelated", async () => {
      expect.assertions(2)

      // first check the number of workspaces
      const result = await axios.get<Paginated<WorkspaceResult>>(getUrl(SERVICES.CORE_WORKSPACE))
      expect(result.data.total).toBe(1)

      const resultFilter = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $joinRelated: 'owner',
          'owner.username': setupData.user1.username,
        },
        authenticated: false,
        authentication: {
          strategy: 'public',
        },
        provider: 'external',
      })
      expect(resultFilter.total).toBe(1)
    })

    // need to be redone with permissions
    // by adding filter for the current user connected
    // and filtering workspaces the current user is a member
    it.todo(
      "allows to filter on the owner's name for authenticated users and returns all workspaces available for this user",
      async () => {},
    )
    it('forbids to filter on another owner property for authenticated users and returns an error', async () => {
      expect.assertions(1)

      await expect(
        app.service(SERVICES.CORE_WORKSPACE).find({
          query: {
            // @ts-expect-error
            'owner.firstName': 'trying',
          },
        }),
      ).rejects.toThrow(BadRequest)
    })
    it('forbids to filter on another owner property for unauthenticated users and returns an error', async () => {
      expect.assertions(1)

      await expect(
        app.service(SERVICES.CORE_WORKSPACE).find({
          query: {
            // @ts-expect-error
            'owner.firstName': 'trying',
          },
          authenticated: false,
          authentication: {
            strategy: 'public',
          },
          provider: 'external',
        }),
      ).rejects.toThrow(BadRequest)
    })

    it('filter workspace with owner.username and a workspace field with $joinEager for authenticated users', async () => {
      expect.assertions(2)

      const allWs = await app.service(SERVICES.CORE_WORKSPACE).find({
        authenticated: true,
        user: setupData.user1,
        authentication: setupData.user1Authentication,
      })
      expect(allWs.total).toBe(3)

      const result = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          $joinEager: 'owner',
          'owner.username': setupData.user1.username,
        },
        authenticated: true,
        user: setupData.user1,
        authentication: setupData.user1Authentication,
      })
      expect(result.total).toBe(2)
    })
    it('do not show for unauthenticated users the public soft-deleted workspaces', async () => {
      expect.assertions(3)
      // set the private workspace as public one
      await app.service(SERVICES.CORE_WORKSPACE).patch(privateWorkspace.id, {
        public: true,
      })

      // check we see 2 workspaces in public
      const result = await axios.get<Paginated<WorkspaceResult>>(getUrl(SERVICES.CORE_WORKSPACE))
      expect(result.data.total).toBe(2)

      // soft-delete the private workspace
      await app.service(SERVICES.CORE_WORKSPACE).remove(privateWorkspace.id, {
        authenticated: true,
        user: setupData.user1,
        authentication: setupData.user1Authentication,
      })

      // check public user see only 1 workspace now
      // and not more the privateWorkspace one
      const resultAfterRemove = await axios.get<Paginated<WorkspaceResult>>(
        getUrl(SERVICES.CORE_WORKSPACE),
      )
      expect(resultAfterRemove.data.total).toBe(1)
      expect(resultAfterRemove.data.data[0].id).toBe(setupData.publicWorkspaceId)
    })
    it.todo('do not show for authenticated users the soft-deleted workspaces they do not own')
    it('throw error for unauthenticated users if a soft-deleted filter is wished', async () => {
      expect.assertions(4)
      try {
        await axios.get(getUrl(SERVICES.CORE_WORKSPACE) + '?softDeletedAt[$ne]=')
      } catch (e) {
        const { response } = e as AxiosError<any>
        expect(response?.status).toBe(400)
        expect(response?.data?.name).toBe('BadRequest')
        expect(response?.data?.code).toBe(400)
        expect(response?.data?.data.softDeletedAt).toBeDefined()
      }
    })

    afterEach(async () => {
      // remove it with admin user
      await app.service(SERVICES.CORE_WORKSPACE).patch(privateWorkspace.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(privateWorkspace.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
      await app.service(SERVICES.CORE_WORKSPACE).patch(privateWorkspace2.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(privateWorkspace2.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
    })
  })

  describe('manage failures...', () => {
    it('do not create the workspace if an error occured when the dedicated schema have been created (transaction)', async () => {
      expect.assertions(3)

      // setup
      // mock the createWorkspaceSchema db function
      const mockCreateWorkspaceSchemaFunction = `
CREATE OR REPLACE FUNCTION "core"."createWorkspaceSchema" (IN "workspace_id" uuid)
RETURNS void
LANGUAGE 'plpgsql'
VOLATILE
PARALLEL UNSAFE
COST 100

AS $BODY$

BEGIN

RAISE EXCEPTION 'Mock creation of workspace for testing purpose : abort ! abort !';

END
$BODY$;
`
      await app.get('db').schema.withSchema('core').raw(mockCreateWorkspaceSchemaFunction)

      // creation should fail
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).create({
          name: 'ws failing for schema creation',
          createdBy: setupData.user2.id,
          documentation: 'documentation',
        }),
      ).rejects.toThrow()

      // no workspace should be created in db
      const wsResult = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          name: 'ws failing for schema creation',
        },
      })
      expect(wsResult.total).toBe(0)

      // no dedicated schema should exist
      const result = await app
        .get('db')
        .raw('SELECT * FROM pg_catalog.pg_namespace WHERE nspname ILIKE ?', 'failing')
      expect(result.rowCount).toBe(0)

      // teardown
      // restore the createWorkspaceSchema db function
      const createWorkspaceSchemaCode = fs.readFileSync(
        path.join(__dirname, '../../../../migrations/functions/createWorkspaceSchema.sql'),
        'utf-8',
      )
      await app.get('db').schema.withSchema('core').raw(createWorkspaceSchemaCode)
    })

    it('do not delete the workspace if an error occured when removing its dedicated schema (transaction)', async () => {
      expect.assertions(3)

      // setup
      // mock the createWorkspaceSchema db function
      const mockDropWorkspaceSchemaFunction = `
CREATE OR REPLACE FUNCTION core."dropWorkspaceSchema"(IN "workspace_slug" text)
 RETURNS void
 LANGUAGE plpgsql
AS $BODY$

BEGIN

  RAISE EXCEPTION 'Mock droping of workspace for testing purpose : abort ! abort !';

END
$BODY$;
`
      await app.get('db').schema.withSchema('core').raw(mockDropWorkspaceSchemaFunction)

      const workspace: WorkspaceResult = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'for removal purpose',
        documentation: 'Core workspace for testing forbid workspace removal for non admin users',
        public: false,
        createdBy: setupData.user1.id,
      })
      const workspaceSlug = 'w_' + (workspace.slug as string)

      // patch to soft delete
      await app.service(SERVICES.CORE_WORKSPACE).patch(workspace.id, {
        softDeletedAt: new Date().toISOString(),
      })

      // remove should fail
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).remove(workspace.id, {
          authenticated: true,
          user: setupData.userAdmin,
          authentication: setupData.userAdminAuthentication,
        }),
      ).rejects.toThrow()

      // no workspace should be droped in db
      const wsResult = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          name: 'for removal purpose',
          softDeletedAt: {
            $ne: null,
          },
        },
      })
      expect(wsResult.total).toBe(1)

      // dedicated schema should exist
      const result = await app
        .get('db')
        .raw('SELECT * FROM pg_catalog.pg_namespace WHERE nspname ILIKE ?', workspaceSlug)
      expect(result.rowCount).toBe(1)

      // teardown
      // restore the dropWorkspaceSchema db function
      const dropWorkspaceSchemaCode = fs.readFileSync(
        path.join(__dirname, '../../../../migrations/functions/dropWorkspaceSchema.sql'),
        'utf-8',
      )

      await app.get('db').schema.withSchema('core').raw(dropWorkspaceSchemaCode)
      await app.service(SERVICES.CORE_WORKSPACE).remove(workspace.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
    })
    it('do not delete the workspace if an error occured when removing the lck_workspace record (transaction)', async () => {
      const workspace = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'for removal purpose',
        documentation: 'Core workspace for testing forbid workspace removal for non admin users',
        public: false,
        createdBy: setupData.user1.id,
      })
      const workspaceSlug = 'w_' + (workspace.slug as string)
      // setup / mock the core-workspace for overwrite the `_remove` function and fail
      const originalRemove = app.service(SERVICES.CORE_WORKSPACE)._remove

      app.service(SERVICES.CORE_WORKSPACE)._remove = async function (id: Id, params?: any) {
        throw new Error(`Fail to remove workspace id ${id as string}`)
      }
      // patch
      await app.service(SERVICES.CORE_WORKSPACE).patch(workspace.id, {
        softDeletedAt: new Date().toISOString(),
      })

      // remove that fail
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).remove(workspace.id, {
          authenticated: true,
          user: setupData.userAdmin,
          authentication: setupData.userAdminAuthentication,
        }),
      ).rejects.toThrow()

      // check the dedicated schema is still there
      const result = await app
        .get('db')
        .raw('SELECT * FROM pg_catalog.pg_namespace WHERE nspname = ?', workspaceSlug)
      expect(result.rowCount).toBe(1)

      // check the workspace still exists in database
      const wsResult = await app.service(SERVICES.CORE_WORKSPACE).find({
        query: {
          slug: workspace.slug,
          softDeletedAt: {
            $ne: null,
          },
        },
      })
      expect(wsResult.total).toBe(1)

      // unmock / teardown
      app.service(SERVICES.CORE_WORKSPACE)._remove = originalRemove

      await app.service(SERVICES.CORE_WORKSPACE).remove(workspace.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
    })
    it('manage long workspace name (limit to 50 chars)', async () => {
      expect.assertions(1)
      await expect(
        app.service(SERVICES.CORE_WORKSPACE).create({
          name: 'pouet pouet pouet pouic pouic pouic pwet pwet pwet pwet',
          documentation: 'Testing long workspace name',
          createdBy: setupData.user2.id,
        }),
      ).rejects.toThrow(BadRequest)
    })

    it('manage long workspace name up to 50 chars', async () => {
      expect.assertions(2)
      const ws = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'pouet pouet pouet pouet pouic pouic pouic pouic pw',
        documentation: 'Testing long long long workspace name',
        createdBy: setupData.user2.id,
      })
      expect(ws).toBeDefined()
      expect(ws.slug).toBe('pouet_pouet_pouet_pouet_pouic_pouic_pouic_pouic_pw')

      await app.service(SERVICES.CORE_WORKSPACE).patch(ws.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(ws.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
    })

    it('manage long workspace name up to 50 chars and diacritics', async () => {
      expect.assertions(2)
      const ws = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'pouèt pöuét poüet pouïc?poùic%pouic/pwet!pwet$pwèt',
        documentation: 'Testing long long long workspace name',
        createdBy: setupData.user2.id,
      })
      expect(ws).toBeDefined()
      expect(ws.slug).toBe('pouet_pouet_pouet_pouic_pouic_pouic_pwet_pwet_pwet')

      await app.service(SERVICES.CORE_WORKSPACE).patch(ws.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(ws.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
    })

    it('manage long workspace name up to 50 chars and diacritics and numbers', async () => {
      expect.assertions(2)
      const ws = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'pouèt pöuét 0123poüet pouïc?poùic%12/pwet!pwet$pwè',
        documentation: 'Testing long long long workspace name',
        createdBy: setupData.user2.id,
      })
      expect(ws).toBeDefined()
      expect(ws.slug).toBe('pouet_pouet_0123pouet_pouic_pouic_12_pwet_pwet_pwe')

      await app.service(SERVICES.CORE_WORKSPACE).patch(ws.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(ws.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
    })
  })

  describe.todo('manage permissions...', () => {
    it.todo(
      'forbid to get a workspace if user does not have access to it through a group or creator',
    )
    it.todo('filter datasources when retrieved with $eager according permissions')
    it.todo('filter groups ? when retrieved with $eager according permissions')
    it.todo('filter roles ? when retrieved with $eager according permissions')
  })

  describe('manage edge cases', () => {
    it('forbid to patch name / slug', async () => {
      expect.assertions(2)
      // setup : create a workspace
      const workspace = await app.service(SERVICES.CORE_WORKSPACE).create({
        name: 'for removal purpose',
        documentation: 'Core workspace for testing forbid workspace removal for non admin users',
        public: false,
        createdBy: setupData.user1.id,
      })
      // try to patch the name => fail
      await expect(
        // @ts-expect-error
        app.service(SERVICES.CORE_WORKSPACE).patch(workspace.id, {
          name: 'test',
        }),
      ).rejects.toThrow(BadRequest)
      // try to patch the slug => fail
      await expect(
        // @ts-expect-error
        app.service(SERVICES.CORE_WORKSPACE).patch(workspace.id, {
          slug: 'test',
        }),
      ).rejects.toThrow(BadRequest)

      // teardown

      await app.service(SERVICES.CORE_WORKSPACE).patch(workspace.id, {
        softDeletedAt: new Date().toISOString(),
      })
      await app.service(SERVICES.CORE_WORKSPACE).remove(workspace.id, {
        authenticated: true,
        user: setupData.userAdmin,
        authentication: setupData.userAdminAuthentication,
      })
    })
  })

  it.todo("don't take in consideration a slug given for creation (and maybe throw an error ?)")

  afterAll(async () => {
    await builder.teardownWorkspace()
    await app.teardown()
  })
})
