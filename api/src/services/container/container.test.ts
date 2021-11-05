import app from '../../app'

describe('\'container\' service', () => {
  it('registered the service', () => {
    const service = app.service('container')
    expect(service).toBeTruthy()
  })
})
