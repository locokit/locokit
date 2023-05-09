import { createApp } from '../../app'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { SERVICES } from '@locokit/definitions'

describe("'mailer' service", () => {
  const app = createApp()
  const port = app.get('port') || 8998

  beforeAll(async () => {
    await app.listen(port)
  })
  it('registered the service', () => {
    const service = app.service(SERVICES.MISC_MAILER)
    expect(service).toBeTruthy()
  })

  it.todo('send a mail with default from contact@locokit.io if not set in config', () => {})
  afterAll(async () => {
    await app.teardown()
  })
})
