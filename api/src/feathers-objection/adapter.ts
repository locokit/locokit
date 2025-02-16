import { Id, NullableId, Paginated, Query } from '@feathersjs/feathers'
import {
  RelationExpression,
  Model,
  JSONSchema,
  QueryBuilder,
  ColumnRefOrOrderByDescriptor,
} from 'objection'

import { _ } from '@feathersjs/commons'
import { AdapterBase, PaginationOptions, filterQuery } from '@feathersjs/adapter-commons'
import { NotFound } from '@feathersjs/errors'

import { errorHandler } from './error-handler'
import { ObjectionAdapterOptions, ObjectionAdapterParams } from './declarations'
import { objectionLogger } from './logger'

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
> extends AdapterBase<Result, Data, PatchData, ServiceParams, ObjectionAdapterOptions> {
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
  allowedGraph?: any //  = options.allowedGraph
  eagerOptions?: any //  = options.eagerOptions
  eagerFilters?: any //  = options.eagerFilters
  allowedInsert?: RelationExpression<Model> //  =
  insertGraphOptions?: any //  = options.insertGraphOptions
  createUseUpsertGraph?: any //  = options.createUseUpsertGraph
  allowedUpsert?: RelationExpression<Model>
  upsertGraphOptions?: any //  = options.upsertGraphOptions

  constructor(options: ObjectionAdapterOptions) {
    if (!options?.Model) {
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
        $joinRelated: (value: any) => value,
        $joinEager: (value: any) => value,
        $eager: (value: any) => value,
      },
      operators: [...(options.operators ?? []), '$like', '$notlike', '$ilike', '$and', '$or'],
    })

    this.table = options.name
    this.schema = options.schema

    this.idSeparator = options.idSeparator ?? ','
    this.jsonSchema = options.Model.jsonSchema
    this.allowedGraph = options.allowedGraph
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
        ? (Model.query(trx).withSchema(schema).table(table) as unknown as QueryBuilder<Model>)
        : (Model.query(trx).table(table) as unknown as QueryBuilder<Model>)
    }
    return schema
      ? (Model.query().withSchema(schema).table(table) as unknown as QueryBuilder<Model>)
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
      const sanitizedColumn = column.indexOf('.') > 0 ? column : `${this.table}.${column}`
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

        return (currentQuery as any)[method](sanitizedColumn, value)
      }

      const operator = OPERATORS[key as keyof typeof OPERATORS] || '='

      return operator === '='
        ? currentQuery.where(sanitizedColumn, value)
        : currentQuery.where(sanitizedColumn, operator, value)
    }, objectionQuery)
  }

  /**
   * Code from Crow objection
   * Maps a feathers query to the Objection/Knex schema builder functions.
   * @param query - a query object. i.e. { type: 'fish', age: { $lte: 5 }
   * @param params
   * @param parentKey
   * @param methodKey
   * @param allowRefs
   */
  // objectify(query, params, parentKey, methodKey, allowRefs, hierarchy = []) {
  //   if (params.$eager) {
  //     delete params.$eager
  //   }

  //   if (params.$joinEager) {
  //     delete params.$joinEager
  //   }

  //   if (params.$joinRelation) {
  //     delete params.$joinRelation
  //   }

  //   if (params.$modifyEager) {
  //     delete params.$modifyEager
  //   }

  //   if (params.$mergeEager) {
  //     delete params.$mergeEager
  //   }

  //   if (params.$noSelect) {
  //     delete params.$noSelect
  //   }

  //   if (params.$modify) {
  //     delete params.$modify
  //   }

  //   if (params.$allowRefs) {
  //     delete params.$allowRefs
  //   }

  //   Object.keys(params || {}).forEach((key) => {
  //     let value = params[key]
  //     const localHierarchy = [...hierarchy]

  //     if (key === '$not') {
  //       const self = this

  //       if (Array.isArray(value)) {
  //         // Array = $and operator
  //         value = {
  //           $and: value,
  //         }
  //       }

  //       return query.whereNot(function () {
  //         // continue with all queries inverted
  //         self.objectify(this, value, parentKey, methodKey, allowRefs)
  //       })
  //     }

  //     if (_utils.default.isPlainObject(value)) {
  //       localHierarchy.push(key)
  //       return this.objectify(
  //         query,
  //         value,
  //         key,
  //         parentKey,
  //         allowRefs,
  //         localHierarchy,
  //       )
  //     }

  //     const column = parentKey && parentKey[0] !== '$' ? parentKey : key
  //     const method = METHODS[methodKey] || METHODS[parentKey] || METHODS[key]
  //     const operator = OPERATORS_MAP[key] || '='

  //     /**
  //      *
  //      */
  //     if (
  //       method &&
  //       (localHierarchy.length <= 1 || ['$or', '$and'].includes(key))
  //     ) {
  //       if (key === '$or') {
  //         const self = this
  //         return query.where(function () {
  //           return value.forEach((condition) => {
  //             this.orWhere(function () {
  //               self.objectify(this, condition, null, null, allowRefs)
  //             })
  //           })
  //         })
  //       }

  //       if (key === '$and') {
  //         const self = this
  //         return query.where(function () {
  //           return value.forEach((condition) => {
  //             this.andWhere(function () {
  //               self.objectify(this, condition, null, null, allowRefs)
  //             })
  //           })
  //         })
  //       }

  //       if (key === '$null') {
  //         return query[value.toString() === 'true' ? method : 'whereNotNull'](
  //           column,
  //         )
  //       }

  //       return query[method].call(query, column, value) // eslint-disable-line no-useless-call
  //     }

  //     const property =
  //       this.jsonSchema &&
  //       this.jsonSchema.properties &&
  //       (this.jsonSchema.properties[column] ||
  //         (localHierarchy.length > 0 &&
  //           this.jsonSchema.properties[localHierarchy[0]]) ||
  //         (methodKey && this.jsonSchema.properties[methodKey]))
  //     let columnType = property && property.type
  //     if (columnType) {
  //       if (Array.isArray(columnType)) {
  //         columnType = columnType[0]
  //       }

  //       if (columnType === 'object' || columnType === 'array') {
  //         let refColumn

  //         if (!methodKey && key[0] === '$') {
  //           refColumn = (0, _objection.ref)(`${this.Model.tableName}.${column}`)
  //         } else {
  //           const prop = (methodKey ? column : key)
  //             .replace(/\(/g, '[')
  //             .replace(/\)/g, ']')
  //           refColumn = (0, _objection.ref)(
  //             `${this.Model.tableName}.${methodKey || column}:${prop}`,
  //           )
  //         }

  //         if (operator === '@>') {
  //           if (Array.isArray(value)) {
  //             value = JSON.stringify(value)
  //           }
  //         } else if (DESERIALIZED_ARRAY_OPERATORS.includes(operator)) {
  //           if (
  //             typeof value === 'string' &&
  //             value[0] === '[' &&
  //             value[value.length - 1] === ']'
  //           ) {
  //             value = JSON.parse(value)
  //           }
  //         }

  //         /**
  //          * PATCH for numeric comparison operators
  //          */
  //         let refColumnParse = 'text'
  //         if (NUMERIC_COMPARISON_OPERATORS.includes(operator)) {
  //           const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g
  //           if (regex.test(value)) {
  //             refColumnParse = 'text'
  //           } else {
  //             refColumnParse = 'decimal'
  //           }
  //         }
  //         if (method) {
  //           // if (key === '$or') {
  //           //   const self = this;
  //           //   return query.where(function () {
  //           //     return value.forEach(condition => {
  //           //       this.orWhere(function () {
  //           //         self.objectify(this, condition, null, null, allowRefs, hierarchy);
  //           //       });
  //           //     });
  //           //   });
  //           // }

  //           // if (key === '$and') {
  //           //   const self = this;
  //           //   return query.where(function () {
  //           //     return value.forEach(condition => {
  //           //       this.andWhere(function () {
  //           //         self.objectify(this, condition, null, null, allowRefs, hierarchy);
  //           //       });
  //           //     });
  //           //   });
  //           // }

  //           return query[method].call(
  //             query,
  //             NON_COMPARISON_OPERATORS.includes(operator)
  //               ? refColumn
  //               : refColumn.castTo(refColumnParse),
  //             value,
  //           )
  //         }

  //         return query.where(
  //           NON_COMPARISON_OPERATORS.includes(operator)
  //             ? refColumn
  //             : refColumn.castTo(refColumnParse),
  //           operator,
  //           value,
  //         )
  //       }
  //     }

  //     if (
  //       DESERIALIZED_ARRAY_OPERATORS.includes(operator) &&
  //       typeof value === 'string' &&
  //       value[0] === '[' &&
  //       value[value.length - 1] === ']'
  //     ) {
  //       value = JSON.parse(value)
  //     }

  //     if (allowRefs && typeof value === 'string') {
  //       const refMatches = value.match(/^ref\((.+)\)$/)

  //       if (refMatches) {
  //         value = (0, _objection.ref)(refMatches[1])
  //       }
  //     }

  //     return operator === '='
  //       ? query.where(column, value)
  //       : query.where(column, operator, value)
  //   })
  // }

  /**
   * Method from objection Crow
   * _operations seems to recognized
   * need to be digged
   */
  getGroupByColumns(query: QueryBuilder<Model, Model[]>) {
    for (const operation of (query as any)._operations) {
      if (operation.name === 'groupBy') {
        const args = operation.args
        return Array.isArray(args[0]) ? args[0] : args
      }
    }

    return null
  }

  createQuery(params: ServiceParams) {
    objectionLogger.debug(
      'createQuery for model %s and table %s.%s',
      this.Model.name,
      this.schema,
      this.Model.tableName,
    )
    /**
     * Objection Crow version legacy code
     * is commented right after knex code
     */

    const { table, id } = this
    const idColumns = []
    if (Array.isArray(id)) {
      id.forEach((currentId: string) => idColumns.push(`${table}.${currentId}`))
    } else idColumns.push(`${table}.${id}`)

    const { filters, query } = this.filterQuery(params)
    // const q = this._createQuery(params).skipUndefined()
    const builder = this.db(params)

    // crow code
    const eagerOptions = {
      ...this.eagerOptions,
      ...params.eagerOptions,
    }

    // $select uses a specific find syntax, so it has to come first.
    if (filters.$select) {
      // always select the id field, but make sure we only select it once
      builder.select(...new Set([...filters.$select, ...idColumns]))
    } else {
      builder.select(`${table}.*`)
    }
    // this._selectQuery(q, filters.$select)

    // crow code
    // $eager for Objection eager queries
    if (filters?.$eager) {
      builder.withGraphFetched(filters.$eager, eagerOptions)
      delete filters.$eager
    }

    if (this.allowedGraph) {
      builder.allowGraph(this.allowedGraph)
    }

    if (params.mergeAllowEager) {
      builder.allowGraph(params.mergeAllowEager)
    }

    // $select uses a specific find syntax, so it has to come first.

    const joinEager = filters?.$joinEager

    if (joinEager) {
      builder.withGraphJoined(filters.$joinEager, eagerOptions)
      delete filters.$joinEager
    }

    const joinRelated = filters?.$joinRelated
    if (joinRelated) {
      builder.joinRelated(filters.$joinRelated)
      delete filters.$joinRelated
    }

    if (filters?.$mergeEager) {
      builder[joinEager ? 'withGraphJoined' : 'withGraphFetched'](filters.$mergeEager, eagerOptions)
      delete filters.$mergeEager
    }

    // if (filters?.$modify) {
    //   this.modifyQuery(q, filters.$modify)
    //   delete filters.$modify
    // }

    if (joinRelated) {
      const groupByColumns = this.getGroupByColumns(builder)

      if (!groupByColumns) {
        builder.distinct(`${this.Model.tableName}.*`)
      }
    }

    // apply eager filters if specified
    if (this.eagerFilters) {
      objectionLogger.debug('eagerFilters', this.eagerFilters)
      const eagerFilters = Array.isArray(this.eagerFilters)
        ? this.eagerFilters
        : [this.eagerFilters]

      for (const eagerFilter of eagerFilters) {
        builder.modifyGraph(eagerFilter.expression, eagerFilter.filter)
      }
    }

    // if (filters?.$modifyEager) {
    //   for (const eagerFilterExpression of Object.keys(filters.$modifyEager)) {
    //     const eagerFilterQuery = filters.$modifyEager[eagerFilterExpression]
    //     builder.modifyGraph(eagerFilterExpression, (builder) => {
    //       this.objectify(
    //         builder,
    //         eagerFilterQuery,
    //         null,
    //         null,
    //         filters.$allowRefs,
    //       )
    //     })
    //   }

    //   delete filters.$modifyEager
    // }

    // build up the knex query out of the query params, include $and and $or filters
    this.objectify(builder, {
      ...query,
      ..._.pick(filters, '$and', '$or'),
    })
    // this.objectify(q, query, null, null, query.$allowRefs)

    // if (filters.$sort) {
    //   Object.keys(filters.$sort).forEach((item) => {
    //     const matches = item.match(/^ref\((.+)\)$/)
    //     const key = matches ? (0, _objection.ref)(matches[1]) : item
    //     q.orderBy(key, filters.$sort[item] === 1 ? 'asc' : 'desc')
    //   })
    // }

    // Handle $sort
    if (filters.$sort) {
      return Object.keys(filters.$sort).reduce(
        (currentQuery, key) => currentQuery.orderBy(key, filters.$sort[key] === 1 ? 'asc' : 'desc'),
        builder,
      )
    }

    return builder
  }

  /**
   * Create a specific query for count purpose.
   *
   * With objection we need to distinguish
   * the fetch query from the count query,
   * as relations methods (withGraphFetched vs withGraphJoined, ...)
   * can produce some unwanted results.
   *
   * Example given,
   * some $selects are added from the relation
   * but are causing errors when counting results.
   *
   * We prefer use the joinRelated methods
   * that does only a join without retrieving data from the relations.
   */
  _createCountQuery(params: ServiceParams) {
    objectionLogger.debug('_createCountQuery')
    /**
     * Objection Crow version legacy code
     * is commented right after knex code
     */

    const { filters, query } = this.filterQuery(params)
    // const q = this._createQuery(params).skipUndefined()
    const builder = this.db(params)

    // crow code
    const eagerOptions = {
      ...this.eagerOptions,
      ...params.eagerOptions,
    }

    // crow code
    // $eager for Objection eager queries

    // WE DON'T set $eager for COUNT queries
    // as it's only a loading of related data ?
    // if (filters?.$eager) {
    //   builder.joinRelated(filters.$eager, eagerOptions)
    //   delete filters.$eager
    // }

    if (this.allowedGraph) {
      builder.allowGraph(this.allowedGraph)
    }

    if (params.mergeAllowEager) {
      builder.allowGraph(params.mergeAllowEager)
    }

    // $select uses a specific find syntax, so it has to come first.

    const joinEager = filters?.$joinEager

    if (joinEager) {
      builder.joinRelated(filters.$joinEager, eagerOptions)
      delete filters.$joinEager
    }

    const joinRelated = filters?.$joinRelated

    if (joinRelated) {
      builder.joinRelated(filters.$joinRelated)
      delete filters.$joinRelated
    }

    if (filters?.$mergeEager) {
      builder[joinEager ? 'withGraphJoined' : 'withGraphFetched'](filters.$mergeEager, eagerOptions)
      delete filters.$mergeEager
    }

    // if (filters?.$modify) {
    //   this.modifyQuery(q, filters.$modify)
    //   delete filters.$modify
    // }

    // apply eager filters if specified
    if (this.eagerFilters) {
      objectionLogger.debug('eagerFilters', this.eagerFilters)
      const eagerFilters = Array.isArray(this.eagerFilters)
        ? this.eagerFilters
        : [this.eagerFilters]

      for (const eagerFilter of eagerFilters) {
        builder.modifyGraph(eagerFilter.expression, eagerFilter.filter)
      }
    }

    // if (filters?.$modifyEager) {
    //   for (const eagerFilterExpression of Object.keys(filters.$modifyEager)) {
    //     const eagerFilterQuery = filters.$modifyEager[eagerFilterExpression]
    //     builder.modifyGraph(eagerFilterExpression, (builder) => {
    //       this.objectify(
    //         builder,
    //         eagerFilterQuery,
    //         null,
    //         null,
    //         filters.$allowRefs,
    //       )
    //     })
    //   }

    //   delete filters.$modifyEager
    // }

    // build up the knex query out of the query params, include $and and $or filters
    this.objectify(builder, {
      ...query,
      ..._.pick(filters, '$and', '$or'),
    })
    // this.objectify(q, query, null, null, query.$allowRefs)

    // if (filters.$sort) {
    //   Object.keys(filters.$sort).forEach((item) => {
    //     const matches = item.match(/^ref\((.+)\)$/)
    //     const key = matches ? (0, _objection.ref)(matches[1]) : item
    //     q.orderBy(key, filters.$sort[item] === 1 ? 'asc' : 'desc')
    //   })
    // }

    // // Handle $sort
    // if (filters.$sort) {
    //   return Object.keys(filters.$sort).reduce(
    //     (currentQuery, key) => currentQuery.orderBy(key, filters.$sort[key] === 1 ? 'asc' : 'desc'),
    //     builder,
    //   )
    // }

    return builder
  }

  filterQuery(params: ServiceParams) {
    const options = this.getOptions(params)
    const { filters, query } = filterQuery(params?.query || {}, options)

    return { filters, query, paginate: options.paginate }
  }

  async _find(
    params?: ServiceParams & {
      paginate?: PaginationOptions
    },
  ): Promise<Paginated<Result>>
  async _find(
    params?: ServiceParams & {
      paginate: false
    },
  ): Promise<Result[]>
  async _find(params?: ServiceParams): Promise<Paginated<Result> | Result[]>
  async _find(params: ServiceParams = {} as ServiceParams): Promise<Paginated<Result> | Result[]> {
    objectionLogger.debug(
      '_find for model %s and table %s.%s',
      this.Model.name,
      this.schema,
      this.Model.tableName,
    )
    const { filters, paginate } = this.filterQuery(params)
    const builder = params.objection ? params.objection.clone() : this.createQuery(params)

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
      /**
       * For composite keys,
       * we need to rework order columns
       */
      const idColumns = Array.isArray(this.id) ? this.id : [this.id]
      const idColumnsOrder = idColumns.map((idc: string) => ({
        column: `${this.table}.${idc}`,
        order: 'asc',
      })) as ColumnRefOrOrderByDescriptor[]
      builder.orderBy(idColumnsOrder)
    }

    const data =
      filters.$limit === 0 ? [] : ((await builder.catch(errorHandler)) as unknown as Result[])

    if (paginate && paginate?.default) {
      /**
       * If the table has a composite key, prefer count all lines with '*'
       */
      const countColumn = Array.isArray(this.id) ? '*' : `${this.table}.${this.id}`

      let countBuilder: QueryBuilder<Model>
      if (params.objection) {
        countBuilder = params.objection.clone()
      } else {
        /**
         * if countColumn is *,
         * we can't make a count(distinct *),
         * so we do a simple count
         */
        const countMethod = countColumn === '*' ? 'count' : 'countDistinct'
        countBuilder = this._createCountQuery(params)[countMethod](countColumn, {
          as: 'total',
        })
      }

      const total = await countBuilder.then((count: any) => parseInt(count[0] ? count[0].total : 0))

      return {
        total,
        limit: filters.$limit,
        skip: filters.$skip || 0,
        data,
      }
    }

    return data
  }

  async _findOrGet(id: NullableId, params: ServiceParams = {} as ServiceParams) {
    const { name, id: idField } = this.getOptions(params)
    objectionLogger.debug('_findOrGet for id: %s, with idField: %s', id, idField)

    /**
     * Compute ids query for comoposable keys
     */
    const queryId: Record<string, any> = {}
    if (Array.isArray(idField)) {
      /**
       * if id is set, and is is not an array, maybe this is in a comma separated values
       */
      let idValues: any[] | null = null
      if (Array.isArray(id)) {
        idValues = id as any[]
      } else if (id) {
        idValues = (id as string).split(',')
      }
      if (idValues) {
        idField.forEach((f, i) => {
          queryId[f] = (idValues as any[])[i]
        })
      }
    } else if (id !== null) {
      queryId[`${name}.${idField as string}`] = id
    }

    const findParams = {
      ...params,
      paginate: false,
      query: {
        ...params?.query,
        ...queryId,
      },
    }

    return await (this._find(findParams as any) as any as Promise<Result[]>)
  }

  async _get(id: Id, params: ServiceParams = {} as ServiceParams): Promise<Result> {
    const data = await this._findOrGet(id, params)

    if (data.length !== 1) {
      throw new NotFound(`No record found for id '${id}'`)
    }

    return data[0]
  }

  async _create(data: Data, params?: ServiceParams): Promise<Result>
  async _create(data: Data[], params?: ServiceParams): Promise<Result[]>
  async _create(data: Data | Data[], _params?: ServiceParams): Promise<Result | Result[]>
  async _create(
    _data: Data | Data[],
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Result | Result[]> {
    const data = _data as any

    if (Array.isArray(data)) {
      return await Promise.all(data.map(async (current) => await this._create(current, params)))
    }

    const client = this.Model.knex().client.config.client
    const returning = RETURNING_CLIENTS.includes(client as string) ? [this.id] : []
    const result: any = await this.db(params).insert(data).returning(returning).catch(errorHandler)
    const rows = !Array.isArray(result) ? [result] : result
    const { id: idField } = this.getOptions(params)

    /**
     * If we have a composable key, we need to compute id accordingly
     */
    const id = Array.isArray(idField)
      ? idField.reduce((acc: any[], f: string) => {
          acc.push(rows[0][f])
          return acc
        }, [])
      : data[this.id] || rows[0][this.id] || rows[0]

    if (!id) {
      return rows as Result[]
    }

    return await this._get(id, params)
  }

  async _patch(id: null, data: PatchData, params?: ServiceParams): Promise<Result[]>
  async _patch(id: Id, data: PatchData, params?: ServiceParams): Promise<Result>
  async _patch(id: NullableId, data: PatchData, _params?: ServiceParams): Promise<Result | Result[]>
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

  async _update(id: Id, _data: Data, params: ServiceParams = {} as ServiceParams): Promise<Result> {
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
  async _remove(id: NullableId, _params?: ServiceParams): Promise<Result | Result[]>
  async _remove(
    id: NullableId,
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Result | Result[]> {
    const items = await this._findOrGet(id, params)
    const { query } = this.filterQuery(params)
    const q = this.db(params)

    const { id: idField } = this.getOptions(params)
    /**
     * If we have a composable key, we need to compute id accordingly
     */
    if (Array.isArray(idField)) {
      idField.forEach((f) => {
        const currentIdList = items.map((current: any) => current[f])

        query[f] = { $in: currentIdList }
      })
    } else {
      const idList = items.map((current: any) => current[this.id])

      query[this.id] = { $in: idList }
    }

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
