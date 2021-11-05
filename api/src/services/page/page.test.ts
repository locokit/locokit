import app from '../../app'

describe('\'page\' service', () => {
  it('registered the service', () => {
    const service = app.service('page')
    expect(service).toBeTruthy()
  })
})
