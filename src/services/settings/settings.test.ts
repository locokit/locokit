import app from '../../app'

describe('\'settings\' service', () => {
  it('registered the service', () => {
    const service = app.service('settings')
    expect(service).toBeTruthy()
  })

  it('the find method return the right specified settings', async () => {
    const resultSettings = await app.service('settings').find()
    // We defined the test env ALLOW_SIGNUP property to 'true'
    expect(resultSettings.allow_signup).toBe(true)
  })
})
