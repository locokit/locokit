import { SERVICES } from '@locokit/definitions'
import { describe, it, assert, beforeAll, expect, afterAll } from 'vitest'
import { createApp } from '../../../app'
import { builderTestEnvironment, SetupData } from '@/configure.test'
import { Application } from '@feathersjs/feathers'
import { Server } from 'node:http'

describe('[workspace] group service', () => {
  let app: Application
  let server: Server
  let port: number
  let builder: ReturnType<typeof builderTestEnvironment>
  let setupData: SetupData

  beforeAll(async () => {
    app = createApp()
    builder = builderTestEnvironment('workspace-group', app)
    port = app.get('port') || 8998
    setupData = await builder.setupWorkspace()
    server = await app.listen(port)
  })

  // afterAll(async () => {
  //   await builder.teardownWorkspace()
  //   await app.teardown(server)
  // })

  it('registered the service', () => {
    const service = app.service(SERVICES.WORKSPACE_GROUP)

    assert.ok(service, 'Registered the service')
  })

  describe('external calls', () => {
    describe('for ADMIN users', () => {
      it('returns all groups paginated when user profile is ADMIN', async () => {
        expect.assertions(2)

        const result = await app.service(SERVICES.WORKSPACE_GROUP).find({
          provider: 'external',
          authenticated: true,
          authentication: setupData.userAdminAuthentication,
          user: setupData.userAdmin,
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
        expect(result).toBeDefined()
        expect(result.total).toBe(3)
      })

      it('returns all groups paginated when user profile is the owner of the workspace', async () => {
        expect.assertions(2)
        const result = await app.service(SERVICES.WORKSPACE_GROUP).find({
          provider: 'external',
          authenticated: true,
          authentication: setupData.userCreator1Authentication,
          user: setupData.userCreator1,
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
        expect(result).toBeDefined()
        expect(result.total).toBe(3)
      })

      it('returns all group users when queried with $joinRelated users, and some private properties', async () => {
        expect.assertions(9)
        const result = await app.service(SERVICES.WORKSPACE_GROUP).get(setupData.group1.id, {
          provider: 'external',
          authenticated: true,
          authentication: setupData.userAdminAuthentication,
          user: setupData.userAdmin,
          query: {
            $joinEager: 'users',
          },
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
        expect(result).toBeDefined()
        expect(result.users).toBeDefined()
        expect(result.users?.length).toBe(2)
        // ADMIN users can access to email / blocked / isVerified
        expect(result.users?.[0].email).toBeDefined()
        expect(result.users?.[0].blocked).toBeDefined()
        expect(result.users?.[0].isVerified).toBeDefined()
        expect(result.users?.[1].email).toBeDefined()
        expect(result.users?.[1].blocked).toBeDefined()
        expect(result.users?.[1].isVerified).toBeDefined()
      })

      it('create a new group if user is ADMIN', async () => {
        expect.assertions(1)
        const result = await app.service(SERVICES.WORKSPACE_GROUP).create(
          {
            name: 'new group by ADMIN user',
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.userAdminAuthentication,
            user: setupData.userAdmin,
            route: {
              workspaceSlug: setupData.publicWorkspace.slug,
            },
          },
        )
        expect(result).toBeDefined()
        await app.service(SERVICES.WORKSPACE_GROUP).remove(result.id, {
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
      })

      it('create a new group if user is the owner', async () => {
        expect.assertions(1)
        const result = await app.service(SERVICES.WORKSPACE_GROUP).create(
          {
            name: 'new group by Creator user',
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.userCreator1Authentication,
            user: setupData.userCreator1,
            route: {
              workspaceSlug: setupData.publicWorkspace.slug,
            },
          },
        )
        expect(result).toBeDefined()
        await app.service(SERVICES.WORKSPACE_GROUP).remove(result.id, {
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
      })

      it('cannot create a new group if user is not the owner', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.WORKSPACE_GROUP).create(
          {
            name: 'new group by User 2',
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user2Authentication,
            user: setupData.user2,
            route: {
              workspaceSlug: setupData.publicWorkspace.slug,
            },
          },
        )
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to create workspace\/group/)
      })
    })

    describe('for other users', () => {
      it('returns only user groups when user profile is not ADMIN', async () => {
        expect.assertions(3)
        const result = await app.service(SERVICES.WORKSPACE_GROUP).find({
          provider: 'external',
          authenticated: true,
          authentication: setupData.user2Authentication,
          user: setupData.user2,
          query: {
            $sort: {
              createdAt: 1, // sort by createdAt to match ids in creation time
            },
          },
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
        expect(result).toBeDefined()
        expect(result.total).toBe(1)
        expect(result.data[0].id).toBe(setupData.group1.id)
      })
      it('returns user groups and workspace groups when user profile is also a workspace owner', async () => {
        expect.assertions(5)
        const result = await app.service(SERVICES.WORKSPACE_GROUP).find({
          provider: 'external',
          authenticated: true,
          authentication: setupData.userCreator1Authentication,
          user: setupData.userCreator1,
          query: {
            $sort: {
              createdAt: 1, // sort by createdAt to match ids in creation time
            },
          },
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
        expect(result).toBeDefined()
        expect(result.total).toBe(3)
        expect(result.data[0].id).toBe(setupData.group1.id)
        expect(result.data[1].id).toBe(setupData.group2.id)
        expect(result.data[2].id).toBe(setupData.group5.id)
      })

      it('returns all group users when queried with $joinRelated users without sensitive data', async () => {
        expect.assertions(9)
        const result = await app.service(SERVICES.WORKSPACE_GROUP).get(setupData.group1.id, {
          provider: 'external',
          authenticated: true,
          authentication: setupData.userCreator1Authentication,
          user: setupData.userCreator1,
          query: {
            $joinEager: 'users',
          },
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
        expect(result).toBeDefined()
        expect(result.users).toBeDefined()
        expect(result.users?.length).toBe(2)
        // ADMIN users can access to email / blocked / isVerified
        expect(result.users?.[0].email).not.toBeDefined()
        expect(result.users?.[0].blocked).not.toBeDefined()
        expect(result.users?.[0].isVerified).not.toBeDefined()
        expect(result.users?.[1].email).not.toBeDefined()
        expect(result.users?.[1].blocked).not.toBeDefined()
        expect(result.users?.[1].isVerified).not.toBeDefined()
      })
      it('create a new group in a workspace if the user is its CREATOR', async () => {
        expect.assertions(1)
        const result = await app.service(SERVICES.WORKSPACE_GROUP).create(
          {
            name: 'new group for CREATOR user',
            policyId: setupData.policy3.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user2Authentication,
            user: setupData.user2,
            route: {
              workspaceSlug: setupData.privateWorkspace.slug,
            },
          },
        )
        expect(result).toBeDefined()
        await app.service(SERVICES.WORKSPACE_GROUP).remove(result.id, {
          route: {
            workspaceSlug: setupData.privateWorkspace.slug,
          },
        })
      })
      it('forbid to create a new group in a workspace if the user is not the owner', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.WORKSPACE_GROUP).create(
          {
            name: 'new group for CREATOR user',
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user2Authentication,
            user: setupData.user2,
            route: {
              workspaceSlug: setupData.publicWorkspace.slug,
            },
          },
        )
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to create workspace\/group/)
      })
      it('forbid group creation for MEMBER', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.WORKSPACE_GROUP).create(
          {
            name: 'new group for MEMBER user',
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user3Authentication,
            user: setupData.user3,
            route: {
              workspaceSlug: setupData.publicWorkspace.slug,
            },
          },
        )
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to create workspace\/group/)
      })
      it('forbid group patch for MEMBER', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.WORKSPACE_GROUP).patch(
          setupData.group1.id,
          {},
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user3Authentication,
            user: setupData.user3,
            route: {
              workspaceSlug: setupData.publicWorkspace.slug,
            },
          },
        )
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to patch workspace\/group/)
      })
      it('forbid group removal for MEMBER', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.WORKSPACE_GROUP).remove(setupData.group1.id, {
          provider: 'external',
          authenticated: true,
          authentication: setupData.user3Authentication,
          user: setupData.user3,
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        })
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to remove workspace\/group/)
      })
    })
  })

  describe('filter', () => {
    it('filter on group name', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.WORKSPACE_GROUP).find({
        query: {
          name: {
            $ilike: '%workspace-group%',
          },
        },
        route: {
          workspaceSlug: setupData.privateWorkspace.slug,
        },
      })
      expect(result).toBeDefined()
      expect(result.total).toBe(2)
    })
  })
  describe('internal calls are not restricted', () => {
    it('for read', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.WORKSPACE_GROUP).find({
        route: {
          workspaceSlug: setupData.privateWorkspace.slug,
        },
      })
      expect(result).toBeDefined()
      expect(result.total).toBe(2)
    })
    it('for creation', async () => {
      expect.assertions(1)
      const result = await app.service(SERVICES.WORKSPACE_GROUP).create(
        {
          name: 'new group for ADMIN user',
          policyId: setupData.policy1.id,
        },
        {
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        },
      )
      expect(result).toBeDefined()
      await app.service(SERVICES.WORKSPACE_GROUP).remove(result.id, {
        route: {
          workspaceSlug: setupData.publicWorkspace.slug,
        },
      })
    })
    it('for patch', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.WORKSPACE_GROUP).create(
        {
          name: 'new group for ADMIN user',
          policyId: setupData.policy1.id,
        },
        {
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        },
      )
      expect(result).toBeDefined()
      const resultPatched = await app.service(SERVICES.WORKSPACE_GROUP).patch(
        result.id,
        {
          name: 'new name',
        },
        {
          route: {
            workspaceSlug: setupData.publicWorkspace.slug,
          },
        },
      )
      expect(resultPatched.name).toBe('new name')
      await app.service(SERVICES.WORKSPACE_GROUP).remove(result.id, {
        route: {
          workspaceSlug: setupData.publicWorkspace.slug,
        },
      })
    })
    // for removal, already removed...
  })
  describe.todo('forbid patch workspaceId on group')
})
