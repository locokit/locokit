import { app } from '../../app'

describe("'mailer' service", () => {
  it('registered the service', () => {
    const service = app.service('mailer')
    expect(service).toBeTruthy()
  })

  it('send a mail with default from contact@locokit.io if not set in config', () => {})
})
