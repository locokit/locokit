import { LocalStrategy } from '@feathersjs/authentication-local/lib'
import { GROUP_ROLE, USER_PROFILE } from '@locokit/lck-glossary'
import app from '../../app'
import { Group } from '../../models/group.model'
import { User } from '../../models/user.model'
import { workspace } from '../../models/workspace.model'

describe('addWorkspaceDependencies hook', () => {
  it('configure the workspace with a db, aclset, without default group and a user if internal call (and so no user is authenticated)', async () => {
    expect.assertions(5)
    const workspaceCreated = await app.service('workspace').create({
      text: 'New workspace !',
    })
    expect(workspaceCreated).toBeDefined()
    expect(workspaceCreated.databases).toBeDefined()
    expect(workspaceCreated.databases.length).toBe(1)
    expect(workspaceCreated.aclsets).toBeDefined()
    expect(workspaceCreated.aclsets.length).toBe(1)

    await app.service('database').remove(workspaceCreated.databases[0].id)
    await app.service('aclset').remove(workspaceCreated.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspaceCreated.id)
  })
  it('configure the workspace with a db, aclset, default group and a user owner of the group', async () => {
    // Create a fake user
    const userEmail = 'add-wd-dependencies@locokit.io'
    const userPassword = 'add-wd-dependencies@locokit.io0'

    const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
    const passwordHashed = await localStrategy.hashPassword(userPassword, {})
    const user: User = await app.service('user')._create({
      name: 'Jack',
      email: userEmail,
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.CREATOR,
    }, {})

    // Simulate the authentication
    const authentication = await app.service('authentication').create({
      strategy: 'local',
      email: userEmail,
      password: userPassword,
    }, {})

    // Simulate an outside call
    const params = {
      provider: 'external',
      user,
      accessToken: authentication.accessToken,
      authenticated: true,
    }
    expect.assertions(11)
    const workspaceCreated: workspace = await app.service('workspace').create({
      text: 'New workspace !',
    }, params)
    expect(workspaceCreated).toBeDefined()
    expect(workspaceCreated.databases).toBeDefined()
    expect(workspaceCreated.databases?.length).toBe(1)
    expect(workspaceCreated.aclsets).toBeDefined()
    expect(workspaceCreated.aclsets?.length).toBe(1)
    expect(workspaceCreated.aclsets?.[0]?.groups).toBeDefined()
    expect(workspaceCreated.aclsets?.[0]?.groups?.length).toBe(1)

    const groupCreated: Group = await app.service('group').get(workspaceCreated.aclsets?.[0]?.groups?.[0]?.id as string, {
      query: {
        $eager: 'users',
      },
    })
    expect(groupCreated).toBeDefined()
    expect(groupCreated.users).toBeDefined()
    expect(groupCreated.users?.length).toBe(1)
    expect((groupCreated.users?.[0] as unknown as {uhg_role: string}).uhg_role).toBe(GROUP_ROLE.OWNER)

    await app.service('database').remove(workspaceCreated.databases?.[0]?.id as string)
    await app.service('usergroup').remove(`${user.id},${workspaceCreated.aclsets?.[0]?.groups?.[0].id}`)
    await app.service('group').remove(workspaceCreated.aclsets?.[0]?.groups?.[0].id as string)
    await app.service('aclset').remove(workspaceCreated.aclsets?.[0].id as string)
    await app.service('workspace').remove(workspaceCreated.id)
    await app.service('user').remove(user.id)
  })
})
