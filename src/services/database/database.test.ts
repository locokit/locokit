import app from '../../app'

describe('\'database\' service', () => {
  it('registered the service', () => {
    const service = app.service('database')
    expect(service).toBeTruthy()
  })
})
