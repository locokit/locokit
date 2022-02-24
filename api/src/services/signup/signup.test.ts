import { Paginated } from '@feathersjs/feathers'
import { USER_PROFILE } from '@locokit/lck-glossary'
import app from '../../app'
import { User } from '../../models/user.model'
import axios from 'axios'
import url from 'url'
import { Server } from 'http'

const port = app.get('port') || 8998
const getUrl = (pathname?: string): string => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname,
})

describe('\'signup\' service', () => {
  const credentials = {
    name: 'Signup user',
    email: 'signupuser@locokit.io',
  }

  const originalMailerCreateFunction = app.service('mailer').create
  let server: Server

  beforeAll(done => {
    app.service('mailer').create = jest.fn()
    server = app.listen(port)
    server.once('listening', () => done())
  })

  afterAll(done => {
    server.close(done)
  })

  afterAll(() => {
    app.service('mailer').create = originalMailerCreateFunction
  })

  afterEach(async () => {
    // Clean DB
    const usersToRemove = await app.service('user').find({
      query: credentials,
    }) as Paginated<User>
    if (usersToRemove.total === 1) {
      await app.service('user').remove(usersToRemove.data[0].id)
    }
  })

  it('registered the service', () => {
    const service = app.service('signup')
    expect(service).toBeTruthy()
  })

  it('create a user with valid credentials', async () => {
    expect.assertions(2)
    // Create the user from the signup endpoint
    await app.service('signup').create(credentials)

    // Check that the user is created with the right properties
    const users = await app.service('user').find({
      query: credentials,
    }) as Paginated<User>

    expect(users.total).toBe(1)
    expect(users.data[0]).toEqual(expect.objectContaining({
      ...credentials,
      profile: USER_PROFILE.CREATOR,
      isVerified: false,
    }))
  })

  it('if a user is already using the emitted email address, inform him', async () => {
    expect.assertions(4)

    const spyOnMailer = jest.spyOn(app.service('mailer'), 'create')

    // Create a user
    const previousUser = await app.service('user').create(credentials)

    // Create the user from the signup endpoint with the same email address
    await app.service('signup').create(credentials)

    // Check that the user is created with the right properties
    const users = await app.service('user').find({
      query: {
        email: credentials.email,
      },
    }) as Paginated<User>

    expect(users.total).toBe(1)
    expect(users.data[0].id).toBe(previousUser.id)

    expect(spyOnMailer).toHaveBeenCalledTimes(1)
    expect(spyOnMailer).toHaveBeenCalledWith(expect.objectContaining({
      subject: '[LCK_PUBLIC_PORTAL_NAME] Your email address has been used',
      to: 'signupuser@locokit.io',
    }))
  })

  it('throw a 429 if too many signups are registered', async () => {
    expect.assertions(1)
    const maxTries = parseInt(app.get('authentication').signup.rateLimit.max, 10)
    for (let i = 0; i < maxTries; i++) {
      await axios.post(getUrl('signup'), {
        name: `Signup user n°${i}`,
        email: `signupuser${i}@locokit.io`,
      })
    }
    try {
      await axios.post(getUrl('signup'), {
        name: 'Signup user n° too much',
        email: 'signupusertoomuch@locokit.io',
      })
    } catch (error: any) {
      expect(error.response.status).toBe(429)
    }
  })
})
