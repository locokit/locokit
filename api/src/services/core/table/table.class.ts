// import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'

import type { TableResult, TableQuery } from './table.schema'
import { ObjectionService } from '@/feathers-objection'

export interface TableParams extends KnexAdapterParams<TableQuery> {}

export class Table extends ObjectionService<
  TableResult,
  Partial<TableResult>,
  TableParams
> {}
