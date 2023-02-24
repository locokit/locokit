// import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { resolveData } from '@feathersjs/schema'

import type { DatasourceData, DatasourceResult, DatasourceQuery } from './datasource.schema'
import { datasourceResolvers } from './datasource.resolver'
import { HookContext } from '../../../declarations'
import { authenticate } from '@feathersjs/authentication'
import { ObjectionService } from '../../../feathers-objection'

export const datasourceHooks = {
  around: {
    all: [authenticate('jwt')],
  },
  before: {
    all: [
      (context: HookContext) => {
        console.log(context.params.route)
      },
    ],
    create: [resolveData(datasourceResolvers.data.create)],
  },
  after: {},
  error: {},
}

export interface DatasourceParams extends KnexAdapterParams<DatasourceQuery> {}

export class Datasource extends ObjectionService<
  DatasourceResult,
  DatasourceData,
  DatasourceParams
> {
  /**
   * This custom method will analyze diffs
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  diff() {}

  /**
   * This custom method will sync all updates
   * between real schema and meta model stored in LocoKit
   *
   * Real schema > Meta model
   */
  sync() {}
}
