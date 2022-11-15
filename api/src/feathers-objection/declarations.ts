import {
  RelationExpression,
  Model,
  JSONSchema,
  QueryBuilder,
  Transaction,
} from 'objection'
import {
  AdapterServiceOptions,
  AdapterParams,
  AdapterQuery,
} from '@feathersjs/adapter-commons'

export interface ObjectionAdapterOptions extends AdapterServiceOptions {
  Model: typeof Model
  name: string
  schema?: string

  /**
   * id field primary keys separator char
   * used for composite keys
   */
  idSeparator?: string

  /**
   * operators whitelisted
   */
  whitelist?: string[]

  /**
   * database id field
   */
  id?: string

  jsonSchema?: JSONSchema //  = options.model.jsonSchema
  allowedEager?: string[] //  = options.allowedEager
  eagerOptions?: any //  = options.eagerOptions
  eagerFilters?: any //  = options.eagerFilters
  allowedInsert?: RelationExpression<Model> //  =
  insertGraphOptions?: any //  = options.insertGraphOptions
  createUseUpsertGraph?: any //  = options.createUseUpsertGraph
  allowedUpsert?: RelationExpression<Model>
  upsertGraphOptions?: any //  = options.upsertGraphOptions
}

export interface ObjectionAdapterTransaction {
  starting: boolean
  parent?: ObjectionAdapterTransaction
  committed?: any
  resolve?: any
  trx?: Transaction
  id?: number
  promise?: Promise<any>
}

export interface ObjectionAdapterParams<Q = AdapterQuery>
  extends AdapterParams<Q, Partial<ObjectionAdapterOptions>> {
  objection?: QueryBuilder<Model, Model[]>
  transaction?: ObjectionAdapterTransaction
}
