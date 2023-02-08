import { describe, it, expect } from 'vitest'
import { createApp } from '../../../app'

const app = createApp()

const credentials = {
  username: 'authmanagement+verifyExpires',
  email: 'authmanagement+verifyExpires@locokit.io',
}

function diffDays(verifyExpires?: string | number) {
  if (!verifyExpires) return null
  const d = new Date()
  return Math.trunc(
    (new Date(verifyExpires as string).valueOf() - d.valueOf()) / 1000 / 60 / 60 / 24,
  )
}

describe("'authManagement' service", () => {
  it('registered the service', () => {
    expect(app.service('auth-management')).toBeTruthy()
  })

  it('register a new user and set the verifyExpires accordingly setting', async () => {
    /**
     * The variable in test.json is set to 10 days,
     * we need to compute the delta between current date and verifyExpires date,
     * it must be 10 days
     * We don't care about hours in this case.
     */
    expect.assertions(1)
    const user = await app.service('user').create(credentials)
    expect(diffDays(user.verifyExpires)).toBe(10)
  })

  it('register a new user and set the verifyExpires to default (5) when the setting is null', async () => {
    app.get('settings').signup.verificationMailDelayDays = undefined

    expect.assertions(1)
    const user = await app.service('user').create(credentials)
    expect(diffDays(user.verifyExpires)).toBe(5)
  })

  it.todo('allows a user to register and choose its password with the verifyToken')
})
