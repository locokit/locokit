import { createApp } from '../../app'
import { describe, it, expect } from 'vitest'

const app = createApp()

describe("'mailer' service", () => {
  it('registered the service', () => {
    const service = app.service('mailer')
    expect(service).toBeTruthy()
  })

  it.todo('send a mail with default from contact@locokit.io if not set in config', () => {})
})
