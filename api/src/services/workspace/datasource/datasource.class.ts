// import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { Column as KnexInspectorColumn } from 'knex-schema-inspector/dist/types/column'
import { Table as KnexInspectorTable } from 'knex-schema-inspector/dist/types/table'
import { DB_TYPE } from '@locokit/definitions/src/fieldType'

import { ObjectionService } from '@/feathers-objection'

import type { DatasourceData, DatasourceResult, DatasourceQuery } from './datasource.schema'
import { Application } from '@/declarations'
import { Transaction } from 'objection'

export interface DatasourceParams extends KnexAdapterParams<DatasourceQuery> {}

export interface Migration {
  action: 'CREATE' | 'UPDATE' | 'REMOVE'
  target: 'TABLE' | 'FIELD' | 'RELATION'
  direction: 'METAMODEL' | 'DATASOURCE'
  settings: Partial<KnexInspectorTable> &
    Partial<KnexInspectorColumn> &
    Partial<{
      dbType: DB_TYPE
      documentation: string | null
      type: string | null
      nullable: boolean
      primary: boolean
      default: string | number | null
      foreign: boolean
      maxLength: number | null
      fromTable: string
      fromSchema: string | null
      fromField: string
      toTable: string | null
      toField: string
      toSchema: string | null
    }>
}

export class Datasource extends ObjectionService<
  DatasourceResult,
  DatasourceData,
  DatasourceParams
> {
  app!: Application

  setup(app: Application) {
    this.app = app
  }

  async create(data: DatasourceData, params?: DatasourceParams): Promise<DatasourceResult>
  async create(data: DatasourceData[], params?: DatasourceParams): Promise<DatasourceResult[]>
  async create(
    data: DatasourceData | DatasourceData[],
    params?: DatasourceParams,
  ): Promise<DatasourceResult | DatasourceResult[]> {
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
