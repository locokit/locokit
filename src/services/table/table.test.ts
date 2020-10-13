import app from '../../app'

describe('\'table\' service', () => {
  it('registered the service', () => {
    const service = app.service('table')
    expect(service).toBeTruthy()
  })
})
