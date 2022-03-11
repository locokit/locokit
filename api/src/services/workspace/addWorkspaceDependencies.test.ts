import { LocalStrategy } from '@feathersjs/authentication-local/lib'
import { GROUP_ROLE, USER_PROFILE } from '@locokit/lck-glossary'
import app from '../../app'
import { Group } from '../../models/group.model'
import { User } from '../../models/user.model'
import { Workspace } from '../../models/workspace.model'
import { Database } from '../../models/database.model'
import { Page } from '../../models/page.model'
import { Paginated } from '@feathersjs/feathers'
import { dropWorkspace } from '../../utils/dropWorkspace'

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

    await dropWorkspace(app, workspaceCreated.id)
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
    expect.assertions(22)
    const workspaceCreated: Workspace = await app.service('workspace').create({
      text: 'New workspace !',
    }, params)

    expect(workspaceCreated).toBeDefined()
    expect(workspaceCreated.aclsets).toBeDefined()
    expect(workspaceCreated.aclsets?.length).toBe(1)
    expect(workspaceCreated.aclsets?.[0]?.groups).toBeDefined()
    expect(workspaceCreated.aclsets?.[0]?.groups?.length).toBe(1)

    const databases = await app.service('database').find({
      query: {
        workspace_id: workspaceCreated.id,
        $eager: '[tables.[columns, rows, views.[columns]]]',
      },
    }) as Paginated<Database>

    expect(databases).toBeDefined()
    expect(databases.data.length).toBe(1)
    expect(databases.data?.[0].tables?.length).toBe(1)
    expect(databases.data?.[0].tables?.[0].columns?.length).toBe(2)
    expect(databases.data?.[0].tables?.[0].rows?.length).toBe(5)
    expect(databases.data?.[0].tables?.[0].views?.length).toBe(1)
    expect(databases.data?.[0].tables?.[0].views?.[0].columns?.length).toBe(2)

    const groupId = workspaceCreated.aclsets?.[0]?.groups?.[0]?.id as string
    console.log(groupId)

    const groupCreated: Group = await app.service('group').get(groupId, {
      query: {
        $eager: 'users',
      },
    })
    expect(groupCreated).toBeDefined()
    expect(groupCreated.users).toBeDefined()
    expect(groupCreated.users?.length).toBe(1)
    expect((groupCreated.users?.[0] as unknown as {uhg_role: string}).uhg_role).toBe(GROUP_ROLE.OWNER)

    const pages = await app.service('page').find({
      query: {
        chapter_id: workspaceCreated.aclsets?.[0].chapter_id,
        $eager: '[containers.[blocks]]',
      },
    }) as Paginated<Page>

    expect(pages).toBeDefined()
    expect(pages.data.length).toBe(1)
    expect(pages.data[0]?.containers?.length).toBe(1)
    expect(pages.data[0]?.containers?.[0].blocks?.length).toBe(1)
    expect(pages.data[0]?.containers?.[0].blocks?.[0].type).toBe('TableSet')
    expect(pages.data[0]?.containers?.[0].blocks?.[0]?.settings?.id).toBe(databases.data?.[0].tables?.[0].views?.[0].id)

    await app.service('usergroup').remove(`${user.id as number},${workspaceCreated.aclsets?.[0]?.groups?.[0].id as string}`)
    await app.service('group').remove(workspaceCreated.aclsets?.[0]?.groups?.[0].id as string)
    await app.service('user').remove(user.id)
    await dropWorkspace(app, workspaceCreated.id)
  })
})
