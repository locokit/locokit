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
    expect(tables.length).toBe(7)
  })
  it('retrieve table', async () => {
    const eventTable = await adapter.retrieveTable('event')
    expect(eventTable).toBeDefined()
    expect(eventTable.name).toBe('event')
  })
  it('give access to fields on a table', async () => {
    const eventTable = await adapter.retrieveTable('event')
    expect(eventTable.fields).toBeDefined()
    expect(eventTable.fields?.length).toBe(4)
  })

  it.todo('add new table')

  it.todo('remove a field on a table')

  it.todo('update a field on a table')

  it.todo('can sync a diff')
}
