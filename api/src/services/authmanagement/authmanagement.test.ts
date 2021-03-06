import app from '../../app'
import { User } from '../../models/user.model'

describe('\'authManagement\' service', () => {
  it('registered the service', () => {
    expect(app.service('authManagement')).toBeTruthy()
  })

  it('register a new user and set the verifyExpires accordingly setting', async () => {
    /**
     * The variable in test.json is set to 10 days,
     * we need to compute the delta between current date and verifyExpires date,
     * it must be 10 days
     * We don't care about hours in this case.
     */
    expect.assertions(1)
    const d = new Date()
    const user = await app.service('user').create({
      email: 'authmanagement+verifyExpires@locokit.io',
      name: 'Auth management user test for verifyExpires',
    }) as User
    const diffDays = Math.trunc((new Date(user.verifyExpires as string).valueOf() - d.valueOf()) / 1000 / 60 / 60 / 24)
    expect(diffDays).toBe(10)
  })
})
