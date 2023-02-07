import { USER_PROFILE } from '@locokit/definitions'
import assert from 'assert'
import { createApp } from '../../../app'

const app = createApp()

describe('authentication', () => {
  const userInfo = {
    email: 'someone@example.com',
    password: 'supersecret',
    profile: USER_PROFILE.MEMBER,
  }

  before(async () => {
    try {
      await app.service('user').create(userInfo)
    } catch (error) {
      // Do nothing, it just means the user already exists and can be tested
    }
  })

  it('authenticates user and creates accessToken', async () => {
    const { user, accessToken } = await app.service('authentication').create(
      {
        strategy: 'local',
        ...userInfo,
      },
      {},
    )

    assert.ok(accessToken, 'Created access token for user')
    assert.ok(user, 'Includes user in authentication data')
  })

  it('registered the authentication service', () => {
    assert.ok(app.service('authentication'))
  })

  it('can work in local strategy with the couple username/password too instead of email/password')
})
