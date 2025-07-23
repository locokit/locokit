import { createAdapter } from '../../../src'
import { SQLAdapter } from '../../../src/adapters/sql'
import { describe, expect, it } from 'vitest'
import { playDDLSuite } from '../../ddl.suite'
import { dropUnaccentExtension, configureEventDatasource } from './pg.init'
import { playDQLSuite } from '../../dql.suite'
import { playDMLSuite } from '../../dml.suite'
import knex from 'knex'

/**
 * Test suite for pg database
 */
const schemaName = 'lck-engine'
describe('engine pg adapter', () => {
  it('fail to create it if schema does not exist', async () => {
    await expect(
      createAdapter({
        type: 'pg',
        options: process.env.VITE_POSTGRES_CONNECTION as string,
        schema: 'schema-does-not-exist',
      }),
    ).rejects.toThrowError()
  })

  it('can create it if schema exist', async () => {
    const knexConnection = knex({
      client: 'pg',
      connection: process.env.VITE_POSTGRES_CONNECTION,
    })
    await configureEventDatasource(knexConnection, schemaName, true)

    await expect(
      createAdapter({
        type: 'pg',
        options: process.env.VITE_POSTGRES_CONNECTION as string,
        schema: 'lck-engine',
      }),
    ).resolves.toBeDefined()
  })

  describe('play the ddl suite', async () => {
    const knexConnection = knex({
      client: 'pg',
      connection: process.env.VITE_POSTGRES_CONNECTION,
    })
    await configureEventDatasource(knexConnection, schemaName, true)

    const adapter: SQLAdapter = (await createAdapter({
      type: 'pg',
      options: process.env.VITE_POSTGRES_CONNECTION as string,
      schema: 'lck-engine',
    })) as SQLAdapter

    playDDLSuite(adapter)
  })

  describe('play the dql suite', async () => {
    const knexConnection = knex({
      client: 'pg',
      connection: process.env.VITE_POSTGRES_CONNECTION,
    })
    await configureEventDatasource(knexConnection, schemaName, true)

    const adapter: SQLAdapter = (await createAdapter({
      type: 'pg',
      options: process.env.VITE_POSTGRES_CONNECTION as string,
      schema: 'lck-engine',
    })) as SQLAdapter

    playDQLSuite(adapter, dropUnaccentExtension(process.env.VITE_POSTGRES_CONNECTION as string))
  })
  describe('play the dml suite', async () => {
    const knexConnection = knex({
      client: 'pg',
      connection: process.env.VITE_POSTGRES_CONNECTION,
    })
    await configureEventDatasource(knexConnection, schemaName, true)

    const adapter: SQLAdapter = (await createAdapter({
      type: 'pg',
      options: process.env.VITE_POSTGRES_CONNECTION as string,
      schema: 'lck-engine',
    })) as SQLAdapter

    playDMLSuite(adapter)
  })
})
