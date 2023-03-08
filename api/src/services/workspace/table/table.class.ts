// import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'

import type { TableData, TableResult, TableQuery } from './table.schema'
import { ObjectionService } from '@/feathers-objection'

export interface TableParams extends KnexAdapterParams<TableQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class Table extends ObjectionService<TableResult, TableData, TableParams> {}
