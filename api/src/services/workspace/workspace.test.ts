import assert from 'assert'
import { createApp } from '../../app'

describe('workspace service', () => {
  const app = createApp()
  it('registered the service', () => {
    const service = app.service('workspace')

    assert.ok(service, 'Registered the service')
  })
})
