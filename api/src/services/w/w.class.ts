import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { resolveAll } from '@feathersjs/schema'

import type { WData, WResult, WQuery } from './w.schema'
import { wResolvers } from './w.resolver'

export const wHooks = {
  around: {
    all: [resolveAll(wResolvers)],
  },
  before: {},
  after: {},
  error: {},
}

export interface WParams extends KnexAdapterParams<WQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class WService extends KnexService<WResult, WData, WParams> {}
