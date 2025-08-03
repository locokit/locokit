import { SERVICES } from '@locokit/shared'
import { describe, it, assert } from 'vitest'
import { createApp } from '../../../app'

describe('[core] policy service', () => {
  const app = createApp()
  it('registered the service', () => {
    const service = app.service(SERVICES.WORKSPACE_POLICY)

    assert.ok(service, 'Registered the service')
  })
  it.todo('restrict access to this endpoint according abilities')
})
