// import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'

import type { TableData, TableResult, TableQuery } from './table.schema'
import { HookContext } from '../../../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '../../../../feathers-objection'

export const tableHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [
      (context: HookContext) => {
        console.log(context.params.route)
      },
    ],
  },
  after: {},
  error: {},
}

export interface TableParams extends KnexAdapterParams<TableQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class Table extends ObjectionService<
  TableResult,
  TableData,
  TableParams
> {}
