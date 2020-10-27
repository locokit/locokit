import app from '../../app'

describe('\'authManagement\' service', () => {
  it('registered the service', () => {
    const service = app.service('authManagement')
    expect(service).toBeTruthy()
  })
})
