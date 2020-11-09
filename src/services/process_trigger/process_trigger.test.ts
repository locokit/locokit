import app from '../../app'

describe('\'process_trigger\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-trigger')
    expect(service).toBeTruthy()
  })
})
