/* eslint-disable @typescript-eslint/no-floating-promises */
import knex, { Knex } from 'knex'
import { type Column, type ForeignKey } from '@directus/schema'
import {
  ConnexionSQL,
  type GenericAdapter,
  Table,
  PaginatedResult,
  TableRecord,
  FeatureCollectionResult,
} from '../interface'
import {
  Model,
  JSONSchema,
  RelationMappings,
  RelationMappingsThunk,
  AjvValidator,
  raw,
  ColumnRef,
} from 'objection'
import addFormats from 'ajv-formats'
import { getJSONTypeFromSQLType } from '../../utils/sqlTypeConverter'
import { objectify } from './objectify'
import { logger } from '../../logger'
import {
  convertDBTypeToFieldType,
  DB_TYPE,
  DiffItem,
  DiffItemField,
  DiffItemRelation,
  DiffItemTable,
  FIELD_TYPE,
} from '@locokit/definitions'
import { EngineModel } from './model'
import { FeatureCollection, Geometry } from 'geojson'
import { createInspector } from './inspector'

const adapterLogger = logger.child({ service: 'engine', name: 'sql-adapter' })

const implementedEngines = ['sqlite3', 'pg']

function isGeometryColumn(column: Column): boolean {
  const fieldType = convertDBTypeToFieldType('pg', column.data_type as DB_TYPE)
  switch (fieldType) {
    case FIELD_TYPE.GEOMETRY:
    case FIELD_TYPE.GEOMETRY_POINT:
    case FIELD_TYPE.GEOMETRY_POLYGON:
    case FIELD_TYPE.GEOMETRY_LINESTRING:
    case FIELD_TYPE.GEOMETRY_MULTIPOINT:
    case FIELD_TYPE.GEOMETRY_MULTIPOLYGON:
    case FIELD_TYPE.GEOMETRY_MULTILINESTRING:
      return true
    default:
      return false
  }
}

export class SQLAdapter implements GenericAdapter {
  database: Knex
  databaseObjectionModel: Record<string, typeof EngineModel> = {}

  connexion: ConnexionSQL

  constructor(connexion: ConnexionSQL) {
    /**
     * Check the type is well known for SQL
     */
    adapterLogger.info('creating adapter for %s', connexion.type)
    if (!implementedEngines.includes(connexion.type))
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        'This engine is unknown. Please use one of ' + implementedEngines.concat(', ') + '.',
      )
    this.connexion = connexion

    this.database = knex({
      client: connexion.type,
      connection: connexion.options,
      // debug: true,
    })
  }

  /**
   * Init the adapter by retrieving sql schema,
   * create objection model according table + columns schema
   */
  async boot(): Promise<void> {
    adapterLogger.info('[boot] booting...')

    const inspector = createInspector(this.database)

    if (this.connexion.type === 'pg') {
      if (this.connexion.role) {
        adapterLogger.info('switching role to %s', this.connexion.role)
        await this.database.raw('SET ROLE ??', [this.connexion.role])
      }
      if (this.connexion.schema) {
        const searchPathResult = await this.database.raw('SHOW SEARCH_PATH;')
        const searchPathValue = searchPathResult.rows[0].search_path
        const newSearchPath = `"${this.connexion.schema}", ${searchPathValue}`
        adapterLogger.info('set search path to %s', newSearchPath)
        await this.database.raw(`SET SEARCH_PATH TO ${newSearchPath};`)
        inspector.withSchema?.(this.connexion.schema)
      }
    }

    /**
     * Fetch all tables to create Objection's Model for each one
     */
    const tableNames = await inspector.tables()
    /**
     * Transform tableNames into an object
     * initialized with an object with the property name equal to table name
     */
    const tables: Record<
      string,
      {
        id: string | string[] | null
        name: string
        columns: Column[]
        relations: Record<string, any>
      }
    > = tableNames.reduce(
      (accumulator: Record<string, any>, current: string) => ({
        ...accumulator,
        [current]: { name: current, columns: [], relations: [] },
      }),
      {},
    )
    adapterLogger.info('[boot] %s tables found', Object.keys(tables).length)

    /**
     * Fetch also all column info for all of the table
     */
    await tableNames.reduce(async (accumulator: Promise<void>, tableName: string) => {
      await accumulator
      adapterLogger.info('[boot] inspecting table %s', tableName)
      const primary = await inspector.primary(tableName)
      tables[tableName].id = primary
      const columnInfos = await inspector.columnInfo(tableName)
      tables[tableName].columns = columnInfos
      columnInfos.forEach((c: Column) => {
        adapterLogger.info('[boot] inspecting table %s, column %s', tableName, c.name, c.data_type)

        /**
         * is this column linked to a foreign ?
         */
        if (c.foreign_key_table) {
          const relationName = c.foreign_key_table
          /**
           * Add the belongs to one relation
           */
          tables[tableName].relations[relationName] = {
            from: tableName + '.' + c.name,
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            to: relationName + '.' + c.foreign_key_column,
            type: Model.BelongsToOneRelation,
            model: relationName,
          }
          /**
           * And also the has many relation
           */
          tables[relationName].relations[tableName] = {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            from: relationName + '.' + c.foreign_key_column,
            to: tableName + '.' + c.name,
            type: Model.HasManyRelation,
            model: tableName,
          }
          /**
           * TODO: detect the many to many ?
           */
        }
      })
    }, Promise.resolve())
    const allModels = this.databaseObjectionModel

    adapterLogger.info('[boot] building Models...')
    Object.keys(tables).forEach((tableName) => {
      adapterLogger.info('[boot] building Model %s', tableName)
      const t = tables[tableName]

      const schema = {
        type: 'object',
        required: [] as string[],
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        properties: {} as Record<string, JSONSchema>, // and not a boolean like in JSONSchemaDefinition
      }
      const jsonAttributes: string[] = []

      t.columns.forEach((c) => {
        /**
         * We convert the SQL type into a JSON one
         */
        const jsonType = getJSONTypeFromSQLType(c.data_type as DB_TYPE)
        if (jsonType === 'array') {
          schema.properties[c.name] = {
            type: jsonType,
          }
        } else {
          const propertyType = [jsonType]
          /**
           * If the field is nullable,
           * we add to field's types the `null` one.
           */
          if (c.is_nullable) propertyType.push('null')
          schema.properties[c.name] = {
            type: propertyType,
          }
        }
        if (jsonType === 'object') jsonAttributes.push(c.name)

        if (!c.is_nullable && c.default_value === null) schema.required.push(c.name)

        // TODO: be better for format subtilities
        if (c.data_type === 'date') schema.properties[c.name].format = 'date'
      })

      allModels[tableName] = class extends EngineModel {
        static createValidator() {
          return new AjvValidator({
            onCreateAjv: (ajv) => {
              addFormats(ajv, [
                'date-time',
                'time',
                'date',
                'email',
                'hostname',
                'ipv4',
                'ipv6',
                'uri',
                'uri-reference',
                'uuid',
                'uri-template',
                'json-pointer',
                'relative-json-pointer',
                'regex',
              ])
              // Here you can modify the `Ajv` instance.
            },
            options: {
              allErrors: true,
              validateSchema: false,
              ownProperties: true,
              allowUnionTypes: true,
              coerceTypes: true,
            },
          })
        }

        /**
         * Does the current model have at least one geom column
         */
        static get hasGeomColumn(): boolean {
          return t.columns.findIndex((c) => isGeometryColumn(c)) > -1
        }
        static get geomColumns(): string[] {
          return t.columns.filter((c) => isGeometryColumn(c)).map((c) => c.name)
        }

        static get tableName(): string {
          return tableName
        }

        static get idColumn(): string | string[] {
          if (!t.id) throw new Error('No primary column available for the table ' + tableName)
          // TODO: handle for table alias
          return t.id
        }

        // https://github.com/Vincit/objection.js/issues/52
        /**
         * Specify which types need to be JSON encoded/decoded via string
         * https://vincit.github.io/objection.js/api/model/static-properties.html#static-jsonattributes
         *
         * Beware, arrays in PG don't need to be encoded/decoded => we exclude them
         */
        static get jsonAttributes() {
          return jsonAttributes
        }

        static get jsonSchema(): JSONSchema {
          return schema
        }

        /**
         * Compute the relations for a table,
         * based on foreign keys.
         */
        static get relationMappings(): RelationMappings | RelationMappingsThunk {
          const result: RelationMappings = {}
          Object.keys(t.relations).forEach((relationName) => {
            const relation = t.relations[relationName]
            result[relationName] = {
              relation: relation.type,
              modelClass: allModels[relation.model],
              join: {
                from: relation.from,
                to: relation.to,
              },
            }
          })
          return result
        }
      }
    })
    adapterLogger.info('[boot] end')
  }

  async destroy() {
    await this.database.destroy()
  }

  /**
   * Depending the adapter type,
   * retrieve the remote schema.
   *
   * If type is a database, will ask the DB metadata
   *
   * If type is API like, will ask for an Open API spec ?
   */
  async retrieveSchema(schema?: string): Promise<Table[]> {
    adapterLogger.info('[retrieveSchema] inspecting schema %s', schema)
    const result: Table[] = []
    const inspector = createInspector(this.database)
    if (schema) inspector.withSchema?.(schema)
    const tables = await inspector.tables()
    adapterLogger.info('[retrieveSchema] %s tables found', tables.length)

    await Promise.all(
      tables.map(async (tableName: string) => {
        adapterLogger.info('[retrieveSchema] inspecting table %s', tableName)
        const table = await inspector.tableInfo(tableName)
        // remove the double quotes for better comparison
        const regexpRemovingDoubleQuotes = /^"(.*)"$/
        const columnInfos = await inspector.columnInfo(tableName)
        columnInfos.forEach((c: Column) => {
          c.schema = regexpRemovingDoubleQuotes.exec(c.schema ?? '')?.[1]
        })
        const foreignInfos = await inspector.foreignKeys(tableName)
        foreignInfos.forEach((f: ForeignKey) => {
          f.foreign_key_schema = regexpRemovingDoubleQuotes.exec(f.foreign_key_schema ?? '')?.[1]
        })
        result.push({
          ...table,
          schema: regexpRemovingDoubleQuotes.exec(table.schema ?? '')?.[1],
          fields: columnInfos,
          foreigns: foreignInfos,
        })
      }),
    )
    return result
  }

  retrieveTables(schema?: string): Promise<string[]> {
    const inspector = createInspector(this.database)
    if (schema) {
      inspector.withSchema?.(schema)
    } else if (this.connexion.schema) {
      inspector.withSchema?.(this.connexion.schema)
    }
    return inspector.tables()
  }

  async retrieveTable(tableName: string, schema?: string): Promise<Table> {
    const inspector = createInspector(this.database)
    if (schema) {
      inspector.withSchema?.(schema)
    } else if (this.connexion.schema) {
      inspector.withSchema?.(this.connexion.schema)
    }
    const result: Table = await inspector.tableInfo(tableName)
    result.fields = await inspector.columnInfo(tableName)
    return result
  }

  async applyMigration(migrationItems: DiffItem[]): Promise<void> {
    adapterLogger.info('migration applying for schema %s...', this.connexion.schema)
    const itemsCreated: string[] = []
    if (this.connexion.schema) this.database.schema.withSchema(this.connexion.schema)

    /**
     * Create a transaction
     */
    const transaction = await this.database.transaction()
    try {
      /**
       * First, create all tables that need to be created
       * and their fields
       */
      const tables = migrationItems.filter(
        (m) => m.target === 'TABLE' && m.action === 'CREATE',
      ) as DiffItemTable[]
      const fields = migrationItems.filter(
        (m) => m.target === 'FIELD' && m.action === 'CREATE',
      ) as DiffItemField[]
      const relations = migrationItems.filter(
        (m) => m.target === 'RELATION' && m.action === 'CREATE',
      ) as DiffItemRelation[]
      const query = this.database.schema
      tables.forEach((t) => {
        const tableName = t.settings.name
        adapterLogger.info('creating table %s', tableName)

        const tableFields = fields.filter((f) => f.settings.table === tableName)
        const tableRelations = relations.filter((r) => r.settings.fromTable === tableName)

        t.settings.schema && query.withSchema(t.settings.schema)
        query.createTable(tableName, (table) => {
          t.settings.documentation && table.comment(t.settings.documentation)
          tableFields.forEach((f) => {
            const fieldName = f.settings.name
            adapterLogger.info('creating column %s.%s', tableName, f.settings.name)
            let field: Knex.ColumnBuilder
            switch (f.settings.dbType as DB_TYPE) {
              case 'uuid':
                field = table.uuid(fieldName)
                if (f.settings.primary) field.defaultTo(this.database.raw('gen_random_uuid()'))
                break
              case 'datetime':
              case 'timestamp':
              case 'timestamptz':
              case 'timestamp with time zone':
                field = table.datetime(fieldName)
                break
              case 'integer':
                field = table.integer(fieldName)
                break
              case 'geometry':
                field = table.geometry(fieldName)
                break
              default:
                field = table.string(fieldName)
            }
            if (f.settings.default) {
              switch (f.settings.dbType as DB_TYPE) {
                case 'datetime':
                case 'date':
                  if (f.settings.default === 'NOW') field.defaultTo(this.database.fn.now())
                  break
                default:
                  field.defaultTo(f.settings.default)
              }
            }
            if (f.settings.unique) field.unique()
            if (f.settings.primary) field.primary()
            if (!f.settings.nullable) field.notNullable()
            // if (f.settings.indexable) {
            //   table.index(fieldName)
            // }
            f.settings.documentation && field.comment(f.settings.documentation)

            itemsCreated.push(`${tableName as string}.${fieldName as string}`)
          })
          tableRelations.forEach((r) => {
            adapterLogger.info(
              'creating foreign key %s.%s with name %s',
              tableName,
              r.settings.fromField,
              r.settings.name,
            )
            table
              .foreign(r.settings.fromField, r.settings.name)
              .references(r.settings.toField)
              .inTable(`${r.settings.toSchema as string}.${r.settings.toTable as string}`)
          })
          itemsCreated.push(`${tableName as string}`)
        })
      })

      /**
       * Then, create all fields that need to be created
       * for existing tables
       */

      /**
       * Add new relations / constraint
       */

      /**
       * Then, updates all tables that need to be updated
       */

      /**
       * Fields to be udpated
       */

      /**
       * Relations...
       */

      /**
       * Now, remove old stuff
       */

      await query

      await transaction.commit()
    } catch (error: any) {
      adapterLogger.error('migration did not succeed.', error)
      await transaction.rollback()
    }
    adapterLogger.info('end of migration')
  }

  async query<T>(
    tableName: string,
    params?: any,
  ): Promise<PaginatedResult<T> | FeatureCollectionResult<T>> {
    adapterLogger.debug('queryTable %s', tableName)
    const {
      $limit = 20,
      $skip = 0,
      $joinRelated,
      $output,
      $select,
      ...realQuery
    } = params?.query ?? {}

    const result: PaginatedResult<T | FeatureCollection<Geometry, T>> = {
      total: 0,
      limit: $limit,
      skip: $skip,
      // @ts-ignore
      data:
        $output === 'geojson'
          ? ({ type: 'FeatureCollection', features: [] } as FeatureCollection<Geometry, T>)
          : ([] as T[]),
    }
    const model = this.databaseObjectionModel[tableName]

    if (!model) throw new Error(`Table ${tableName} is unknown.`)

    const query = model.query(this.database)

    if ($limit > -1) query.limit($limit).offset($skip)

    /**
     * Compute the count distinct value,
     * to provide it for count distinct on the total query,
     * needed for pagination result.
     */
    let countDistinctOn: ColumnRef[] = []
    if (Array.isArray(model.idColumn)) {
      countDistinctOn = model.idColumn.map((c) => `${model.tableName}.${c}`)
    } else {
      countDistinctOn = [`${model.tableName}.${model.idColumn}`]
    }

    // const totalQuery = model.query(this.database).countDistinct(...model.idColumn) // tableName + '.id', { as: 'count' })
    const totalQuery = model.query(this.database).countDistinct(countDistinctOn)

    if (this.connexion.type === 'pg') {
      if (this.connexion.schema) {
        adapterLogger.debug('set search path for queries to %s', this.connexion.schema)
        query.withSchema?.(this.connexion.schema)
        totalQuery.withSchema?.(this.connexion.schema)
      }
    }

    if ($joinRelated) {
      /**
       * Add relation to the query,
       * $joinRelated need to be an array
       */
      if (Array.isArray($joinRelated)) {
        $joinRelated.forEach((r) => {
          adapterLogger.debug('left join with fetch ', r)

          query.withGraphFetched(r)
          query.leftJoinRelated(r)

          // we do the join only, without fetching the graph
          totalQuery.leftJoinRelated(r)

          /**
           * Find if some $select rules
           * apply to the current relation,
           * and so apply it to the select of graphFetched
           */
          adapterLogger.debug($select)
          if ($select) {
            const allSubSelect: string[] = []
            $select.forEach((currentSelect: string, index: number) => {
              if (currentSelect.indexOf(r) === 0) {
                adapterLogger.debug('$select for relation ', r, currentSelect)
                allSubSelect.push(currentSelect)
                $select.splice(index, 1)
              }
            })
            if (allSubSelect.length > 0) {
              query.modifyGraph(r, (builder) => {
                builder.select(allSubSelect)
              })
            }
          }
          /**
           * Find if there is a realQuery key related to this relation
           */
          // const relationQuery = Object.keys(realQuery).filter(
          //   (key) => key.indexOf(r) === 0
          // )
          // relationQuery.forEach((rq) => {
          //   adapterLogger.debug('fetch joined modify graph', rq, r, {
          //     [rq.substring(r.length + 1)]: realQuery[rq],
          //   })
          //   query.modifyGraph(r, (builder) =>
          //     objectify(builder, {
          //       [rq.substring(r.length + 1)]: realQuery[rq],
          //     })
          //   )
          //   objectify(query, { rq: realQuery[rq] })
          //   delete realQuery[rq]
          // })
        })
      }
    }

    if ($output === 'geojson') {
      if (this.connexion.type !== 'pg' && !model.hasGeomColumn)
        throw new Error('output "geojson" can only be used on pg connexions.')
      query.alias('agj').select(raw('ST_asGeoJSON(agj.*)::jsonb').as('data'))
    } else if ($select) {
      const selectFields = Array.isArray($select) ? $select : [$select]
      /**
       * for each field, add the table as a prefix if not set
       */
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      query.select(selectFields)
    }

    adapterLogger.debug('real query', realQuery)
    /**
     * Remove id filter to add tableName in front of to avoid incoherence
     * TODO: need to be recursive
     */
    Object.keys(realQuery)
      .filter((k) => k === 'id')
      .forEach((k) => {
        realQuery[tableName + '.id'] = realQuery.id
        delete realQuery.id
      })

    objectify(totalQuery, realQuery)
    const total = (await totalQuery) as unknown as Array<{
      count: string
    }>
    result.total = parseInt(total[0].count, 10)

    adapterLogger.info(realQuery, $select)
    objectify(query, realQuery)

    const resultQuery = (await query) as unknown as any[]
    if ($output === 'geojson') {
      const features = resultQuery.map((r) => r.data)
      // @ts-ignore
      result.data = {
        type: 'FeatureCollection',
        features,
      } as FeatureCollection<Geometry, T>
    } else result.data = resultQuery as T[]

    return result
  }

  async get<T>(tableName: string, id: string | number, params?: any): Promise<T> {
    adapterLogger.debug(tableName, id, this.databaseObjectionModel)
    const { $joinRelated, $select } = params?.query ?? {}

    const model = this.databaseObjectionModel[tableName]

    if (!model) throw new Error(`Table ${tableName} is unknown.`)

    const query = model.query(this.database)

    if ($joinRelated) {
      /**
       * Add relation to the query,
       * $joinRelated need to be an array
       */
      if (Array.isArray($joinRelated)) {
        $joinRelated.forEach((r) => {
          query.withGraphFetched(r)

          query.joinRelated(r)

          /**
           * Find if some $select rules
           * apply to the current relation,
           * and so apply it to the select of graphFetched
           */
          if ($select) {
            const allSubSelect: string[] = []
            $select.forEach((currentSelect: string, index: number) => {
              if (currentSelect.startsWith(r)) {
                adapterLogger.debug('$select for relation ', r, currentSelect)
                allSubSelect.push(currentSelect)
                $select.splice(index, 1)
              }
            })
            if (allSubSelect.length > 0) {
              query.modifyGraph(r, (builder) => {
                builder.select(allSubSelect)
              })
            }
          }
          /**
           * Find if there is a realQuery key related to this relation
           */
          // const relationQuery = Object.keys(realQuery).filter(
          //   (key) => key.indexOf(r) === 0
          // )
          // relationQuery.forEach((rq) => {
          //   adapterLogger.debug('fetch joined modify graph', rq, r, {
          //     [rq.substring(r.length + 1)]: realQuery[rq],
          //   })
          //   query.modifyGraph(r, (builder) =>
          //     objectify(builder, {
          //       [rq.substring(r.length + 1)]: realQuery[rq],
          //     })
          //   )
          //   objectify(query, { rq: realQuery[rq] })
          //   delete realQuery[rq]
          // })
        })
      }
    }

    if ($select) {
      const selectFields = Array.isArray($select) ? $select : [$select]
      /**
       * for each field, add the table as a prefix if not set
       */
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      query.select(selectFields)
    }
    if (this.connexion.type === 'pg') {
      if (this.connexion.schema) {
        adapterLogger.info('set search path for queries to %s', this.connexion.schema)
        query.withSchema?.(this.connexion.schema)
      }
    }

    const result = await query.findById(id)
    return result as unknown as T
  }

  async create<T extends TableRecord<T>>(tableName: string, data: Partial<T>): Promise<T> {
    const currentModel = this.databaseObjectionModel[tableName]
    adapterLogger.debug('create', tableName, data)
    adapterLogger.debug('create', currentModel)
    adapterLogger.debug(currentModel)

    /**
     * Check if any data inserted is a geom one
     */
    const geomColumns = currentModel.geomColumns
    Object.keys(data).forEach((dataKey) => {
      if (geomColumns.includes(dataKey)) {
        // @ts-ignore
        data[dataKey] = raw(`ST_GeomFromText(?)`, [data[dataKey]])
      }
    })
    const query = currentModel.query(this.database).insert(data)

    if (this.connexion.type === 'pg') {
      if (this.connexion.schema) {
        adapterLogger.info('set search path for queries to %s', this.connexion.schema)
        query.withSchema?.(this.connexion.schema)
      }
    }
    const result = await query

    return result as unknown as T
  }

  async update<T>(tableName: string, id: string | number, record: Partial<T>): Promise<T> {
    adapterLogger.debug('update', tableName, id, record)
    adapterLogger.debug('update', this.databaseObjectionModel[tableName])
    const queryFind = this.databaseObjectionModel[tableName].query(this.database).findById(id)
    const query = this.databaseObjectionModel[tableName]
      .query(this.database)
      .updateAndFetchById(id, record)

    if (this.connexion.type === 'pg') {
      if (this.connexion.schema) {
        adapterLogger.info('set search path for queries to %s', this.connexion.schema)
        queryFind.withSchema?.(this.connexion.schema)
        query.withSchema?.(this.connexion.schema)
      }
    }

    const object = await queryFind // this will raise an error if not found

    adapterLogger.debug(object)

    return (await query) as unknown as T
  }

  async patch<T>(tableName: string, id: string | number, record: Partial<T>): Promise<T> {
    adapterLogger.debug('patch', tableName, id, record)
    adapterLogger.debug('patch', this.databaseObjectionModel[tableName])
    const queryFind = this.databaseObjectionModel[tableName].query(this.database).findById(id)
    const query = this.databaseObjectionModel[tableName]
      .query(this.database)
      .patchAndFetchById(id, record)

    if (this.connexion.type === 'pg') {
      if (this.connexion.schema) {
        adapterLogger.info('set search path for queries to %s', this.connexion.schema)
        queryFind.withSchema?.(this.connexion.schema)
        query.withSchema?.(this.connexion.schema)
      }
    }

    const object = await queryFind // this will raise an error if not found

    adapterLogger.debug(object)

    return (await query) as unknown as T
  }

  async delete<T>(tableName: string, id: string | number): Promise<T | null> {
    adapterLogger.debug('delete', tableName, id)
    adapterLogger.debug('delete', this.databaseObjectionModel[tableName])
    const queryFind = this.databaseObjectionModel[tableName].query(this.database).findById(id)
    const query = this.databaseObjectionModel[tableName].query(this.database).deleteById(id)

    if (this.connexion.type === 'pg') {
      if (this.connexion.schema) {
        adapterLogger.info('set search path for queries to %s', this.connexion.schema)
        queryFind.withSchema?.(this.connexion.schema)
        query.withSchema?.(this.connexion.schema)
      }
    }

    const object = await queryFind // this will raise an error if not found

    adapterLogger.debug(object)

    return (await query) as unknown as T
  }
}
