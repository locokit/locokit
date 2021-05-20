import app from '../../app'

describe('\'acl\' service', () => {
  it('registered the service', () => {
    const service = app.service('acl')
    expect(service).toBeTruthy()
  })
})
