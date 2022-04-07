import { GROUP_ROLE, USER_PROFILE } from '@locokit/lck-glossary'
import app from '../../app'
import { Group as LckGroup } from '../../models/group.model'
import { User as LckUser } from '../../models/user.model'
import { MethodNotAllowed, NotFound } from '@feathersjs/errors'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { Usergroup } from '../../models/usergroup.model'

describe('\'usergroup\' service', () => {
  let group: LckGroup
  let lambdaUser: LckUser
  let adminUser: LckUser
  let superAdminUser: LckUser
  let lambdaParams: object
  let adminParams: object
  let superAdminParams: object

  beforeAll(async () => {
    // Default group
    group = await app.service('group').create({
      name: 'user group test',
    })

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
    expect(app.service('usergroup')).toBeTruthy()
  })

  it('throw if user_id doesn\'t exist', async () => {
    expect.assertions(1)
    await expect(app.service('usergroup').create({
      group_id: group.id,
    })).rejects.toThrow()
  })

  it('throw if group_id doesn\'t exist', async () => {
    expect.assertions(1)
    await expect(app.service('usergroup').create({
      user_id: lambdaUser.id,
    })).rejects.toThrow()
  })

  it('add existing user in an existing group', async () => {
    expect.assertions(3)
    const uhg = await app.service('usergroup').create({
      user_id: lambdaUser.id,
      group_id: group.id,
    })
    expect(uhg.uhg_role).toBe(GROUP_ROLE.MEMBER)
    expect(uhg.user_id).toBe(lambdaUser.id)
    expect(uhg.group_id).toBe(group.id)
    await app.service('usergroup').remove(`${uhg.user_id as number},${uhg.group_id as string}`)
  })

  it("prevent a user with USER's role to assign user to group", async () => {
    expect.assertions(1)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing create user',
    }) as LckUser

    const userGroup = await expect(app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
    }, lambdaParams)).rejects.toThrowError(MethodNotAllowed) as Usergroup | undefined
    // Clean the database whether the test succeeds or not
    if (userGroup) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  it("prevent a user with USER's role to modify user in a group", async () => {
    expect.assertions(2)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'Test',
    }) as LckUser

    const userGroup = await app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
      uhg_role: 'MEMBER',
    }) as Usergroup

    expect(userGroup.uhg_role).toBe('MEMBER')

    await expect(app.service('usergroup').patch(`${userGroup.user_id},${userGroup.group_id}`, {
      uhg_role: 'OWNER',
    }, lambdaParams)).rejects.toThrowError(MethodNotAllowed)

    // Clean the database whether the test succeeds or not
    if (userGroup) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  it("prevent a user with USER's role to remove user in a group", async () => {
    expect.assertions(1)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing create user',
    }) as LckUser

    const userGroup = await app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
    }) as Usergroup

    await expect(app.service('usergroup').remove(`${userGroup.user_id},${userGroup.group_id}`, lambdaParams)).rejects.toThrowError(MethodNotAllowed)

    // Clean the database whether the test succeeds or not
    if (userGroup) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  it('verify a SUPERADMIN user can assign user to group', async () => {
    expect.assertions(3)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'Test',
    }) as LckUser

    const userGroup = await app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
    }, superAdminParams)

    expect(userGroup.user_id).toBe(user.id)
    expect(userGroup.group_id).toBe(group.id)
    expect(userGroup.uhg_role).toBe('MEMBER')
    // Clean the database whether the test succeeds or not
    if (userGroup) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  it('verify a SUPERADMIN user can modify user to group', async () => {
    expect.assertions(2)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing create user',
    }) as LckUser

    const userGroup = await app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
      uhg_role: 'MEMBER',
    }) as Usergroup

    expect(userGroup.uhg_role).toBe('MEMBER')

    const userGroupUpdated = await app.service('usergroup').patch(`${userGroup.user_id},${userGroup.group_id}`, {
      uhg_role: 'OWNER',
    }, superAdminParams)

    expect(userGroupUpdated.uhg_role).toBe('OWNER')

    // Clean the database whether the test succeeds or not
    if (userGroup) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  it('verify a SUPERADMIN user can remove user to group', async () => {
    expect.assertions(2)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing create user',
    }) as LckUser

    const userGroup = await app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
    }) as Usergroup

    expect(userGroup).toBeDefined()
    await app.service('usergroup').remove(`${userGroup.user_id},${userGroup.group_id}`, superAdminParams)

    const userGroupStillExist = await expect(app.service('usergroup').get(`${userGroup.user_id},${userGroup.group_id}`)).rejects.toThrowError(NotFound) as undefined | Usergroup

    // Clean the database whether the test succeeds or not
    if (userGroupStillExist) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  it('verify a ADMIN user can assign user to group', async () => {
    expect.assertions(3)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'Test',
    }) as LckUser

    const userGroup = await app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
    }, adminParams)

    expect(userGroup.user_id).toBe(user.id)
    expect(userGroup.group_id).toBe(group.id)
    expect(userGroup.uhg_role).toBe('MEMBER')
    // Clean the database whether the test succeeds or not
    if (userGroup) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  it('verify a ADMIN user can modify user to group', async () => {
    expect.assertions(2)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing create user',
    }) as LckUser

    const userGroup = await app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
      uhg_role: 'MEMBER',
    }) as Usergroup

    expect(userGroup.uhg_role).toBe('MEMBER')

    const userGroupUpdated = await app.service('usergroup').patch(`${userGroup.user_id},${userGroup.group_id}`, {
      uhg_role: 'OWNER',
    }, adminParams)

    expect(userGroupUpdated.uhg_role).toBe('OWNER')

    // Clean the database whether the test succeeds or not
    if (userGroup) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  it('verify a ADMIN user can remove user to group', async () => {
    expect.assertions(2)

    const user = await app.service('user').create({
      email: 'originalUser@locokit.io',
      name: 'testing create user',
    }) as LckUser

    const userGroup = await app.service('usergroup').create({
      user_id: user.id,
      group_id: group.id,
    }) as Usergroup

    expect(userGroup).toBeDefined()
    await app.service('usergroup').remove(`${userGroup.user_id},${userGroup.group_id}`, adminParams)

    const userGroupStillExist = await expect(app.service('usergroup').get(`${userGroup.user_id},${userGroup.group_id}`)).rejects.toThrowError(NotFound) as undefined | Usergroup

    // Clean the database whether the test succeeds or not
    if (userGroupStillExist) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  afterAll(async () => {
    await app.service('user').remove(lambdaUser.id)
    await app.service('user').remove(adminUser.id)
    await app.service('user').remove(superAdminUser.id)
    await app.service('group').remove(group.id)
  })
})
