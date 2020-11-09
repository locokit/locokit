import app from '../../app'

describe('\'process_execution\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-execution')
    expect(service).toBeTruthy()
  })
})
