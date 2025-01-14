import { expect, it, suite } from 'vitest'
import { createAdapter } from '../src/index'

suite.skip('engine createAdapter function', () => {
  it('can create a pg adapter', async () => {
    expect.assertions(1)
    const adapter = await createAdapter({
      type: 'pg',
      options: process.env.VITE_POSTGRES_CONNECTION as string,
    })
    const schema = await adapter.retrieveSchema('public')
    expect(schema).toBeDefined()
  })

  it('can create a baserow adapter', async () => {
    expect.assertions(1)
    const adapter = await createAdapter({
      type: 'baserow',
      options: {
        apiURL: process.env.VITE_BASEROW_CONNECTION as string,
        tableIds: process.env.VITE_BASEROW_TABLE_IDS?.split(',').map((v) =>
          parseInt(v),
        ) as number[],
        token: process.env.VITE_BASEROW_TOKEN as string,
      },
    })
    const schema = await adapter.retrieveSchema()
    expect(schema).toBeDefined()
  })
})
