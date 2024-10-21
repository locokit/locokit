/* eslint-disable @typescript-eslint/no-floating-promises */
import knex, { Knex } from 'knex'
import { createInspector, type Column, type ForeignKey } from '@directus/schema'
import { ConnexionSQL, GenericAdapter, Field, Table, PaginatedResult } from '../interface'
import {
  Model,
  JSONSchema,
  JSONSchemaDefinition,
  RelationMappings,
  RelationMappingsThunk,
} from 'objection'
import { getJSONTypeFromSQLType } from '../../utils/sqlTypeConverter'
import { objectify } from './objectify'
import { logger } from '../../logger'
import {
  DB_TYPE,
  DiffItem,
  DiffItemField,
  DiffItemRelation,
  DiffItemTable,
} from '@locokit/definitions'

const adapterLogger = logger.child({ service: 'engine', name: 'sql-adapter' })

const implementedEngines = ['sqlite3', 'pg']

export class SQLAdapter implements GenericAdapter {
  database: Knex
  databaseObjectionModel: Record<string, typeof Model> = {}

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
    /**
     * Quick fix for retrieving primary keys
     * when composite keys
     */
    inspector.primary = async (table: string): Promise<string | null> => {
      // @ts-expect-error
      const schemaIn = inspector.explodedSchema.map(
        (schemaName: string) => `${inspector.knex.raw('?', [schemaName])}::regnamespace`,
      )

      const result = await inspector.knex.raw(
        `
       SELECT
          att.attname AS column
        FROM
          (select *, unnest(conkey) as conkey_id from pg_constraint where contype = 'p') as con
        LEFT JOIN pg_class rel ON con.conrelid = rel.oid
        LEFT JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = conkey_id
        WHERE con.connamespace IN (${schemaIn})
          AND con.contype = 'p'
          AND rel.relname = ?
      `,
        [table],
      )

      return result.rows?.map((r: { column: string }) => table + '.' + r.column) ?? null
    }

    if (this.connexion.type === 'pg') {
      if (this.connexion.role) {
        adapterLogger.info('switching role to %s', this.connexion.role)
        await this.database.raw('SET ROLE ??', [this.connexion.role])
      }
      if (this.connexion.schema) {
        adapterLogger.info('set search path to %s', this.connexion.schema)
        await this.database.raw('SET SEARCH_PATH TO ??', [this.connexion.schema])
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
        adapterLogger.info('[boot] inspecting table %s, column %s', tableName, c.name)

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

      allModels[tableName] = class extends Model {
        static get tableName(): string {
          return tableName
        }

        static get idColumn(): string | string[] {
          return t.id || [tableName + '.id']
        }

        static get jsonSchema(): JSONSchema {
          const schema = {
            type: 'object',
            required: [] as string[],
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            properties: {} as Record<string, JSONSchemaDefinition>,
          }

          t.columns.forEach((c) => {
            /**
             * We convert the SQL type into a JSON one
             */
            const propertyType = [getJSONTypeFromSQLType(c.data_type as DB_TYPE)]
            /**
             * If the field is nullable,
             * we add to field's types the `null` one.
             */
            if (c.is_nullable) propertyType.push('null')
            else if (c.default_value === null) schema.required.push(c.name)
            schema.properties[c.name] = {
              type: propertyType,
            }
          })

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
        // remove the double quotes for better comparaison
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

  async retrieveTables() {
    const inspector = createInspector(this.database)
    const tables = await inspector.tables()
    return tables
  }

  async retrieveTable(tableName: string): Promise<Table> {
    const inspector = createInspector(this.database)
    return await inspector.tableInfo(tableName)
  }

  async retrieveTableSchema(tableName: string) {
    const result = {
      name: tableName,
      fields: [] as Field[],
    }
    const inspector = createInspector(this.database)
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

  async query<T>(tableName: string, params?: any): Promise<PaginatedResult<T>> {
    adapterLogger.debug('queryTable %s', tableName)
    const { $limit = 20, $skip = 0, $joinRelated, $select, ...realQuery } = params?.query ?? {}

    adapterLogger.debug($limit, $skip, $joinRelated, realQuery)
    const result = {
      total: 0,
      limit: $limit,
      skip: $skip,
      data: [] as T[],
    }

    const model = this.databaseObjectionModel[tableName]

    if (!model) throw new Error(`Table ${tableName} is unknown.`)

    const query = model.query(this.database).limit($limit).offset($skip)
    const totalQuery = model.query(this.database).countDistinct(...model.idColumn) // tableName + '.id', { as: 'count' })

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

    if ($select) {
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

    result.data = (await query) as unknown as T[]
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

    const result = await query.findById(id)
    return result as unknown as T
  }

  async create<T>(tableName: string, data: Partial<T>): Promise<T> {
    adapterLogger.debug('create', tableName, data)
    adapterLogger.debug('create', this.databaseObjectionModel[tableName])
    adapterLogger.debug(this.databaseObjectionModel[tableName])

    const query = this.databaseObjectionModel[tableName].query(this.database).insert(data)

    if (this.connexion.type === 'pg') {
      if (this.connexion.schema) {
        adapterLogger.info('set search path for queries to %s', this.connexion.schema)
        query.withSchema?.(this.connexion.schema)
      }
    }
    const result = await query

    return result as T
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
