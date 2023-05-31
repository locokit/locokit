import { createApp } from '../../../app'
import { describe, it, beforeEach, beforeAll, afterAll, afterEach, vi, expect } from 'vitest'
import { UserResult } from '@/services/core/user/user.schema'
import { Paginated } from '@feathersjs/feathers'
import { builderTestEnvironment, SetupData } from '@/configure.test'
import { SERVICES } from '@locokit/definitions'

describe('authentication', () => {
  const app = createApp()
  const builder = builderTestEnvironment('authentication')
  let setupData: SetupData

  vi.mock('../../../utils/password')
  vi.mock('../../mailer/mailer.class')

  const userInfo = {
    username: 'hello',
    email: 'someone@example.com',
    // profile: USER_PROFILE.MEMBER,
  }

  beforeAll(async () => {
    setupData = await builder.setupWorkspace()
  })

  beforeEach(async () => {
    try {
      const user = await app.service(SERVICES.CORE_USER).create(userInfo)
      // @ts-expect-error
      await app.service(SERVICES.CORE_USER).patch(
        user.id,
        { isVerified: true },
        {
          provider: 'external',
          user: setupData.userAdmin,
          accessToken: setupData.userAdminAuthentication.accessToken,
          authenticated: true,
        },
      )
    } catch (error) {
      // Do nothing, it just means the user already exists and can be tested
    }
  })

  afterEach(async () => {
    // Clean DB
    const usersToRemove = (await app.service(SERVICES.CORE_USER).find({
      query: {
        username: 'hello',
      },
    })) as Paginated<UserResult>

    await Promise.all(
      usersToRemove.data.map(async (u) => await app.service(SERVICES.CORE_USER).remove(u.id)),
    )
  })

  it('authenticates user and creates accessToken', async () => {
    expect.assertions(2)
    const { user, accessToken } = await app.service(SERVICES.AUTH_AUTHENTICATION).create(
      {
        strategy: 'local',
        email: 'someone@example.com',
        password: 'pouetP@0',
      },
      {},
    )

    expect(user).toBeDefined()
    expect(accessToken).toBeDefined()
  })

  it('registered the authentication service', () => {
    expect.assertions(1)
    expect(app.service(SERVICES.AUTH_AUTHENTICATION)).toBeDefined()
  })

  it.todo(
    'can work in local strategy with the couple username/password too instead of email/password',
  )

  afterAll(async () => {
    await builder.teardownWorkspace()
  })
})
