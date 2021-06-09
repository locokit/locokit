import { NotAuthenticated } from '@feathersjs/errors'
import app from '../../app'

describe('\'user\' service', () => {
  it('registered the service', () => {
    const service = app.service('user')
    expect(service).toBeTruthy()
  })
  it('forbid access to users if not authenticated', async () => {
    expect.assertions(1)
    await expect(app.service('user').find({
      provider: 'external',
    })).rejects.toThrowError(NotAuthenticated)
  })
  it('lower case email when creating a new user', async () => {
    expect.assertions(1)
    const user = await app.service('user').create({
      email: 'TEST-azaPOI@lOcoKiT.IO',
      name: 'testing lower case',
    })
    expect(user.email).toBe('test-azapoi@locokit.io')
  })
})
