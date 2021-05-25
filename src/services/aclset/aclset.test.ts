import app from '../../app'

describe('\'aclset\' service', () => {
  it('registered the service', () => {
    const service = app.service('aclset')
    expect(service).toBeTruthy()
  })
})
