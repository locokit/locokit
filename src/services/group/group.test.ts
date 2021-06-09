import app from '../../app'

describe('\'group\' service', () => {
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
})
