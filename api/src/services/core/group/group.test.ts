import { SERVICES } from '@locokit/definitions'
import { describe, it, assert, beforeAll, expect, afterAll } from 'vitest'
import { createApp } from '../../../app'
import { builderTestEnvironment, SetupData } from '@/configure.test'

describe('[core] group service', () => {
  const app = createApp()
  const builder = builderTestEnvironment('core-group')
  let setupData: SetupData
  const port = app.get('port') || 8998
  // const getUrl = (pathname: string) =>
  //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  //   new URL(`http://${app.get('host') || 'localhost'}:${port}${pathname}`).toString()

  beforeAll(async () => {
    setupData = await builder.setupWorkspace()
    await app.listen(port)
  })

  it('registered the service', () => {
    const service = app.service(SERVICES.CORE_GROUP)

    assert.ok(service, 'Registered the service')
  })

  describe('external calls', () => {
    describe('for ADMIN users', () => {
      it('returns all groups paginated when user profile is ADMIN', async () => {
        expect.assertions(2)
        const result = await app.service(SERVICES.CORE_GROUP).find({
          provider: 'external',
          authenticated: true,
          authentication: setupData.userAdminAuthentication,
          user: setupData.userAdmin,
        })
        expect(result).toBeDefined()
        expect(result.total).toBe(5)
      })

      it('returns all group users when queried with $joinRelated users, and some private properties', async () => {
        expect.assertions(9)
        const result = await app.service(SERVICES.CORE_GROUP).get(setupData.group1.id, {
          provider: 'external',
          authenticated: true,
          authentication: setupData.userAdminAuthentication,
          user: setupData.userAdmin,
          query: {
            $joinEager: 'users',
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
        const result = await app.service(SERVICES.CORE_GROUP).create(
          {
            name: 'new group for ADMIN user',
            workspaceId: setupData.workspace2Id,
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.userAdminAuthentication,
            user: setupData.userAdmin,
          },
        )
        expect(result).toBeDefined()
        await app.service(SERVICES.CORE_GROUP).remove(result.id)
      })
    })

    describe('for other users', () => {
      it('returns only user groups when user profile is not ADMIN', async () => {
        expect.assertions(3)
        const result = await app.service(SERVICES.CORE_GROUP).find({
          provider: 'external',
          authenticated: true,
          authentication: setupData.user4Authentication,
          user: setupData.user4,
          query: {
            $sort: {
              createdAt: 1, // sort by createdAt to match ids in creation time
            },
          },
        })
        expect(result).toBeDefined()
        expect(result.total).toBe(1)
        expect(result.data[0].id).toBe(setupData.group4.id)
      })
      it('returns user groups and workspace groups when user profile is also a workspace owner', async () => {
        expect.assertions(5)
        const result = await app.service(SERVICES.CORE_GROUP).find({
          provider: 'external',
          authenticated: true,
          authentication: setupData.user1Authentication,
          user: setupData.user1,
          query: {
            $sort: {
              createdAt: 1, // sort by createdAt to match ids in creation time
            },
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
        const result = await app.service(SERVICES.CORE_GROUP).get(setupData.group1.id, {
          provider: 'external',
          authenticated: true,
          authentication: setupData.user1Authentication,
          user: setupData.user1,
          query: {
            $joinEager: 'users',
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
        const result = await app.service(SERVICES.CORE_GROUP).create(
          {
            name: 'new group for CREATOR user',
            workspaceId: setupData.workspace2Id,
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user2Authentication,
            user: setupData.user2,
          },
        )
        expect(result).toBeDefined()
        await app.service(SERVICES.CORE_GROUP).remove(result.id)
      })
      it('forbid to create a new group in a workspace if the user is not the owner', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.CORE_GROUP).create(
          {
            name: 'new group for CREATOR user',
            workspaceId: setupData.workspace2Id,
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user4Authentication,
            user: setupData.user4,
          },
        )
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to create core\/group/)
      })
      it('forbid group creation for MEMBER', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.CORE_GROUP).create(
          {
            name: 'new group for CREATOR user',
            workspaceId: setupData.workspace2Id,
            policyId: setupData.policy1.id,
          },
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user3Authentication,
            user: setupData.user3,
          },
        )
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to create core\/group/)
      })
      it('forbid group patch for MEMBER', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.CORE_GROUP).patch(
          setupData.group1.id,
          {},
          {
            provider: 'external',
            authenticated: true,
            authentication: setupData.user3Authentication,
            user: setupData.user3,
          },
        )
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to patch core\/group/)
      })
      it('forbid group removal for MEMBER', async () => {
        expect.assertions(2)
        const request = app.service(SERVICES.CORE_GROUP).remove(setupData.group1.id, {
          provider: 'external',
          authenticated: true,
          authentication: setupData.user3Authentication,
          user: setupData.user3,
        })
        await expect(request).rejects.toThrow()
        await expect(request).rejects.toThrowError(/You are not allowed to remove core\/group/)
      })
    })
  })

  describe('filter', () => {
    it('filter on group name', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.CORE_GROUP).find({
        query: {
          name: {
            $ilike: '%core-group%',
          },
        },
      })
      expect(result).toBeDefined()
      expect(result.total).toBe(5)
    })
    it('filter on workspace name', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.CORE_GROUP).find({
        query: {
          $joinRelated: 'workspace',
          'workspace.name': {
            $ilike: '%Public workspace%',
          },
        },
      })
      expect(result).toBeDefined()
      expect(result.total).toBe(3)
    })
    it('filter on workspace owner username', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.CORE_GROUP).find({
        query: {
          $joinRelated: 'workspace.owner',
          'workspace:owner.username': {
            $ilike: '%user2%',
          },
        },
      })
      expect(result).toBeDefined()
      expect(result.total).toBe(2)
    })

    it('filter on workspace name AND group name ($joinEager with objection + validation)', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.CORE_GROUP).find({
        query: {
          $joinRelated: 'workspace',
          'workspace.name': {
            $ilike: '%Workspace 2%',
          },
          name: {
            $ilike: '%core-group%',
          },
        },
      })
      expect(result).toBeDefined()
      expect(result.total).toBe(2)
    })
  })
  describe('internal calls are not restricted', () => {
    it('for read', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.CORE_GROUP).find({})
      expect(result).toBeDefined()
      expect(result.total).toBe(5)
    })
    it('for creation', async () => {
      expect.assertions(1)
      const result = await app.service(SERVICES.CORE_GROUP).create({
        name: 'new group for ADMIN user',
        workspaceId: setupData.workspace2Id,
        policyId: setupData.policy1.id,
      })
      expect(result).toBeDefined()
      await app.service(SERVICES.CORE_GROUP).remove(result.id)
    })
    it('for patch', async () => {
      expect.assertions(2)
      const result = await app.service(SERVICES.CORE_GROUP).create({
        name: 'new group for ADMIN user',
        workspaceId: setupData.workspace2Id,
        policyId: setupData.policy1.id,
      })
      expect(result).toBeDefined()
      const resultPatched = await app.service(SERVICES.CORE_GROUP).patch(result.id, {
        name: 'new name',
      })
      expect(resultPatched.name).toBe('new name')
      await app.service(SERVICES.CORE_GROUP).remove(result.id)
    })
    // for removal, already removed...
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
  })
})
