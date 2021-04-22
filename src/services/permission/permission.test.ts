import { LocalStrategy } from '@feathersjs/authentication-local/lib'
import { Forbidden, NotAcceptable, NotAuthenticated, NotFound } from '@feathersjs/errors'
import app from '../../app'
import { Group } from '../../models/group.model'
import { User } from '../../models/user.model'

describe('\'permission\' service', () => {
  let workspaceId: string
  let user1: User
  let group: Group
  let accessToken: string

  const filename: string = 'myFile.txt'
  beforeAll(async () => {
    /**
     * Create a new attachment on a workspace
     */
    const workspace = await app.service('workspace').create({ text: 'pouet' })
    workspaceId = workspace.id
    group = await app.service('group').create({
      workspace_id: workspaceId,
      name: 'pouet group',
    })
    const userEmail = 'user1-permission@locokit.io'
    const userPassword = 'locokit'
    const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
    const passwordHashed = await localStrategy.hashPassword(userPassword, {})

    user1 = await app.service('user')._create({
      name: 'User 1 Permission',
      email: userEmail,
      password: passwordHashed,
      isVerified: true,
    }, {})
    await app.service('attachment').create({
      workspace_id: workspaceId,
      filename,
      filepath: `${workspaceId}/${filename}`,
      mime: 'text/plain',
      ext: 'txt',
      size: 0,
    })

    const auth = await app.service('authentication').create({
      strategy: 'local',
      email: userEmail,
      password: userPassword,
    }, { })
    accessToken = auth.accessToken
  })

  it('registered the service', () => {
    const service = app.service('permission')
    expect(service).toBeTruthy()
  })

  it('throw an error if user is not authenticated', async () => {
    expect.assertions(1)
    await expect(app.service('permission')
      .find({
        provider: 'external',
        headers: {
          'x-original-uri': `/fs-storage/${workspaceId}/${filename}`,
        },
      }))
      .rejects.toThrow(NotAuthenticated)
  })
  it('throw an error if user doesnt have access to the workspace', async () => {
    expect.assertions(1)
    await expect(app.service('permission')
      .find({
        provider: 'external',
        headers: {
          'x-original-uri': `/fs-storage/${workspaceId}/${filename}`,
          Authorization: `Bearer ${accessToken}`,
        },
        authenticated: true,
        user: user1,
        accessToken,
      }))
      .rejects.toThrow(Forbidden)
  })
  it('throw an error if url is misformed', async () => {
    expect.assertions(1)
    await app.service('usergroup').create({
      group_id: group.id,
      user_id: user1.id,
    })
    await expect(app.service('permission')
      .find({
        provider: 'external',
        headers: {
          'x-original-uri': `fs-aze/${workspaceId}-${filename}`,
          Authorization: `Bearer ${accessToken}`,
        },
        authenticated: true,
        user: user1,
        accessToken,
      }))
      .rejects.toThrow(NotAcceptable)
  })
  it('throw an error if user have access to workspace but file doesnt exist', async () => {
    expect.assertions(1)
    await expect(app.service('permission')
      .find({
        provider: 'external',
        headers: {
          'x-original-uri': `/fs-storage/${workspaceId}/this-file-doesntexist.txt`,
          Authorization: `Bearer ${accessToken}`,
        },
        authenticated: true,
        user: user1,
        accessToken,
      }))
      .rejects.toThrow(NotFound)
  })
  it('let the user pass if he is a member of a workspace group, and the file exist', async () => {
    expect.assertions(1)
    const result = await app.service('permission')
      .find({
        provider: 'external',
        headers: {
          'x-original-uri': `/fs-storage/${workspaceId}/${filename}`,
          Authorization: `Bearer ${accessToken}`,
        },
        authenticated: true,
        user: user1,
        accessToken,
      })
    expect(result).toBe(true)
  })

  afterAll(async () => {
    await app.service('usergroup').remove(`${user1.id},${group.id}`)
    await app.service('group').remove(group.id)
    await app.service('user').remove(user1.id)
  })
})
