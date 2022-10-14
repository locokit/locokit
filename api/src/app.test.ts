import assert from 'assert'
import axios from 'axios'
import type { Server } from 'http'
import { app } from './app'

const port = app.get('port')
const appUrl = `http://${app.get('host')}:${port}`

describe('Feathers application tests', () => {
  let server: Server

  beforeAll(async () => {
    server = await app.listen(port)
  })

  afterAll(async () => {
    await app.teardown()
  })

  it('starts and shows the index page', async () => {
    const { data } = await axios.get<string>(appUrl)

    assert.ok(data.includes('<html lang="en">'))
  })

  it('shows a 404 JSON error', async () => {
    try {
      await axios.get(`${appUrl}/path/to/nowhere`, {
        responseType: 'json',
      })
      assert.fail('should never get here')
    } catch (error: any) {
      const { response } = error
      assert.strictEqual(response?.status, 404)
      assert.strictEqual(response?.data?.code, 404)
      assert.strictEqual(response?.data?.name, 'NotFound')
    }
  })
})
