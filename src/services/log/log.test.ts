import app from '../../app'

describe('\'log\' service', () => {
  it('registered the service', () => {
    const service = app.service('log')
    expect(service).toBeTruthy()
  })
})
