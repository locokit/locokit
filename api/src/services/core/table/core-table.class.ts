// import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'

import type { CoreTableResult, CoreTableQuery } from './core-table.schema'
import { ObjectionService } from '@/feathers-objection'

export interface CoreTableParams extends KnexAdapterParams<CoreTableQuery> { }

export class CoreTable extends ObjectionService<
  CoreTableResult,
  Partial<CoreTableResult>,
  CoreTableParams
> { }
