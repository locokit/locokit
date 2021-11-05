import app from '../../app'

describe('\'acltable\' service', () => {
  it('registered the service', () => {
    const service = app.service('acltable')
    expect(service).toBeTruthy()
  })
})
