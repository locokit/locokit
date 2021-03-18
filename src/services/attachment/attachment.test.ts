import app from '../../src/app'

describe('\'attachment\' service', () => {
  it('registered the service', () => {
    const service = app.service('attachment')
    expect(service).toBeTruthy()
  })
})
