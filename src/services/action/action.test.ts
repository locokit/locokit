import app from '../../app'

describe('\'attachment\' service', () => {
  it('registered the service', () => {
    const service = app.service('action')
    expect(service).toBeTruthy()
  })
})
