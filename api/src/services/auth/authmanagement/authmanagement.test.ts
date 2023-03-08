import { Paginated } from '@feathersjs/feathers'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { createApp } from '../../../app'
import { UserResult } from '../user/user.schema'

vi.mock('../../mailer/mailer.class')

const app = createApp()

const credentials = {
  username: 'authmanagement+verifyExpires',
  email: 'authmanagement+verifyExpires@locokit.io',
}

function diffDays(verifyExpires?: string | number) {
  if (!verifyExpires) return null
  const d = new Date()
  return Math.round(
    (new Date(verifyExpires as string).valueOf() - d.valueOf()) / 1000 / 60 / 60 / 24,
  )
}

describe("'authManagement' service", () => {
  afterEach(async () => {
    // Clean DB
    const usersToRemove = (await app.service('user').find({
      query: {
        username: 'authmanagement+verifyExpires',
      },
    })) as Paginated<UserResult>

    await Promise.all(usersToRemove.data.map(async (u) => await app.service('user').remove(u.id)))
  })

  it('registered the service', () => {
    expect(app.service('auth-management')).toBeDefined()
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

  // implemented but need to be tester on several endpoints
  it.todo('does not send user information as a result, only username and id')
})
