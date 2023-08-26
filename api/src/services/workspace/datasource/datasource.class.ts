import type { KnexAdapterParams } from '@feathersjs/knex'

import { ObjectionService } from '@/feathers-objection'

import type {
  WorkspaceDatasourceData,
  WorkspaceDatasourceResult,
  WorkspaceDatasourceQuery,
} from './datasource.schema'
import { Application } from '@/declarations'
import { Transaction } from 'objection'

export interface WorkspaceDatasourceParams extends KnexAdapterParams<WorkspaceDatasourceQuery> {}

export class WorkspaceDatasourceService extends ObjectionService<
  WorkspaceDatasourceResult,
  WorkspaceDatasourceData,
  WorkspaceDatasourceParams
> {
  app!: Application

  setup(app: Application) {
    this.app = app
  }

  async create(
    data: WorkspaceDatasourceData,
    params?: WorkspaceDatasourceParams,
  ): Promise<WorkspaceDatasourceResult>
  async create(
    data: WorkspaceDatasourceData[],
    params?: WorkspaceDatasourceParams,
  ): Promise<WorkspaceDatasourceResult[]>
  async create(
    data: WorkspaceDatasourceData | WorkspaceDatasourceData[],
    params?: WorkspaceDatasourceParams,
  ): Promise<WorkspaceDatasourceResult | WorkspaceDatasourceResult[]> {
    const currentDatasource = await this._create(data, params)

    /**
     * Create the dedicated schema for the current datasource
     * or all created datasources, depending their configuration
     */
    const knex = this.Model.knex()

    if (Array.isArray(currentDatasource)) {
      await Promise.all(
        currentDatasource.map(async (w) => {
          await knex
            .raw('SELECT core."createDatasourceSchema"(?)', w.id)
            .transacting(params?.transaction?.trx as Transaction)
        }),
      )
    } else {
      await knex
        .raw('SELECT core."createDatasourceSchema"(?)', currentDatasource.id)
        .transacting(params?.transaction?.trx as Transaction)
    }
    return currentDatasource
  }
}
