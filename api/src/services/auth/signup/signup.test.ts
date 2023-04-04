/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, beforeAll, afterAll, afterEach, it, expect, vi } from 'vitest'

import { Paginated } from '@feathersjs/feathers'
import { SERVICES, USER_PROFILE } from '@locokit/definitions'
import { UserResult } from '@/services/core/user/user.schema'
import { createApp } from '@/app'
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
    app.service(SERVICES.MISC_MAILER).create = vi.fn()
    await app.listen(port)
  })

  afterAll(async () => {
    vi.restoreAllMocks()
    await app.teardown()
  })

  /**
   * Clean database with all signupuser accounts
   */
  afterEach(async () => {
    const users = (await app.service(SERVICES.CORE_USER).find({
      query: {
        email: {
          $like: '%signupuser%',
        },
      },
    })) as Paginated<UserResult>

    await app.service(SERVICES.CORE_USER).remove(null, {
      query: {
        id: {
          $in: users.data.map((u) => u.id),
        },
      },
    })
  })

  it('registered the service', () => {
    expect.assertions(1)
    const service = app.service(SERVICES.AUTH_SIGNUP)
    expect(service).toBeTruthy()
  })

  it('create a user with valid credentials', async () => {
    expect.assertions(3)
    // Create the user from the signup endpoint
    const user = await app.service(SERVICES.AUTH_SIGNUP).create(credentials)

    expect(user).toEqual(credentials)

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

    await app.service(SERVICES.CORE_USER).remove(users.data[0].id)
  })

  it('if a user is already using the emitted email address, inform him', async () => {
    expect.assertions(4)

    // Create a user
    const previousUser = await app.service(SERVICES.CORE_USER).create({ ...credentials })

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

    await app.service(SERVICES.CORE_USER).remove(previousUser.id)
  })

  it('throw a 429 if too many signups are registered', async () => {
    expect.assertions(1)
    const maxTries = app.get('settings').signup.rateLimitMax ?? 5

    for (let i = 0; i < maxTries; i++) {
      console.log('creating user ', `signupuser${i}@locokit.io`)
      await axios.post(
        getUrl(SERVICES.AUTH_SIGNUP),
        {
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
    console.log('creating user signupusertoomuch@locokit.io')

    await expect(
      axios.post(
        getUrl(SERVICES.AUTH_SIGNUP),
        {
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
    expect.assertions(2)
    // Create the user from the signup endpoint without email
    // we add the ts-expect-error as it is not ok with typing
    const fn = () =>
      // @ts-expect-error
      app.service(SERVICES.AUTH_SIGNUP).create({
        email: 'signupwithoutusername@locokit.io',
      })

    await expect(fn).rejects.toThrowError(/validation failed/)
    await expect(fn).rejects.toBeInstanceOf(BadRequest)
  })

  it('fails if the signup is not authorized', async () => {
    expect.assertions(2)

    // update the settings to forbid signup
    app.get('settings').signup.allowed = false

    const fn = () => app.service(SERVICES.AUTH_SIGNUP).create(credentials)

    // try to create a user
    await expect(fn).rejects.toContain({ code: 403 })
    await expect(fn).rejects.toThrowError(/Signup is not authorized/)

    app.get('settings').signup.allowed = true
  })

  it('fails if the data sent contains unwanted keys', async () => {
    expect.assertions(2)

    const fn = () =>
      app.service(SERVICES.AUTH_SIGNUP).create({
        ...credentials,
        // @ts-expect-error
        toto: 'pouet',
      })

    await expect(fn).rejects.toThrowError(/validation failed/)
    await expect(fn).rejects.toBeInstanceOf(BadRequest)
  })
})
