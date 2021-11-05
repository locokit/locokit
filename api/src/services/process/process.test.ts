import app from '../../app'

describe('\'process\' service', () => {
  it('registered the service', () => {
    const service = app.service('process')
    expect(service).toBeTruthy()
  })
})
