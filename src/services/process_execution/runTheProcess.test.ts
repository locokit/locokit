import app from '../../app'

describe('\'runTheProcess\' hook', () => {
  it('registered the service', () => {
    const service = app.service('process-trigger')
    expect(service).toBeTruthy()
  })
})
