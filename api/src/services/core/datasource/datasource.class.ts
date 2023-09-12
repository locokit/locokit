import type { KnexAdapterParams } from '@feathersjs/knex'

import type { DatasourceResult, DatasourceQuery, DatasourceData } from './datasource.schema'
import { ObjectionService } from '@/feathers-objection'

export interface DatasourceParams extends KnexAdapterParams<DatasourceQuery> {}

export class DatasourceService extends ObjectionService<
  DatasourceResult,
  DatasourceData,
  DatasourceParams
> {}
