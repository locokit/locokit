import { Paginated } from '@feathersjs/feathers'
import { SERVICES } from '@locokit/definitions'
import { describe, it, expect, afterEach, vi, beforeAll, afterAll } from 'vitest'
import { createApp } from '../../../app'
import { UserResult } from '@/services/core/user/user.schema'

import { builderTestEnvironment, SetupData } from '@/configure.test'
import axios, { AxiosResponse } from 'axios'

vi.mock('../../mailer/mailer.class')

const credentials = {
  username: 'authmanagement+verifyExpires',
  email: 'authmanagement+verifyExpires@locokit.io',
}

function diffDays(verifyExpires?: string | number) {
  if (!verifyExpires) return null
  const d = new Date()
  return Math.round(
    (new Date(verifyExpires as string).valueOf() - d.valueOf()) / 1000 / 60 / 60 / 24,
  )
}

describe("'auth-management' service", () => {
  let setupData: SetupData
  const app = createApp()
  const port = app.get('port') || 8998
  const getUrl = (pathname: string) =>
    new URL(`http://${app.get('host') || 'localhost'}:${port}/${pathname}`).toString()
  const builder = builderTestEnvironment('authmanagement')

  beforeAll(async () => {
    setupData = await builder.setupWorkspace()
    await app.listen(port)
  })
  afterEach(async () => {
    // Clean DB
    const usersToRemove = (await app.service(SERVICES.CORE_USER).find({
      query: {
        username: 'authmanagement+verifyExpires',
      },
    })) as Paginated<UserResult>

    await Promise.all(
      usersToRemove.data.map(async (u) => await app.service(SERVICES.CORE_USER).remove(u.id)),
    )
  })

  it('registered the service', () => {
    expect(app.service(SERVICES.AUTH_MANAGEMENT)).toBeDefined()
  })

  it('register a new user and set the verifyExpires accordingly setting', async () => {
    /**
     * The variable in test.json is set to 10 days,
     * we need to compute the delta between current date and verifyExpires date,
     * it must be 10 days
     * We don't care about hours in this case.
     */
    expect.assertions(1)
    const user = await app.service(SERVICES.CORE_USER).create({ ...credentials })
    expect(diffDays(user.verifyExpires)).toBe(10)
  })

  // implemented but need to be tester on several endpoints
  it('does not send user information as a result, only username, email, firstName, lastName and id', async () => {
    expect.assertions(14)

    const response = (await axios.post(
      getUrl(SERVICES.CORE_USER),
      {
        ...credentials,
        firstName: 'First name',
        lastName: 'Last name',
      },
      {
        headers: {
          Authorization: 'Bearer ' + (setupData.userAdminAuthentication.accessToken as string),
        },
      },
    )) as AxiosResponse<UserResult>

    expect(response.data.verifyChanges).toBeUndefined()
    expect(response.data.verifyToken).toBeUndefined()
    expect(response.data.verifyShortToken).toBeUndefined()
    expect(response.data.verifyExpires).toBeUndefined()
    expect(response.data.password).toBeUndefined()
    expect(response.data.resetAttempts).toBeUndefined()
    expect(response.data.resetExpires).toBeUndefined()
    expect(response.data.resetShortToken).toBeUndefined()
    expect(response.data.resetToken).toBeUndefined()
    expect(response.data.email).toBe(credentials.email)
    expect(response.data.username).toBe(credentials.username)
    expect(response.data.firstName).toBe('First name')
    expect(response.data.lastName).toBe('Last name')
    expect(response.data.id).toBeDefined()
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
    await app.teardown()
  })
})
