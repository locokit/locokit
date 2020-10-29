import { LocalStrategy } from '@feathersjs/authentication-local/lib/strategy'
import app from '../../app'
import { User } from '../../models/user.model'
jest.mock('../mailer/mailer.class.ts')

describe('authentication', () => {
  it('registered the authentication service', () => {
    expect(app.service('authentication')).toBeTruthy()
  })

  describe('local strategy', () => {
    const userInfo = {
      email: 'locokit@locokit.io',
      name: 'Someone !'
    }
    const password = 'supersecret'
    let user: User

    beforeAll(async () => {
      try {
        user = await app.service('user').create(userInfo)
      } catch (error) {
        // Do nothing, it just means the user already exists and can be tested
        console.error(error.message)
      }
    })

    it('fail on authent if user is not verified', async () => {
      await expect(app.service('authentication').create({
        strategy: 'local',
        ...userInfo
      }, {})).rejects.toThrow()
    })

    it('authenticates user and creates accessToken', async () => {
      const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
      const passwordHashed = await localStrategy.hashPassword('supersecret', {})
      await app.service('user')._patch(user.id, {
        isVerified: true,
        password: passwordHashed
      }, {})

      const { user: newUser2, accessToken } = await app.service('authentication').create({
        strategy: 'local',
        email: userInfo.email,
        password
      }, {})

      expect(accessToken).toBeTruthy()
      expect(newUser2).toBeTruthy()
    })

    afterAll(async () => {
      await app.service('user').remove(user.id)
    })
  })
})
