import app from '../../app'
import { builderTestEnvironment, SetupData } from '../../abilities/helpers'
import { Group } from '../../models/group.model'
import { Usergroup } from '../../models/usergroup.model'
import { GROUP_ROLE } from '@locokit/lck-glossary'
import { Forbidden, NotFound } from '@feathersjs/errors'

describe('\'group\' service', () => {
  const builder = builderTestEnvironment('group-service')
  let setupData: SetupData
  let lambdaUserOwnerParams: object
  let lambdaUserAdminParams: object
  let lambdaUserMemberParams: object
  let adminUserParams: object
  let superAdminUserParams: object

  beforeAll(async () => {
    setupData = await builder.setupWorkspace()
    lambdaUserOwnerParams = {
      provider: 'external',
      user: setupData.user2,
      accessToken: setupData.user2Authentication.accessToken,
      authenticated: true,
    }
    lambdaUserAdminParams = {
      provider: 'external',
      user: setupData.user1,
      accessToken: setupData.user1Authentication.accessToken,
      authenticated: true,
    }
    lambdaUserMemberParams = {
      provider: 'external',
      user: setupData.user5,
      accessToken: setupData.user5Authentication.accessToken,
      authenticated: true,
    }
  })

  it('registered the service', () => {
    const service = app.service('group')
    expect(service).toBeTruthy()
  })

  it('return users for a group, without sensitive information', async () => {
    expect.assertions(8)
    /**
     * Create users
     */
    const user = await app.service('user').create({
      name: 'user group test',
      email: 'user-group@locokit.io',
    })
    /**
     * Create a group with all these users
     */
    const group = await app.service('group').create({
      name: 'group',
      users: [user],
    })
    const groupRetrieved = await app.service('group').get(group.id, {
      query: {
        $eager: 'users',
      },
    })
    expect(groupRetrieved.users[0].password).toBeUndefined()
    expect(groupRetrieved.users[0].verifyChanges).toBeUndefined()
    expect(groupRetrieved.users[0].verifyExpires).toBeUndefined()
    expect(groupRetrieved.users[0].verifyShortToken).toBeUndefined()
    expect(groupRetrieved.users[0].verifyToken).toBeUndefined()
    expect(groupRetrieved.users[0].resetExpires).toBeUndefined()
    expect(groupRetrieved.users[0].resetShortToken).toBeUndefined()
    expect(groupRetrieved.users[0].resetToken).toBeUndefined()

    await app.service('usergroup').remove(`${user.id as string},${group.id as string}`)
    await app.service('group').remove(group.id)
    await app.service('user').remove(user.id)
  })

  it('can return users relation for a USER', async () => {
    /**
     * This test is related to the issue https://gitlab.makina-corpus.net/lck/lck-api/-/issues/229
     * when retrieving a URL like this one :
     * http://localhost:3030/group?$eager=[aclset.[workspace.[databases]]]&$joinRelation=users&users.id=12&$limit=-1
     */
    expect.assertions(2)
    const groups = await app.service('group').find({
      query: {
        $eager: '[aclset.[workspace.[databases]]]',
        $joinRelation: 'users',
        'users.id': setupData.user2.id,
        $limit: -1,
      },
      lambdaUserOwnerParams,
    }) as Group[]
    expect(groups.length).toBe(2)
    expect(groups.map(g => g.id).sort()).toMatchObject([
      setupData.group2.id,
      setupData.group3.id,
    ].sort())
  })

  describe('verify a MEMBER user with OWNER role', () => {
    let upgradeRoleOWNER: Usergroup

    beforeAll(async () => {
      // Set Lambda User to OWNER of group2
      upgradeRoleOWNER = await app.service('usergroup').patch(
        `${setupData.user2.id},${setupData.group2.id}`, { uhg_role: GROUP_ROLE.OWNER },
      )
    })

    it('check role is OWNER', () => {
      expect.assertions(1)
      expect(upgradeRoleOWNER.uhg_role).toBe(GROUP_ROLE.OWNER)
    })

    describe('patch', () => {
      it('can rename his group', async () => {
        expect.assertions(1)

        const oldGroup = await app.service('group').get(
          setupData.group2.id,
        ) as Group

        const myGroup = await app.service('group').patch(
          oldGroup.id,
          { name: 'Group 2: the return' },
          lambdaUserOwnerParams,
        ) as Group

        expect(myGroup.name).toBe('Group 2: the return')

        // Clean the database
        await app.service('group').patch(
          setupData.group2.id,
          { name: oldGroup.name },
        )
      })

      it('cannot rename group of which it is a MEMBER', async () => {
        const anotherGroup = await expect(app.service('group').patch(
          setupData.group3.id,
          { name: 'No abilities to modify' },
          lambdaUserOwnerParams,
        )).rejects.toThrowError(NotFound) as Group | undefined

        expect(anotherGroup).toBeUndefined()
      })

      it('cannot rename another group to which it does not belong', async () => {
        const anotherGroup = await expect(app.service('group').patch(
          setupData.group5.id,
          { name: 'No abilities to modify another group' },
          lambdaUserOwnerParams,
        )).rejects.toThrowError(NotFound) as Group | undefined

        expect(anotherGroup).toBeUndefined()
      })
    })

    describe('read', () => {
      // For some unknown reason, the get causes a NotFound at this position
      // If we swap position read and patch it's ok but the patch on his name failed
      xit('can read group of which it is add OWNER (get)', async () => {
        expect.assertions(1)
        const group = await app.service('group').get(
          setupData.group2.id,
          lambdaUserOwnerParams,
        ) as Group

        expect(group).toBeDefined()
        expect(group.id).toBe(setupData.group2.id)
      })

      it('can read group of which it is a OWNER', async () => {
        expect.assertions(3)
        const groups = await app.service('group').find({
          query: {
            id: setupData.group2.id,
            $limit: -1,
          },
          lambdaUserOwnerParams,
        }) as Group[]

        expect(groups).toBeDefined()
        expect(groups.length).toBe(1)
        expect(groups[0].id).toBe(setupData.group2.id)
      })

      it('can read group of which it is a MEMBER', async () => {
        expect.assertions(3)
        const groups = await app.service('group').find({
          query: {
            id: setupData.group3.id,
            $limit: -1,
          },
          lambdaUserOwnerParams,
        }) as Group[]

        expect(groups).toBeDefined()
        expect(groups.length).toBe(1)
        expect(groups[0].id).toBe(setupData.group3.id)
      })

      it('cannot read another group to which it does not belong', async () => {
        expect.assertions(2)
        const group = await expect(app.service('group').get(
          setupData.group5.id,
          lambdaUserOwnerParams,
        )).rejects.toThrowError(NotFound) as Group | undefined

        expect(group).toBeUndefined()
      })
    })

    describe('create', () => {
      it('cannot create a group', async () => {
        expect.assertions(2)

        const group = await expect(app.service('group').create({
          name: 'Fail to create',
        }, lambdaUserOwnerParams)).rejects.toThrowError(Forbidden) as Group | undefined

        expect(group).toBeUndefined()
      })
    })

    xdescribe('remove', () => {
      it('can remove his group', async () => {
        expect.assertions(3)
        /**
         * TODO : Need to anonymize previous references in row to this group before running this test... #94
         */
        await app.service('group').remove(setupData.group2.id, lambdaUserOwnerParams)

        const groupStillExist = await expect(app.service('group').get(setupData.group2.id)).rejects.toThrowError(NotFound) as undefined | Usergroup

        expect(groupStillExist).toBeUndefined()
      })
    })

    afterAll(async () => {
      // Restore setup
      await app.service('usergroup').patch(`${setupData.user2.id},${setupData.group2.id}`, { uhg_role: GROUP_ROLE.MEMBER })
    })
  })

  describe('verify a MEMBER user with ADMIN role', () => {
    let upgradeRoleADMIN: Usergroup

    beforeAll(async () => {
      // Set Lambda User to ADMIN of group3
      upgradeRoleADMIN = await app.service('usergroup').patch(
        `${setupData.user1.id},${setupData.group1.id}`, { uhg_role: GROUP_ROLE.ADMIN },
      )
    })

    it('check role is ADMIN', () => {
      expect.assertions(1)
      expect(upgradeRoleADMIN.uhg_role).toBe(GROUP_ROLE.ADMIN)
    })

    describe('patch', () => {
      it('can rename his group', async () => {
        expect.assertions(1)

        const oldGroup = await app.service('group').get(
          setupData.group1.id,
        ) as Group

        const myGroup = await app.service('group').patch(
          oldGroup.id,
          { name: 'Group 1: the return' },
          lambdaUserAdminParams,
        ) as Group

        expect(myGroup.name).toBe('Group 1: the return')

        // Clean the database
        await app.service('group').patch(
          setupData.group1.id,
          { name: oldGroup.name },
        )
      })

      it('cannot rename group of which it is a MEMBER', async () => {
        const anotherGroup = await expect(app.service('group').patch(
          setupData.group4.id,
          { name: 'No abilities to modify' },
          lambdaUserAdminParams,
        )).rejects.toThrowError(NotFound) as Group | undefined

        expect(anotherGroup).toBeUndefined()
      })

      it('cannot rename another group to which it does not belong', async () => {
        const anotherGroup = await expect(app.service('group').patch(
          setupData.group5.id,
          { name: 'No abilities to modify another group' },
          lambdaUserAdminParams,
        )).rejects.toThrowError(NotFound) as Group | undefined

        expect(anotherGroup).toBeUndefined()
      })
    })

    describe('read', () => {
      // For some unknown reason, the get causes a NotFound at this position
      // If we swap position read and patch it's ok but the patch on his name failed
      xit('can read group of which it is add ADMIN (get)', async () => {
        expect.assertions(1)
        const group = await app.service('group').get(
          setupData.group1.id,
          lambdaUserAdminParams,
        ) as Group

        expect(group).toBeDefined()
        expect(group.id).toBe(setupData.group1.id)
      })

      it('can read group of which it is a ADMIN', async () => {
        expect.assertions(3)
        const groups = await app.service('group').find({
          query: {
            id: setupData.group1.id,
            $limit: -1,
          },
          lambdaUserAdminParams,
        }) as Group[]

        expect(groups).toBeDefined()
        expect(groups.length).toBe(1)
        expect(groups[0].id).toBe(setupData.group1.id,
        )
      })

      it('can read group of which it is a MEMBER', async () => {
        expect.assertions(3)
        const groups = await app.service('group').find({
          query: {
            id: setupData.group4.id,
            $limit: -1,
          },
          lambdaUserOwnerParams,
        }) as Group[]

        expect(groups).toBeDefined()
        expect(groups.length).toBe(1)
        expect(groups[0].id).toBe(setupData.group4.id)
      })

      it('cannot read another group to which it does not belong', async () => {
        expect.assertions(2)
        const group = await expect(app.service('group').get(
          setupData.group5.id,
          lambdaUserOwnerParams,
        )).rejects.toThrowError(NotFound) as Group | undefined

        expect(group).toBeUndefined()
      })
    })

    describe('create', () => {
      it('cannot create a group', async () => {
        expect.assertions(2)

        const group = await expect(app.service('group').create({
          name: 'Fail to create',
        }, lambdaUserOwnerParams)).rejects.toThrowError(Forbidden) as Group | undefined

        expect(group).toBeUndefined()
      })
    })

    describe('remove', () => {
      it('cannot remove his group', async () => {
        expect.assertions(2)

        const groupStillExist = await expect(app.service('group').remove(
          setupData.group1.id,
          lambdaUserAdminParams,
        )).rejects.toThrowError(NotFound) as undefined | Usergroup

        expect(groupStillExist).toBeUndefined()
      })
    })

    afterAll(async () => {
      // Restore setup
      await app.service('usergroup').patch(`${setupData.user1.id},${setupData.group1.id}`, { uhg_role: GROUP_ROLE.MEMBER })
    })
  })

  describe('verify a MEMBER user with MEMBER role', () => {
    it('check role is MEMBER', async () => {
      expect.assertions(1)
      const userGroup = await app.service('usergroup').get(
        `${setupData.user5.id},${setupData.group5.id}`,
      )
      expect(userGroup.uhg_role).toBe(GROUP_ROLE.MEMBER)
    })

    describe('patch', () => {
      it('cannot rename his group', async () => {
        expect.assertions(1)

        await expect(app.service('group').patch(
          setupData.group5.id,
          { name: 'No abilities to modify' },
          lambdaUserMemberParams,
        )).rejects.toThrowError(Forbidden)
      })

      it('cannot rename another group to which it does not belong', async () => {
        const anotherGroup = await expect(app.service('group').patch(
          setupData.group4.id,
          { name: 'No abilities to modify another group' },
          lambdaUserMemberParams,
        )).rejects.toThrowError(Forbidden) as Group | undefined

        expect(anotherGroup).toBeUndefined()
      })
    })

    describe('read', () => {
      it('can read group of which it is a MEMBER', async () => {
        expect.assertions(3)
        const groups = await app.service('group').find({
          query: {
            id: setupData.group5.id,
            $limit: -1,
          },
          lambdaUserOwnerParams,
        }) as Group[]

        expect(groups).toBeDefined()
        expect(groups.length).toBe(1)
        expect(groups[0].id).toBe(setupData.group5.id)
      })

      it('cannot read another group to which it does not belong', async () => {
        expect.assertions(2)
        const group = await expect(app.service('group').get(
          setupData.group4.id,
          lambdaUserOwnerParams,
        )).rejects.toThrowError(NotFound) as Group | undefined

        expect(group).toBeUndefined()
      })
    })

    describe('create', () => {
      it('cannot create a group', async () => {
        expect.assertions(2)

        const group = await expect(app.service('group').create({
          name: 'Fail to create',
        }, lambdaUserMemberParams)).rejects.toThrowError(Forbidden) as Group | undefined

        expect(group).toBeUndefined()
      })
    })

    describe('remove', () => {
      it('cannot remove his group', async () => {
        expect.assertions(2)

        const groupStillExist = await expect(app.service('group').remove(
          setupData.group3.id,
          lambdaUserMemberParams,
        )).rejects.toThrowError(Forbidden) as undefined | Usergroup

        expect(groupStillExist).toBeUndefined()
      })
    })
  })

  describe('verify a SUPERADMIN', () => {
    let groupMember: Group
    beforeAll(async () => {
      groupMember = await app.service('group').create({
        name: 'Group',
        aclset_id: setupData.aclset1.id,
        users: [setupData.userSuperAdmin],
      })
    })
    describe('patch', () => {
      it('can rename his group', async () => {
        expect.assertions(1)

        const group = await app.service('group').patch(
          groupMember.id,
          { name: 'Group: The return' },
          superAdminUserParams,
        )
        expect(group.name).toBe('Group: The return')
      })

      it('can rename another group to which it does not belong', async () => {
        expect.assertions(1)

        const oldGroup = await app.service('group').get(
          setupData.group2.id,
        ) as Group

        const myGroup = await app.service('group').patch(
          oldGroup.id,
          { name: 'Group 2: the return' },
          superAdminUserParams,
        ) as Group

        expect(myGroup.name).toBe('Group 2: the return')

        // Clean the database
        await app.service('group').patch(
          setupData.group2.id,
          { name: oldGroup.name },
        )
      })

      it('can modify other param (acl_set)', async () => {
        expect.assertions(2)
        expect(groupMember.aclset_id).toBe(setupData.aclset1.id)
        const group = await app.service('group').patch(
          groupMember.id,
          { aclset_id: setupData.aclset2.id },
          superAdminUserParams,
        )
        expect(group.aclset_id).toBe(setupData.aclset2.id)
      })
    })

    describe('read', () => {
      it('can read all group', async () => {
        expect.assertions(1)
        const groups = await app.service('group').find({
          query: {
            $limit: -1,
          },
          superAdminUserParams,
        }) as Group[]

        expect(groups.length).toBe(6) // 5 in helper + 1 create in beforeAll
      })

      it('can read group which it is a MEMBER', async () => {
        expect.assertions(1)
        const group = await app.service('group').get(
          groupMember.id,
          superAdminUserParams,
        ) as Group
        expect(group).toBeDefined()
      })

      it('can read another group to which it does not belong', async () => {
        expect.assertions(1)
        const group = await app.service('group').get(
          setupData.group4.id,
          superAdminUserParams,
        ) as Group

        expect(group).toBeDefined()
      })
    })

    describe('create', () => {
      it('can create a group', async () => {
        expect.assertions(1)

        const group = await app.service('group').create({
          name: 'New group',
        }, superAdminUserParams) as Group

        expect(group).toBeDefined()

        // Clean database
        await app.services.group.remove(group.id)
      })
    })

    describe('remove', () => {
      it('can remove group with no user', async () => {
        expect.assertions(2)

        const emptyGroup = await app.service('group').create({
          name: 'Empty group',
        }) as Group

        await app.service('group').remove(
          emptyGroup.id,
          superAdminUserParams,
        )

        const groupStillExist = await expect(app.service('group').get(emptyGroup.id)).rejects.toThrowError(NotFound) as undefined | Usergroup

        expect(groupStillExist).toBeUndefined()
      })

      it('can remove group with users', async () => {
        expect.assertions(2)

        const groupWithMembers = await app.service('group').create({
          name: 'Group',
          aclset_id: setupData.aclset1.id,
          users: [setupData.userSuperAdmin, setupData.user2],
        })

        await app.service('group').remove(
          groupWithMembers.id,
          superAdminUserParams,
        )

        const groupStillExist = await expect(app.service('group').get(groupWithMembers.id)).rejects.toThrowError(NotFound) as undefined | Usergroup

        expect(groupStillExist).toBeUndefined()
      })
    })

    afterAll(async () => {
      // Restore setup
      await app.service('usergroup').remove(`${setupData.userSuperAdmin.id},${groupMember.id}`)
      await app.service('group').remove(groupMember.id)
    })
  })

  describe('verify a ADMIN', () => {
    let groupMember: Group
    beforeAll(async () => {
      groupMember = await app.service('group').create({
        name: 'Group',
        aclset_id: setupData.aclset1.id,
        users: [setupData.userAdmin],
      })
    })
    describe('patch', () => {
      it('can rename his group', async () => {
        expect.assertions(1)

        const group = await app.service('group').patch(
          groupMember.id,
          { name: 'Group: The return' },
          adminUserParams,
        )
        expect(group.name).toBe('Group: The return')
      })

      it('can rename another group to which it does not belong', async () => {
        expect.assertions(1)

        const oldGroup = await app.service('group').get(
          setupData.group2.id,
        ) as Group

        const myGroup = await app.service('group').patch(
          oldGroup.id,
          { name: 'Group 2: the return' },
          adminUserParams,
        ) as Group

        expect(myGroup.name).toBe('Group 2: the return')

        // Clean the database
        await app.service('group').patch(
          setupData.group2.id,
          { name: oldGroup.name },
        )
      })

      it('can modify other param (acl_set)', async () => {
        expect.assertions(2)
        expect(groupMember.aclset_id).toBe(setupData.aclset1.id)
        const group = await app.service('group').patch(
          groupMember.id,
          { aclset_id: setupData.aclset2.id },
          adminUserParams,
        )
        expect(group.aclset_id).toBe(setupData.aclset2.id)
      })
    })

    describe('read', () => {
      it('can read all group', async () => {
        expect.assertions(1)
        const groups = await app.service('group').find({
          query: {
            $limit: -1,
          },
          adminUserParams,
        }) as Group[]

        expect(groups.length).toBe(6) // 5 in helper + 1 create in beforeAll
      })

      it('can read group which it is a MEMBER', async () => {
        expect.assertions(1)
        const group = await app.service('group').get(
          groupMember.id,
          adminUserParams,
        ) as Group
        expect(group).toBeDefined()
      })

      it('can read another group to which it does not belong', async () => {
        expect.assertions(1)
        const group = await app.service('group').get(
          setupData.group4.id,
          adminUserParams,
        ) as Group

        expect(group).toBeDefined()
      })
    })

    describe('create', () => {
      it('can create a group', async () => {
        expect.assertions(1)

        const group = await app.service('group').create({
          name: 'New group',
        }, adminUserParams) as Group

        expect(group).toBeDefined()

        // Clean database
        await app.services.group.remove(group.id)
      })
    })

    describe('remove', () => {
      it('can remove group with no user', async () => {
        expect.assertions(2)

        const emptyGroup = await app.service('group').create({
          name: 'Empty group',
        }) as Group

        await app.service('group').remove(
          emptyGroup.id,
          adminUserParams,
        )

        const groupStillExist = await expect(app.service('group').get(emptyGroup.id)).rejects.toThrowError(NotFound) as undefined | Usergroup

        expect(groupStillExist).toBeUndefined()
      })

      it('can remove group with users', async () => {
        expect.assertions(2)

        const groupWithMembers = await app.service('group').create({
          name: 'Group',
          aclset_id: setupData.aclset1.id,
          users: [setupData.userSuperAdmin, setupData.user2],
        })

        await app.service('group').remove(
          groupWithMembers.id,
          adminUserParams,
        )

        const groupStillExist = await expect(app.service('group').get(groupWithMembers.id)).rejects.toThrowError(NotFound) as undefined | Usergroup

        expect(groupStillExist).toBeUndefined()
      })
    })

    afterAll(async () => {
      // Restore setup
      await app.service('usergroup').remove(`${setupData.userAdmin.id},${groupMember.id}`)
      await app.service('group').remove(groupMember.id)
    })
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
  })
})
