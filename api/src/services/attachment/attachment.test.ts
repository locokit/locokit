import app from '../../app'

describe('\'attachment\' service', () => {
  it('registered the service', () => {
    const service = app.service('attachment')
    expect(service).toBeTruthy()
  })
})
