import app from '../../app'

describe('\'trr\' service', () => {
  it('registered the service', () => {
    const service = app.service('trr')
    expect(service).toBeTruthy()
  })
})
