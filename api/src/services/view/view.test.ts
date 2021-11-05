import app from '../../app'

describe('\'view\' service', () => {
  it('registered the service', () => {
    const service = app.service('view')
    expect(service).toBeTruthy()
  })
})
