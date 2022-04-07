import { GROUP_ROLE } from '@locokit/lck-glossary'
import app from '../../app'
import { Group as LckGroup } from '../../models/group.model'
import { User as LckUser } from '../../models/user.model'
import { MethodNotAllowed, NotFound } from '@feathersjs/errors'
import { Usergroup } from '../../models/usergroup.model'
import { builderTestEnvironment, SetupData } from '../../abilities/helpers'

describe('\'usergroup\' service', () => {
  let group: LckGroup
  let setupData: SetupData
  const builder = builderTestEnvironment('user')
  let lambdaUserParams: object
  let adminUserParams: object
  let superAdminUserParams: object

  beforeAll(async () => {
    // Default group
    group = await app.service('group').create({
      name: 'user group test',
    })

    /**
     * Create a workspace with default user and authentication
     */
    setupData = await builder.setupWorkspace()
    lambdaUserParams = {
      provider: 'external',
      user: setupData.user2,
      accessToken: setupData.user2Authentication.accessToken,
      authenticated: true,
    }
    adminUserParams = {
      provider: 'external',
      user: setupData.userAdmin,
      accessToken: setupData.userAdminAuthentication.accessToken,
      authenticated: true,
    }
    superAdminUserParams = {
      provider: 'external',
      user: setupData.userSuperAdmin,
      accessToken: setupData.userSuperAdminAuthentication.accessToken,
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
      user_id: setupData.user2.id,
    })).rejects.toThrow()
  })

  it('add existing user in an existing group', async () => {
    expect.assertions(3)
    const uhg = await app.service('usergroup').create({
      user_id: setupData.user2.id,
      group_id: group.id,
    })
    expect(uhg.uhg_role).toBe(GROUP_ROLE.MEMBER)
    expect(uhg.user_id).toBe(setupData.user2.id)
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
    }, lambdaUserParams)).rejects.toThrowError(MethodNotAllowed) as Usergroup | undefined
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
    }, lambdaUserParams)).rejects.toThrowError(MethodNotAllowed)

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

    await expect(app.service('usergroup').remove(`${userGroup.user_id},${userGroup.group_id}`, lambdaUserParams)).rejects.toThrowError(MethodNotAllowed)

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
    }, superAdminUserParams)

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
    }, superAdminUserParams)

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
    await app.service('usergroup').remove(`${userGroup.user_id},${userGroup.group_id}`, superAdminUserParams)

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
    }, adminUserParams)

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
    }, adminUserParams)

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
    await app.service('usergroup').remove(`${userGroup.user_id},${userGroup.group_id}`, adminUserParams)

    const userGroupStillExist = await expect(app.service('usergroup').get(`${userGroup.user_id},${userGroup.group_id}`)).rejects.toThrowError(NotFound) as undefined | Usergroup

    // Clean the database whether the test succeeds or not
    if (userGroupStillExist) await app.service('usergroup').remove(`${userGroup.user_id as number},${userGroup.group_id as string}`)
    if (user) await app.service('user').remove(user.id)
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
    await app.service('group').remove(group.id)
  })
})
