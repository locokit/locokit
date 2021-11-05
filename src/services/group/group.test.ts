import app from '../../app'
import { SetupData, builderTestEnvironment } from '../../abilities/helpers'
import { Group } from '../../models/group.model'

describe('\'group\' service', () => {
  const builder = builderTestEnvironment('group-service')
  let setupData: SetupData

  beforeAll(async () => {
    setupData = await builder.setupWorkspace()
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
      provider: 'external',
      user: setupData.user2,
      accessToken: setupData.user2Authentication.accessToken,
      authenticated: true,
    }) as Group[]
    expect(groups.length).toBe(2)
    expect(groups.map(g => g.id).sort()).toMatchObject([
      setupData.group2.id,
      setupData.group3.id,
    ].sort())
  })

  afterAll(async () => {
    await builder.teardownWorkspace()
  })
})
