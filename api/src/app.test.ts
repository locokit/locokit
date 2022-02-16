import { Server } from 'http'
import url from 'url'
import axios from 'axios'

import app from './app'

const port = app.get('port') || 8998
const getUrl = (pathname?: string) => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname,
})

describe('Feathers application tests (with jest)', () => {
  let server: Server

  beforeAll(done => {
    server = app.listen(port)
    server.once('listening', () => done())
  })

  afterAll(done => {
    server.close(done)
  })

  it('starts and shows the index page', async () => {
    expect.assertions(1)

    const { data } = await axios.get(getUrl())

    expect(data.indexOf('<html lang="en">')).not.toBe(-1)
  })

  describe('404', () => {
    it('redirect to the html index page (text/html)', async () => {
      expect.assertions(2)
      const response = await axios.get(getUrl('path/to/nowhere'), {
        headers: {
          Accept: 'text/html',
        },
      })
      expect(response.status).toBe(200)
      expect(response.data).toContain('<html lang="en">')
    })

    it('redirect to the html index page (application/json)', async () => {
      expect.assertions(2)
      const response = await axios.get(getUrl('path/to/nowhere'))
      expect(response.status).toBe(200)
      expect(response.data).toContain('<html lang="en">')
    })
  })
})
