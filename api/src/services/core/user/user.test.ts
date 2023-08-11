import { SERVICES } from '@locokit/definitions'
import { describe, it, afterAll, beforeAll, expect } from 'vitest'
import { createApp } from '@/app'
import axios from 'axios'
import { builderTestEnvironment, SetupData } from '@/configure.test'

describe('[core] user service', () => {
  const app = createApp()
  const port = (app.get('port') as number) || 8998
  const builder = builderTestEnvironment('authentication')
  let setupData: SetupData
  const getUrl = (endpoint: string) =>
    `http://${(app.get('host') as string) || 'localhost'}:${port}${endpoint}`

  beforeAll(async () => {
    await app.listen(port)
    setupData = await builder.setupWorkspace()
  })

  afterAll(async () => {
    await app.teardown()
    await builder.teardownWorkspace()
  })

  it('registered the service', () => {
    const service = app.service(SERVICES.CORE_USER)
    expect(service).toBeDefined()
  })

  describe('External call', () => {
    it('Try to get user data with unauthenticated user', async () => {
      expect.assertions(1)
      await expect(
        axios({
          method: 'get',
          url: getUrl(`${SERVICES.CORE_USER}/${setupData.userAdmin.id as string}`),
        }),
      ).rejects.toThrowError(/401/)
    })

    it('User get its own information', async () => {
      expect.assertions(11)
      const res = await axios({
        method: 'get',
        url: getUrl(`${SERVICES.CORE_USER}/${setupData.user2.id as string}`),
        headers: {
          Authorization: `Bearer ${setupData.user2Authentication.accessToken as string}`,
        },
      })

      expect(res.data).toHaveProperty('firstName')
      expect(res.data).toHaveProperty('lastName')
      expect(res.data).toHaveProperty('username')
      expect(res.data).toHaveProperty('avatarURL')
      expect(res.data).toHaveProperty('email')
      expect(res.data).toHaveProperty('profile')
      expect(res.data).toHaveProperty('blocked')
      expect(res.data).toHaveProperty('isVerified')
      expect(res.data).toHaveProperty('createdAt')
      expect(res.data).not.toHaveProperty('password')
      expect(res.data.username).toBe('User 2')
    })

    it('User try to get other user information', async () => {
      expect.assertions(1)
      await expect(
        axios({
          method: 'get',
          url: getUrl(`${SERVICES.CORE_USER}/${setupData.userAdmin.id as string}`),
          headers: {
            Authorization: `Bearer ${setupData.user2Authentication.accessToken as string}`,
          },
        }),
      ).rejects.toThrowError(/404/)
    })

    it('Admin get its own information', async () => {
      expect.assertions(1)
      const res = await axios({
        method: 'get',
        url: getUrl(`${SERVICES.CORE_USER}/${setupData.userAdmin.id as string}`),
        headers: {
          Authorization: `Bearer ${setupData.userAdminAuthentication.accessToken as string}`,
        },
      })
      expect(res.data.username).toBe(setupData.userAdmin.username)
    })

    it('Admin try to get other user information', async () => {
      expect.assertions(11)
      const res = await axios({
        method: 'get',
        url: getUrl(`${SERVICES.CORE_USER}/${setupData.user2.id as string}`),
        headers: {
          Authorization: `Bearer ${setupData.userAdminAuthentication.accessToken as string}`,
        },
      })
      expect(res.data.username).toBe(setupData.user2.username)
      expect(res.data).toHaveProperty('firstName')
      expect(res.data).toHaveProperty('lastName')
      expect(res.data).toHaveProperty('username')
      expect(res.data).toHaveProperty('avatarURL')
      expect(res.data).toHaveProperty('email')
      expect(res.data).toHaveProperty('profile')
      expect(res.data).toHaveProperty('blocked')
      expect(res.data).toHaveProperty('isVerified')
      expect(res.data).toHaveProperty('createdAt')
      expect(res.data).not.toHaveProperty('password')
    })

    it('Admin find users (paginated)', async () => {
      expect.assertions(11)
      const res = await axios({
        method: 'get',
        url: getUrl(SERVICES.CORE_USER),
        headers: {
          Authorization: `Bearer ${setupData.userAdminAuthentication.accessToken as string}`,
        },
      })
      expect(res.data.total).toBe(7)
      expect(res.data.data[0]).toHaveProperty('firstName')
      expect(res.data.data[0]).toHaveProperty('lastName')
      expect(res.data.data[0]).toHaveProperty('username')
      expect(res.data.data[0]).toHaveProperty('avatarURL')
      expect(res.data.data[0]).toHaveProperty('email')
      expect(res.data.data[0]).toHaveProperty('profile')
      expect(res.data.data[0]).toHaveProperty('blocked')
      expect(res.data.data[0]).toHaveProperty('isVerified')
      expect(res.data.data[0]).toHaveProperty('createdAt')
      expect(res.data.data[0]).not.toHaveProperty('password')
    })

    it('User find users (paginated)', async () => {
      expect.assertions(7)
      const res = await axios({
        method: 'get',
        url: getUrl(SERVICES.CORE_USER),
        headers: {
          Authorization: `Bearer ${setupData.user2Authentication.accessToken as string}`,
        },
      })
      expect(res.data.total).toBe(7)
      expect(res.data.data[0]).toHaveProperty('username')
      expect(res.data.data[0]).toHaveProperty('avatarURL')
      expect(res.data.data[0]).toHaveProperty('createdAt')
      expect(res.data.data[0]).not.toHaveProperty('password')
      expect(res.data.data[0]).not.toHaveProperty('email')
      expect(res.data.data[0]).not.toHaveProperty('firstName')
    })

    it('Admin can filter users', async () => {
      expect.assertions(3)
      const res = await axios({
        method: 'get',
        url: `${getUrl(SERVICES.CORE_USER)}?$and[0][username]=${
          setupData.userBlocked.username as string
        }&$and[1][blocked][$eq]=true`,
        headers: {
          Authorization: `Bearer ${setupData.userAdminAuthentication.accessToken as string}`,
        },
      })

      expect(res.data.total).toBe(1)
      expect(res.data.data[0].username).toBe(setupData.userBlocked.username)
      expect(res.data.data[0].blocked).toBe(true)
    })

    it.todo('Admin can search users by username', async () => {
      expect.assertions(3)
      const res = await axios({
        method: 'get',
        url: `${getUrl(SERVICES.CORE_USER)}?[username][$ilike]=%user%`,
        headers: {
          Authorization: `Bearer ${setupData.userAdminAuthentication.accessToken as string}`,
        },
      })

      expect(res.data.total).toBe(7)
      expect(res.data.data[0]).toHaveProperty('username')
      expect(res.data.data[0]).toHaveProperty('email')
    })

    it.todo('User can search other users by username', async () => {
      expect.assertions(3)
      const res = await axios({
        method: 'get',
        url: `${getUrl(SERVICES.CORE_USER)}?[username][$ilike]=%user%`,
        headers: {
          Authorization: `Bearer ${setupData.user2Authentication.accessToken as string}`,
        },
      })

      expect(res.data.total).toBe(7)
      expect(res.data.data[0]).toHaveProperty('username')
      expect(res.data.data[0]).not.toHaveProperty('email')
    })
  })

  it.todo('return groups of a user when using the $joinRelated option')

  it.todo('allow admin users to filter on all users')
  it.todo('allow admin users to filter on all users by username')
  it.todo('allow users to get themselves')
  it.todo('forbid users to get another user')
  it.todo('allow users to find users and retrieve their username')
  it.todo('allow users to find users and filter on their username')
  it.todo('forbid users to find users and filter on other fields than username')
  it.todo('does not return firstname and lastname')

  it.todo('forbid the creation of a user from external calls')
  it.todo('forbid the creation of a user from external calls for public users')
  it.todo('forbid the creation of a user from external calls except admin users')

  it.todo('forbid the patch without auth')
  it.todo('forbid the patch of specific fields for a logged user') // isVerified, ...
  it.todo('forbid the patch of specific fields for another user than the logged user')
  it.todo('forbid the patch of specific fields for admin user') // createdAt, lastConnection, ...
  it.todo('allow the patch of specific fields for admin user')
  /** check also the patch fields admin vs not admin users */

  it.todo('forbid the removal of a user')
  it.todo('forbid the removal of a user except for admin users')

  it.todo('trim the email when a user is created')
  it.todo('lowercase the email when a user is created')

  it.todo('forbid to filter on verifyToken through an external call without being admin')
  it.todo('forbid to filter on another field through an external call without being admin')
  it.todo('forbid to filter through this endpoint if external call without being admin')

  it.todo('forbid the filtering of users from this endpoint without being an admin user')
})
