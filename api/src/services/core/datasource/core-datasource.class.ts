import type { KnexAdapterParams } from '@feathersjs/knex'

import type {
  CoreDatasourceResult,
  CoreDatasourceQuery,
  CoreDatasourceData,
} from './core-datasource.schema'
import { ObjectionService } from '@/feathers-objection'

export interface CoreDatasourceParams extends KnexAdapterParams<CoreDatasourceQuery> {}

export class CoreDatasource extends ObjectionService<
  CoreDatasourceResult,
  CoreDatasourceData,
  CoreDatasourceParams
> {}
