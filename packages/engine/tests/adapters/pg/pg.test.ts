import { createAdapter } from '../../../src'
import { SQLAdapter } from '../../../src/adapters/sql'
import { describe, expect, it } from 'vitest'
import { playDDLSuite } from '../../ddl.suite'
import { dropUnaccentExtension, initDatasource } from './pg.init'
import { playDQLSuite } from '../../dql.suite'

/**
 * Test suite for pg database
 */
describe('engine pg adapter', () => {
  it.skip('fail to create it if schema does not exist', async () => {
    await expect(
      createAdapter({
        type: 'pg',
        options: process.env.VITE_POSTGRES_CONNECTION as string,
        schema: 'pouet',
      }),
    ).rejects.toThrowError()
  })

  it.skip('can create it if schema exist', async () => {
    await initDatasource(process.env.VITE_POSTGRES_CONNECTION as string)

    await expect(
      createAdapter({
        type: 'pg',
        options: process.env.VITE_POSTGRES_CONNECTION as string,
        schema: 'lck-engine',
      }),
    ).resolves.toBeDefined()
  })

  describe.skip('play the ddl suite', async () => {
    await initDatasource(process.env.VITE_POSTGRES_CONNECTION as string)

    const adapter: SQLAdapter = (await createAdapter({
      type: 'pg',
      options: process.env.VITE_POSTGRES_CONNECTION as string,
      schema: 'lck-engine',
    })) as SQLAdapter

    playDDLSuite(adapter)
  })

  describe('play the dql suite', async () => {
    await initDatasource(process.env.VITE_POSTGRES_CONNECTION as string)

    const adapter: SQLAdapter = (await createAdapter({
      type: 'pg',
      options: process.env.VITE_POSTGRES_CONNECTION as string,
      schema: 'lck-engine',
    })) as SQLAdapter

    playDQLSuite(adapter, dropUnaccentExtension(process.env.VITE_POSTGRES_CONNECTION as string))
  })
  // describe('play the dml suite', () => {
  //   playDDLSuite(adapter)
  // })
})
