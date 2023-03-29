/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, beforeAll, afterAll, it, expect, afterEach, vi } from 'vitest'

import { Paginated } from '@feathersjs/feathers'
import { SERVICES, USER_PROFILE } from '@locokit/definitions'
import { UserResult } from '@/services/core/user/user.schema'
import { createApp } from '../../../app'
import axios from 'axios'
import { BadRequest } from '@feathersjs/errors/lib'

const app = createApp()
const port = app.get('port') || 8998
const getUrl = (pathname: string) =>
  new URL(`http://${app.get('host') || 'localhost'}:${port}/${pathname}`).toString()

describe("'signup' service", () => {
  const credentials = {
    username: 'signupuser',
    email: 'signupuser@locokit.io',
  }

  beforeAll(async () => {
    // @ts-expect-error
    app.service('mailer').create = vi.fn()
    await app.listen(port)
  })

  afterAll(async () => {
    await app.teardown()
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    // Clean DB
    const usersToRemove = (await app.service(SERVICES.CORE_USER).find({
      query: {
        username: 'signupuser',
      },
    })) as Paginated<UserResult>

    await Promise.all(
      usersToRemove.data.map(async (u) => await app.service(SERVICES.CORE_USER).remove(u.id)),
    )
  })

  it('registered the service', () => {
    expect.assertions(1)
    const service = app.service(SERVICES.AUTH_SIGNUP)
    expect(service).toBeTruthy()
  })

  it('create a user with valid credentials', async () => {
    expect.assertions(2)
    // Create the user from the signup endpoint
    await app.service(SERVICES.AUTH_SIGNUP).create(credentials)

    // Check that the user is created with the right properties
    const users = (await app.service(SERVICES.CORE_USER).find({
      query: {
        username: credentials.username,
      },
    })) as Paginated<UserResult>

    expect(users.total).toBe(1)
    expect(users.data[0]).toEqual(
      expect.objectContaining({
        ...credentials,
        profile: USER_PROFILE.CREATOR,
        isVerified: false,
      }),
    )
  })

  it('if a user is already using the emitted email address, inform him', async () => {
    expect.assertions(4)

    // Create a user
    const previousUser = await app.service(SERVICES.CORE_USER).create(credentials)

    // Start spying
    const spyOnMailer = vi.spyOn(app.service(SERVICES.MISC_MAILER), 'create')

    // Create the user from the signup endpoint with the same email address
    await app.service(SERVICES.AUTH_SIGNUP).create(credentials)

    // Check that the user is created with the right properties
    const users = (await app.service(SERVICES.CORE_USER).find({
      query: {
        email: credentials.email,
      },
    })) as Paginated<UserResult>

    expect(users.total).toBe(1)
    expect(users.data[0].id).toBe(previousUser.id)

    expect(spyOnMailer).toHaveBeenCalledTimes(1)
    expect(spyOnMailer).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: '[LCK_PUBLIC_PORTAL_NAME] Your email address has been used',
        to: 'signupuser@locokit.io',
      }),
    )
  })

  it('throw a 429 if too many signups are registered', async () => {
    expect.assertions(1)
    const maxTries = app.get('settings').signup.rateLimitMax ?? 5

    for (let i = 0; i < maxTries; i++) {
      await axios.post(
        getUrl(SERVICES.AUTH_SIGNUP),
        {
          name: `Signup user n°${i}`,
          username: `user${i}`,
          email: `signupuser${i}@locokit.io`,
        },
        {
          headers: {
            ip: 'my-ip-address',
          },
        },
      )
    }

    await expect(
      axios.post(
        getUrl(SERVICES.AUTH_SIGNUP),
        {
          name: 'Signup user n° too much',
          username: 'signupusertoomuch',
          email: 'signupusertoomuch@locokit.io',
        },
        {
          headers: {
            ip: 'my-ip-address',
          },
        },
      ),
    ).rejects.toThrowError(/429/)
  })

  it('fails if the signup do not give a username when creating the new user', async () => {
    expect.assertions(1)
    // Create the user from the signup endpoint without email
    // we add the ts-expect-error as it is not ok with typing
    const call = await expect(
      // @ts-expect-error
      app.service(SERVICES.AUTH_SIGNUP).create({
        email: 'signupwithoutusername@locokit.io',
      }),
    )

    call.rejects.toThrowError(/validation failed/)
    call.rejects.toBeInstanceOf(BadRequest)
  })

  it('fails if the signup is not authorized', async () => {
    expect.assertions(1)

    // update the settings to forbid signup
    app.get('settings').signup.allowed = false

    const call = await expect(app.service(SERVICES.AUTH_SIGNUP).create(credentials))

    // try to create a user
    call.rejects.toContain({ code: 403 })
    call.rejects.toThrowError(/Signup is not authorized/)

    app.get('settings').signup.allowed = true
  })

  it.todo('fails if the data sent contains unwanted keys')
})
