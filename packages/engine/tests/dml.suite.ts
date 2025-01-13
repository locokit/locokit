import { GenericAdapter } from '../src'
import { it } from 'vitest'

/**
 * Data Manipulation Language suite
 */
export function playDMLSuite(
  adapter: GenericAdapter,
  configuration?: {
    geojsonShouldFail: boolean
  },
) {
  /**
   * DML
   */
  it.todo('can insert new data')
  it.todo('can patch data')
  it.todo('can update data')
  it.todo('can delete data')
}
