import { LocalStrategy } from '@feathersjs/authentication-local/lib'
import { MethodNotAllowed, NotAuthenticated } from '@feathersjs/errors'
import { USER_PROFILE } from '@locokit/lck-glossary'
import app from '../../app'
import { User } from '../../models/user.model'

describe('\'user\' service', () => {
  let lambdaUser: User
  let adminUser: User
  let superAdminUser: User
  let lambdaParams: object
  let adminParams: object
  let superAdminParams: object

  beforeAll(async () => {
    // User password
    const userPassword = 'add-wd-dependencies@locokit.io0'
    const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
    const passwordHashed = await localStrategy.hashPassword(userPassword, {})

    // Lambda user
    const lambdaEmail = 'lambda@locokit.io'
    lambdaUser = await app.service('user')._create({
      name: 'Ellie',
      email: lambdaEmail,
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.USER,
    }, {})

    // Simulate the authentication
    const lambdaAuthentication = await app.service('authentication').create({
      strategy: 'local',
      email: lambdaEmail,
      password: userPassword,
    }, {})
    lambdaParams = {
      provider: 'external',
      user: lambdaUser,
      accessToken: lambdaAuthentication.accessToken,
      authenticated: true,
    }

    // Admin user
    const adminEmail = 'admin@locokit.io'
    adminUser = await app.service('user')._create({
      name: 'Abby',
      email: adminEmail,
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.ADMIN,
    }, {})

    // Simulate the authentication
    const adminAuthentication = await app.service('authentication').create({
      strategy: 'local',
      email: adminEmail,
      password: userPassword,
    }, {})
    adminParams = {
      provider: 'external',
      user: adminUser,
      accessToken: adminAuthentication.accessToken,
      authenticated: true,
    }

    // SuperAdmin user
    const superAdminEmail = 'jacksuperadmin@locokit.io'
    superAdminUser = await app.service('user')._create({
      name: 'Jack',
      email: superAdminEmail,
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.SUPERADMIN,
    }, {})

    // Simulate the authentication
    const superAdminAuthentication = await app.service('authentication').create({
      strategy: 'local',
      email: superAdminEmail,
      password: userPassword,
    }, {})
    // Params to simulate an outside call
    superAdminParams = {
      provider: 'external',
      user: superAdminUser,
      accessToken: superAdminAuthentication.accessToken,
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
    }, superAdminParams)
    expect(user.email).toBe('test-azapoi@locokit.io')
    if (user) await app.service('user').remove(user.id)
  })

  it("prevent a user with USER's role to create new user", async () => {
    expect.assertions(1)

    const user = await expect(app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing create user',
    }, lambdaParams)).rejects.toThrowError(MethodNotAllowed) as User | undefined
    // Clean the database whether the test succeeds or not
    if (user) await app.service('user').remove(user.id)
  })

  it("authorize a superAdmin with SUPERADMIN's role to create new user", async () => {
    expect.assertions(1)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing create user by SUPERADMIN',
    }, superAdminParams) as User
    // Clean the database whether the test succeeds or not
    expect(user.name).toBe('testing create user by SUPERADMIN')
    if (user) await app.service('user').remove(user.id)
  })

  it('prevent a non SUPERADMIN user to patch the blocked property', async () => {
    expect.assertions(1)
    let updatedUser: User | null = null
    try {
      updatedUser = await app.service('user').create({
        email: 'originalUser@locokit.io',
        name: 'testing patch the blocked property',
      }) as User
      await expect(
        app.service('user').patch(updatedUser.id, {
          blocked: true,
        }, lambdaParams),
      ).rejects.toThrowError(MethodNotAllowed)
    } finally {
      // Clean the database whether the test succeeds or not
      if (updatedUser) await app.service('user').remove(updatedUser.id)
    }
  })

  it('only allow SUPERADMIN user to patch the blocked attribute', async () => {
    expect.assertions(5)
    let updatedUser: User | null = null
    try {
      updatedUser = await app.service('user').create({
        email: 'originalUser@locokit.io',
        name: 'testing patch email address',
      }) as User
      const spyOnCreateMail = jest.spyOn(app.service('mailer'), 'create').mockClear().mockResolvedValue(1)
      // Disable the account
      updatedUser = await app.service('user').patch(updatedUser.id,
        {
          blocked: true,
        },
        superAdminParams,
      ) as User
      expect(updatedUser.blocked).toBe(true)
      // Enable the account
      updatedUser = await app.service('user').patch(updatedUser.id,
        {
          blocked: false,
        },
        superAdminParams,
      ) as User
      expect(updatedUser.blocked).toBe(false)
      // Check that an email is sent to the user to inform that is account has been disabled
      expect(spyOnCreateMail).toHaveBeenCalledTimes(2)
      expect(spyOnCreateMail).toHaveBeenCalledWith(expect.objectContaining({
        to: 'originaluser@locokit.io',
        subject: '[LCK_PUBLIC_PORTAL_NAME] Your account has been disabled',
      }))
      // Check that an email is sent to the user to inform that is account has been enabled
      expect(spyOnCreateMail).toHaveBeenCalledWith(expect.objectContaining({
        to: 'originaluser@locokit.io',
        subject: '[LCK_PUBLIC_PORTAL_NAME] Your account has been enabled',
      }))
    } finally {
      // Clean the database whether the test succeeds or not
      if (updatedUser) await app.service('user').remove(updatedUser.id)
    }
  })

  it('do not send an email if the SUPERADMIN user updates the blocked attribute by keeping the same value', async () => {
    expect.assertions(2)
    let updatedUser: User | null = null
    try {
      updatedUser = await app.service('user').create({
        email: 'originalUser@locokit.io',
        name: 'testing patch email address',
        blocked: false,
      }) as User
      const spyOnCreateMail = jest.spyOn(app.service('mailer'), 'create').mockClear().mockResolvedValue(1)
      // Check that the update succeeds
      updatedUser = await app.service('user').patch(updatedUser.id,
        {
          blocked: false,
        },
        superAdminParams,
      ) as User
      expect(updatedUser.blocked).toBe(false)
      // No email must be sent
      expect(spyOnCreateMail).not.toHaveBeenCalled()
    } finally {
      // Clean the database whether the test succeeds or not
      if (updatedUser) await app.service('user').remove(updatedUser.id)
    }
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
        }, lambdaParams),
      ).rejects.toThrowError(MethodNotAllowed)
    } finally {
      // Clean the database whether the test succeeds or not
      if (updatedUser) await app.service('user').remove(updatedUser.id)
    }
  })

  it('prevent a non superadmin user to patch the user information', async () => {
    expect.assertions(3)

    let updatedUser: User | undefined
    try {
      updatedUser = await app.service('user').create({
        email: 'originalUser@locokit.io',
        name: 'testing patch name',
      }, lambdaUser) as User
      const updatedUserFailed = await expect(app.service('user').patch(updatedUser.id,
        {
          name: 'testing patch name with user account',
        },
        lambdaParams,
      )).rejects.toThrowError(MethodNotAllowed) as User | undefined
      expect(updatedUser.name).not.toBe('testing patch name with user account')
      expect(updatedUserFailed).toBeUndefined()
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
        superAdminParams,
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
        superAdminParams,
      ) as User
      expect(updatedUser.email).toBe('originaluser@locokit.io')
      // No email must be sent
      expect(spyOnCreateMail).not.toHaveBeenCalled()
    } finally {
      // Clean the database whether the test succeeds or not
      if (updatedUser) await app.service('user').remove(updatedUser.id)
    }
  })

  it('prevent a non superadmin user to remove user', async () => {
    expect.assertions(2)

    const updatedUser = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing patch name',
    }, lambdaUser) as User

    const tryRemoveUser = await expect(
      app.service('user').remove(updatedUser.id, lambdaParams)).rejects.toThrowError(MethodNotAllowed) as User | undefined

    expect(tryRemoveUser).toBeUndefined()
    // Clean the database whether the test succeeds or not
    if (updatedUser) await app.service('user').remove(updatedUser.id)
  })

  afterAll(async () => {
    await app.service('user').remove(lambdaUser.id)
    await app.service('user').remove(adminUser.id)
    await app.service('user').remove(superAdminUser.id)
  })
})
