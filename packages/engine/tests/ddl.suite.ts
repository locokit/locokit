import { GenericAdapter } from '../src'
import { expect, it } from 'vitest'

/**
 * Data Definition Language
 */
export function playDDLSuite(adapter: GenericAdapter) {
  /**
   * DDL
   */
  it('retrieve schema', async () => {
    const tables = await adapter.retrieveSchema('lck-engine')
    expect(tables.length).toBe(4)
  })
  it('retrieve table', async () => {
    const eventsTable = await adapter.retrieveTable('events')
    expect(eventsTable).toBeDefined()
    expect(eventsTable.name).toBe('events')
  })
  it('give access to fields on a table', async () => {
    const eventsTable = await adapter.retrieveTable('events')
    expect(eventsTable.fields).toBeDefined()
    expect(eventsTable.fields?.length).toBe(2)
  })

  it.todo('add new table')

  it.todo('remove a field on a table')

  it.todo('update a field on a table')

  it.todo('can sync a diff')
}
