/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Id, NullableId, Paginated, Query } from '@feathersjs/feathers'
import { RelationExpression, Model, JSONSchema, QueryBuilder } from 'objection'

import { _ } from '@feathersjs/commons'
import {
  AdapterBase,
  PaginationOptions,
  filterQuery,
} from '@feathersjs/adapter-commons'
import { NotFound } from '@feathersjs/errors'

import { errorHandler } from './error-handler'
import { ObjectionAdapterOptions, ObjectionAdapterParams } from './declarations'

const METHODS = {
  $ne: 'whereNot',
  $in: 'whereIn',
  $nin: 'whereNotIn',
  $or: 'orWhere',
  $and: 'andWhere',
  $not: 'whereNot',
  $null: 'whereNull',
  $notNull: 'whereNotNull',
}

const OPERATORS = {
  $lt: '<',
  $lte: '<=',
  $gt: '>',
  $gte: '>=',
  $like: 'like',
  $notlike: 'not like',
  $ilike: 'ilike',
}

// const OPERATORS = {
//   eq: '$eq',
//   ne: '$ne',
//   gte: '$gte',
//   gt: '$gt',
//   lte: '$lte',
//   lt: '$lt',
//   in: '$in',
//   notIn: '$nin',
//   like: '$like',
//   notLike: '$notLike',
//   ilike: '$ilike',
//   notILike: '$notILike',
//   or: '$or',
//   and: '$and',
//   whereNot: '$not',
// }
// const OPERATORS_MAP = {
//   $lt: '<',
//   $lte: '<=',
//   $gt: '>',
//   $gte: '>=',
//   $like: 'like',
//   $notLike: 'not like',
//   $ilike: 'ilike',
//   $notILike: 'not ilike',
//   $regexp: '~',
//   $notRegexp: '!~',
//   $iRegexp: '~*',
//   $notIRegexp: '!~*',
//   $between: 'between',
//   $notBetween: 'not between',
//   $contains: '@>',
//   $containsKey: '?',
//   $contained: '<@',
//   $any: '?|',
//   $all: '?&',
// }
// const DESERIALIZED_ARRAY_OPERATORS = ['between', 'not between', '?|', '?&']
// const NON_COMPARISON_OPERATORS = ['@>', '?', '<@', '?|', '?&']
// const NUMERIC_COMPARISON_OPERATORS = ['<', '<=', '>', '>=']

const RETURNING_CLIENTS = ['postgresql', 'pg', 'oracledb', 'mssql']

export class ObjectionAdapter<
  Result,
  Data = Partial<Result>,
  ServiceParams extends ObjectionAdapterParams<any> = ObjectionAdapterParams,
  PatchData = Partial<Data>,
> extends AdapterBase<
  Result,
  Data,
  PatchData,
  ServiceParams,
  ObjectionAdapterOptions
> {
  table: string
  schema?: string

  /**
   * id field primary keys separator char
   * used for composite keys
   */
  idSeparator?: string = ','

  /**
   * operators whitelisted
   */
  whitelist?: string[]

  jsonSchema?: JSONSchema
  allowedEager?: any //  = options.allowedEager
  eagerOptions?: any //  = options.eagerOptions
  eagerFilters?: any //  = options.eagerFilters
  allowedInsert?: RelationExpression<Model> //  =
  insertGraphOptions?: any //  = options.insertGraphOptions
  createUseUpsertGraph?: any //  = options.createUseUpsertGraph
  allowedUpsert?: RelationExpression<Model>
  upsertGraphOptions?: any //  = options.upsertGraphOptions

  constructor(options: ObjectionAdapterOptions) {
    if (!options || !options.Model) {
      throw new Error('You must provide a Model (the initialized knex object)')
    }

    if (typeof options.name !== 'string') {
      throw new Error('No table name specified.')
    }

    super({
      id: 'id',
      ...options,
      filters: {
        ...options.filters,
        $and: (value: any) => value,
      },
      operators: [
        ...(options.operators ?? []),
        '$like',
        '$notlike',
        '$ilike',
        '$and',
        '$or',
      ],
    })

    this.table = options.name
    this.schema = options.schema

    this.idSeparator = options.idSeparator ?? ','
    // this.jsonSchema = options.Model.jsonSchema
    this.allowedEager = options.allowedEager
    this.eagerOptions = options.eagerOptions
    this.eagerFilters = options.eagerFilters
    // this.allowedInsert =
    //   options.allowedInsert && RelationExpression.create(options.allowedInsert)
    this.insertGraphOptions = options.insertGraphOptions
    this.createUseUpsertGraph = options.createUseUpsertGraph
    // this.allowedUpsert =
    //   options.allowedUpsert &&
    //   _objection.RelationExpression.create(options.allowedUpsert)
    this.upsertGraphOptions = options.upsertGraphOptions
  }

  get Model(): typeof Model {
    return this.options.Model
  }

  get fullName(): string {
    return this.schema ? `${this.schema}.${this.table}` : this.table
  }

  db(params?: ServiceParams): QueryBuilder<Model> {
    const { Model, table, schema } = this

    if (params?.transaction?.trx) {
      const { trx } = params.transaction
      // debug('ran %s with transaction %s', fullName, id)
      return schema
        ? (Model.query(trx)
            .withSchema(schema)
            .table(table) as unknown as QueryBuilder<Model>)
        : (Model.query(trx).table(table) as unknown as QueryBuilder<Model>)
    }
    return schema
      ? (Model.query()
          .withSchema(schema)
          .table(table) as unknown as QueryBuilder<Model>)
      : (Model.query().table(table) as unknown as QueryBuilder<Model>)
  }

  objectify(
    objectionQuery: QueryBuilder<Model, Model[]>,
    query: Query = {},
    parentKey?: string,
  ): QueryBuilder<Model, Model[]> {
    const objectify = this.objectify.bind(this)

    return Object.keys(query || {}).reduce((currentQuery, key) => {
      const value = query[key]

      if (_.isObject(value)) {
        return objectify(currentQuery, value, key)
      }

      const column = parentKey ?? key
      const method: any = METHODS[key as keyof typeof METHODS]

      if (method) {
        if (key === '$or' || key === '$and') {
          // This will create a nested query
          currentQuery.where(function (this: any) {
            for (const condition of value) {
              this[method](function (this: QueryBuilder<Model, Model[]>) {
                objectify(this, condition)
              })
            }
          })

          return currentQuery
        }

        return (currentQuery as any)[method](column, value)
      }

      const operator = OPERATORS[key as keyof typeof OPERATORS] || '='

      return operator === '='
        ? currentQuery.where(column, value)
        : currentQuery.where(column, operator, value)
    }, objectionQuery)
  }

  createQuery(params: ServiceParams) {
    const { table, id } = this
    const { filters, query } = this.filterQuery(params)
    const builder = this.db(params)

    // $select uses a specific find syntax, so it has to come first.
    if (filters.$select) {
      // always select the id field, but make sure we only select it once
      builder.select(...new Set([...filters.$select, `${table}.${id}`]))
    } else {
      builder.select(`${table}.*`)
    }

    // build up the knex query out of the query params, include $and and $or filters
    this.objectify(builder, {
      ...query,
      ..._.pick(filters, '$and', '$or'),
    })

    // Handle $sort
    if (filters.$sort) {
      return Object.keys(filters.$sort).reduce(
        (currentQuery, key) =>
          currentQuery.orderBy(key, filters.$sort[key] === 1 ? 'asc' : 'desc'),
        builder,
      )
    }

    return builder
  }

  filterQuery(params: ServiceParams) {
    const options = this.getOptions(params)
    const { filters, query } = filterQuery(params?.query || {}, options)

    return { filters, query, paginate: options.paginate }
  }

  async _find(
    params?: ServiceParams & { paginate?: PaginationOptions },
  ): Promise<Paginated<Result>>
  async _find(params?: ServiceParams & { paginate: false }): Promise<Result[]>
  async _find(params?: ServiceParams): Promise<Paginated<Result> | Result[]>
  async _find(
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Paginated<Result> | Result[]> {
    const { filters, paginate } = this.filterQuery(params)
    const builder = params.objection
      ? params.objection.clone()
      : this.createQuery(params)
    const countBuilder = builder
      .clone()
      .clearSelect()
      .clearOrder()
      .count(`${this.table}.${this.id} as total`)

    // Handle $limit
    if (filters.$limit) {
      builder.limit(filters.$limit)
    }

    // Handle $skip
    if (filters.$skip) {
      builder.offset(filters.$skip)
    }

    // provide default sorting if its not set
    if (!filters.$sort) {
      builder.orderBy(`${this.table}.${this.id}`, 'asc')
    }

    const data =
      filters.$limit === 0
        ? []
        : ((await builder.catch(errorHandler)) as unknown as Result[])

    console.log(data)

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (paginate && paginate?.default) {
      const total = await countBuilder.then((count: any) =>
        parseInt(count[0] ? count[0].total : 0),
      )

      return {
        total,
        limit: filters.$limit,
        skip: filters.$skip || 0,
        data,
      }
    }

    return data
  }

  async _findOrGet(id: NullableId, params?: ServiceParams) {
    const findParams = {
      ...params,
      paginate: false,
      query: {
        ...params?.query,
        ...(id !== null ? { [`${this.table}.${this.id}`]: id } : {}),
      },
    }

    return await (this._find(findParams as any) as any as Promise<Result[]>)
  }

  async _get(
    id: Id,
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Result> {
    const data = await this._findOrGet(id, params)

    if (data.length !== 1) {
      throw new NotFound(`No record found for id '${id}'`)
    }

    return data[0]
  }

  async _create(data: Data, params?: ServiceParams): Promise<Result>
  async _create(data: Data[], params?: ServiceParams): Promise<Result[]>
  async _create(
    data: Data | Data[],
    _params?: ServiceParams,
  ): Promise<Result | Result[]>
  async _create(
    _data: Data | Data[],
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Result | Result[]> {
    const data = _data as any

    if (Array.isArray(data)) {
      return await Promise.all(
        data.map(async (current) => await this._create(current, params)),
      )
    }

    const client = this.Model.knex().client.config.client
    const returning = RETURNING_CLIENTS.includes(client as string)
      ? [this.id]
      : []
    const rows: any = await this.db(params)
      .insert(data)
      .returning(returning)
      .catch(errorHandler)
    const id = data[this.id] || rows[0][this.id] || rows[0]

    if (!id) {
      return rows as Result[]
    }

    return await this._get(id, params)
  }

  async _patch(
    id: null,
    data: PatchData,
    params?: ServiceParams,
  ): Promise<Result[]>
  async _patch(id: Id, data: PatchData, params?: ServiceParams): Promise<Result>
  async _patch(
    id: NullableId,
    data: PatchData,
    _params?: ServiceParams,
  ): Promise<Result | Result[]>
  async _patch(
    id: NullableId,
    raw: PatchData,
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Result | Result[]> {
    const data = _.omit(raw, this.id)
    const results = await this._findOrGet(id, {
      ...params,
      query: {
        ...params?.query,
        $select: [`${this.table}.${this.id}`],
      },
    })
    const idList = results.map((current: any) => current[this.id])
    const updateParams = {
      ...params,
      query: {
        [`${this.table}.${this.id}`]: { $in: idList },
        ...(params?.query?.$select ? { $select: params?.query?.$select } : {}),
      },
    }
    const builder = this.createQuery(updateParams)

    await builder.update(data)

    const items = await this._findOrGet(null, updateParams)

    if (id !== null) {
      if (items.length === 1) {
        return items[0]
      } else {
        throw new NotFound(`No record found for id '${id}'`)
      }
    }

    return items
  }

  async _update(
    id: Id,
    _data: Data,
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Result> {
    const data = _.omit(_data, this.id)
    const oldData = await this._get(id, params)
    const newObject = Object.keys(oldData as any).reduce((result: any, key) => {
      if (key !== this.id) {
        // We don't want the id field to be changed
        result[key] = data[key] === undefined ? null : data[key]
      }

      return result
    }, {})

    await this.db(params).update(newObject).returning('*').where(this.id, id)

    return await this._get(id, params)
  }

  async _remove(id: null, params?: ServiceParams): Promise<Result[]>
  async _remove(id: Id, params?: ServiceParams): Promise<Result>
  async _remove(
    id: NullableId,
    _params?: ServiceParams,
  ): Promise<Result | Result[]>
  async _remove(
    id: NullableId,
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Result | Result[]> {
    const items = await this._findOrGet(id, params)
    const { query } = this.filterQuery(params)
    const q = this.db(params)
    const idList = items.map((current: any) => current[this.id])

    query[this.id] = { $in: idList }

    // build up the knex query out of the query params
    this.objectify(q, query)

    await q.del().catch(errorHandler)

    if (id !== null) {
      if (items.length === 1) {
        return items[0]
      }

      throw new NotFound(`No record found for id '${id}'`)
    }

    return items
  }
}
