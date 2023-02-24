import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import axios from 'axios'
import { createApp } from './app'

const app = createApp()
const port = app.get('port')
const appUrl = `http://${app.get('host')}:${port}`

describe('Feathers application tests', () => {
  beforeAll(async () => {
    await app.listen(port)
  })

  afterAll(async () => {
    await app.teardown()
  })

  it('starts and shows the index page', async () => {
    expect.assertions(1)
    const { data } = await axios.get<string>(appUrl)

    expect(data.includes('<html lang="en">')).toBeDefined()
  })

  it('shows a 404 JSON error', async () => {
    expect.assertions(3)
    try {
      await axios.get(`${appUrl}/path/to/nowhere`, {
        responseType: 'json',
      })
      expect.fail('should never get here')
    } catch (error: any) {
      const { response } = error
      expect(response?.status).toStrictEqual(404)
      expect(response?.data?.code).toStrictEqual(404)
      expect(response?.data?.name).toStrictEqual('NotFound')
    }
  })

  it.todo("check that a workspace's schema role can't access the core schema")
  it.todo('check that a swagger is available for the api on swagger.json URL')
  it.todo('check that the swagger displays itself on swagger.html URL')
})
