import { LocalStrategy } from '@feathersjs/authentication-local/lib'
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors'
import { USER_PROFILE } from '@locokit/lck-glossary'
import app from '../../app'
import { User } from '../../models/user.model'
import { authManagementSettings } from '../authmanagement/authmanagement.settings'

describe('\'user\' service', () => {
  let creatorUser: User
  let adminUser: User
  let creatorParams: object
  let adminParams: object

  beforeAll(async () => {
    // User password
    const userPassword = 'add-wd-dependencies@locokit.io0'
    const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
    const passwordHashed = await localStrategy.hashPassword(userPassword, {})

    // Creator user
    const creatorEmail = 'creator@locokit.io'
    creatorUser = await app.service('user')._create({
      name: 'Jack',
      email: creatorEmail,
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.CREATOR,
    }, {})
    // Simulate the authentication
    const creatorAuthentication = await app.service('authentication').create({
      strategy: 'local',
      email: creatorEmail,
      password: userPassword,
    }, {})
    creatorParams = {
      provider: 'external',
      user: creatorUser,
      accessToken: creatorAuthentication.accessToken,
      authenticated: true,
    }

    // Admin user
    const adminEmail = 'admin@locokit.io'
    adminUser = await app.service('user')._create({
      name: 'Jack',
      email: adminEmail,
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.SUPERADMIN,
    }, {})

    // Simulate the authentication
    const adminAuthentication = await app.service('authentication').create({
      strategy: 'local',
      email: adminEmail,
      password: userPassword,
    }, {})
    // Params to simulate an outside call
    adminParams = {
      provider: 'external',
      user: adminUser,
      accessToken: adminAuthentication.accessToken,
      authenticated: true,
    }
  })
  it('registered the service', () => {
    const service = app.service('user')
    expect(service).toBeTruthy()
  })
  it('forbid access to users if not authenticated', async () => {
    expect.assertions(1)
    await expect(app.service('user').find({
      provider: 'external',
    })).rejects.toThrowError(NotAuthenticated)
  })
  it('lower case email when creating a new user', async () => {
    expect.assertions(1)
    const user = await app.service('user').create({
      email: 'TEST-azaPOI@lOcoKiT.IO',
      name: 'testing lower case',
    })
    expect(user.email).toBe('test-azapoi@locokit.io')
    if (user) await app.service('user').remove(user.id)
  })

  it('prevent a non superadmin user to patch the user email address', async () => {
    expect.assertions(1)
    let updatedUser: User | null = null
    try {
      updatedUser = await app.service('user').create({
        email: 'originalUser@locokit.io',
        name: 'testing patch email address',
      }) as User
      await expect(
        app.service('user').patch(updatedUser.id, {
          email: 'updatedUser@locokit.io',
        }, creatorParams),
      ).rejects.toThrowError(BadRequest)
    } finally {
      // Clean the database whether the test succeeds or not
      if (updatedUser) await app.service('user').remove(updatedUser.id)
    }
  })

  it('only allow admin user to patch the user email address', async () => {
    expect.assertions(4)
    let updatedUser: User | null = null
    try {
      updatedUser = await app.service('user').create({
        email: 'originalUser@locokit.io',
        name: 'testing patch email address',
      }) as User
      const spyOnCreateMail = jest.spyOn(app.service('mailer'), 'create').mockClear().mockResolvedValue(1)
      // Check that the update succeeds
      updatedUser = await app.service('user').patch(updatedUser.id,
        {
          email: 'updatedUser@locokit.io',
        },
        adminParams,
      ) as User
      expect(updatedUser.email).toBe('updateduser@locokit.io')
      // Check that two emails are sent to the old and the new email addresses
      expect(spyOnCreateMail).toHaveBeenCalledTimes(2)
      expect(spyOnCreateMail).toHaveBeenCalledWith(expect.objectContaining({
        to: 'originaluser@locokit.io',
      }))
      expect(spyOnCreateMail).toHaveBeenCalledWith(expect.objectContaining({
        to: 'updateduser@locokit.io',
      }))
    } finally {
      // Clean the database whether the test succeeds or not
      if (updatedUser) await app.service('user').remove(updatedUser.id)
    }
  })

  it('do not send emails if the admin user updated the user email address by keeping the old one', async () => {
    expect.assertions(2)
    let updatedUser: User | null = null
    try {
      updatedUser = await app.service('user').create({
        email: 'originalUser@locokit.io',
        name: 'testing patch email address',
      }) as User
      const spyOnCreateMail = jest.spyOn(app.service('mailer'), 'create').mockClear().mockResolvedValue(1)
      // Check that the update succeeds
      updatedUser = await app.service('user').patch(updatedUser.id,
        {
          email: 'originalUser@locokit.io',
        },
        adminParams,
      ) as User
      expect(updatedUser.email).toBe('originaluser@locokit.io')
      // No email must be sent
      expect(spyOnCreateMail).not.toHaveBeenCalled()
    } finally {
      // Clean the database whether the test succeeds or not
      if (updatedUser) await app.service('user').remove(updatedUser.id)
    }
  })

  afterAll(async () => {
    await app.service('user').remove(creatorUser.id)
    await app.service('user').remove(adminUser.id)
  })
})
