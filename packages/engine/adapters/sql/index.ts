/* eslint-disable @typescript-eslint/no-floating-promises */
import { Params } from '@feathersjs/feathers'
import knex, { Knex } from 'knex'
import schemaInspector from 'knex-schema-inspector'
import { Column } from 'knex-schema-inspector/dist/types/column'
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

const implementedEngines = ['sqlite3', 'pg']

export class SQLAdapter implements GenericAdapter {
  database: Knex
  databaseObjectionModel: Record<string, typeof Model> = {}

  constructor(connexion: ConnexionSQL) {
    /**
     * Check the type is well known for SQL
     */
    if (!implementedEngines.includes(connexion.type))
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        'This engine is unknown. Please use one of ' + implementedEngines.concat(', ') + '.',
      )
    this.database = knex({
      client: connexion.type,
      connection: connexion.options,
      debug: true,
    })
  }

  /**
   * Init the adapter by retrieving sql schema,
   * create objection model according table + columns schema
   */
  async boot(): Promise<void> {

    const inspector = schemaInspector(this.database)
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
      { name: string; columns: Column[]; relations: Record<string, any> }
    > = tableNames.reduce(
      (accumulator, current) => ({
        ...accumulator,
        [current]: { name: current, columns: [], relations: [] },
      }),
      {},
    )
    /**
     * Fetch also all column info for all of the table
     */
    await Promise.all(
      tableNames.map(async (tableName) => {
        const columnInfos = await inspector.columnInfo(tableName)
        tables[tableName].columns = columnInfos
        columnInfos.forEach((c) => {
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
      }),
    )
    const allModels = this.databaseObjectionModel

    Object.keys(tables).forEach((tableName) => {
      const t = tables[tableName]
      const idColumns = t.columns.filter((c) => c.is_primary_key)
      allModels[tableName] = class extends Model {
        static get tableName(): string {
          return tableName
        }

        static get idColumn(): string | string[] {
          if (idColumns) {
            if (idColumns.length === 1) return idColumns[0].name
            return idColumns.map((c) => c.name)
          }
          return 'id'
        }

        static get jsonSchema(): JSONSchema {
          const schema = {
            type: 'object',
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            properties: {} as Record<string, JSONSchemaDefinition>,
          }

          t.columns.forEach((c) => {
            /**
             * We convert the SQL type into a JSON one
             */
            const propertyType = [getJSONTypeFromSQLType(c.data_type)]
            /**
             * If the field is nullable,
             * we add to field's types the `null` one.
             */
            if (c.is_nullable) propertyType.push('null')
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
  async retrieveSchema() {
    const result: Table[] = []
    const inspector = schemaInspector(this.database)
    const tables = await inspector.tables()
    await Promise.all(
      tables.map(async (tableName: string) => {
        const table = await inspector.tableInfo(tableName)
        const columnInfos = await inspector.columnInfo(tableName)
        result.push({
          ...table,
          fields: columnInfos,
        })
      }),
    )
    return result
  }

  async retrieveTables() {
    const inspector = schemaInspector(this.database)
    const tables = await inspector.tables()
    return tables
  }

  async retrieveTableSchema(tableName: string) {
    const result = {
      name: tableName,
      fields: [] as Field[],
    }
    const inspector = schemaInspector(this.database)
    result.fields = await inspector.columnInfo(tableName)
    return result
  }

  async retrieveTable(tableName: string) {
    const inspector = schemaInspector(this.database)
    const result = await inspector.tableInfo(tableName)
    return result
  }

  async queryTable<T>(tableName: string, params?: Params): Promise<PaginatedResult<T>> {
    console.log('queryTable', tableName, params?.query)
    const { $limit = 20, $offset = 0, $joinRelated, $select, ...realQuery } = params?.query ?? {}

    console.log($limit, $offset, $joinRelated, realQuery)
    const result = {
      total: 0,
      limit: $limit,
      offset: $offset,
      data: [] as T[],
    }

    const model = this.databaseObjectionModel[tableName]

    if (!model) throw new Error(`Table ${tableName} is unknown.`)

    const query = model.query(this.database).limit($limit).offset($offset)
    const totalQuery = model.query(this.database).countDistinct(tableName + '.id', { as: 'count' })

    if ($joinRelated) {
      /**
       * Add relation to the query,
       * $joinRelated need to be an array
       */
      if (Array.isArray($joinRelated)) {
        $joinRelated.forEach((r) => {
          console.log('join ', r)
          query.withGraphFetched(r)
          totalQuery.withGraphFetched(r)

          query.joinRelated(r)
          totalQuery.joinRelated(r)

          /**
           * Find if some $select rules
           * apply to the current relation,
           * and so apply it to the select of graphFetched
           */
          console.log($select)
          if ($select) {
            const allSubSelect: string[] = []
            $select.forEach((currentSelect: string, index: number) => {
              if (currentSelect.indexOf(r) === 0) {
                console.log('$select for relation ', r, currentSelect)
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
          //   console.log('fetch joined modify graph', rq, r, {
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
    console.log('real query', realQuery)
    /**
     * Remove id filter to add tableName in front of to avoid incoherence
     * TODO: need to be recursive
     */
    Object.keys(realQuery).filter(k => k === 'id').forEach(k => {
      realQuery[tableName + '.id'] = realQuery['id']
      delete realQuery['id']
    })
    objectify(totalQuery, realQuery)
    const total = (await totalQuery) as unknown as Array<{
      count: string
    }>
    result.total = parseInt(total[0].count, 10)

    console.log(realQuery, $select)
    objectify(query, realQuery)

    result.data = (await query) as unknown as T[]
    return result
  }

  async getRecord<T>(tableName: string, id: string | number): Promise<T> {
    console.log(tableName, id, this.databaseObjectionModel)
    const result = await this.databaseObjectionModel[tableName].query(this.database).findById(id)
    return result as unknown as T
  }

  async createRecord<T>(tableName: string, data: Partial<T>): Promise<T> {
    console.log('createRecord lck engine', tableName, data)
    console.log('createRecord lck engine', this.databaseObjectionModel[tableName])
    console.log(this.databaseObjectionModel[tableName])

    return (await this.databaseObjectionModel[tableName]
      .query(this.database)
      .insertAndFetch(data)) as unknown as T
  }

  async patchRecord<T>(tableName: string, id: string | number, record: Partial<T>): Promise<T> {
    console.log('patchRecord lck engine', tableName, id, record)
    console.log('patchRecord lck engine', this.databaseObjectionModel[tableName])
    const object = await this.databaseObjectionModel[tableName].query(this.database).findById(id)

    console.log(object)

    console.log(this.databaseObjectionModel[tableName])

    return (await this.databaseObjectionModel[tableName]
      .query(this.database)
      .patchAndFetchById(id, record)) as unknown as T
  }

  async updateRecord<T>(tableName: string, id: string | number, record: Partial<T>): Promise<T> {
    console.log('updateRecord lck engine', tableName, id, record)
    console.log('updateRecord lck engine', this.databaseObjectionModel[tableName])
    const object = await this.databaseObjectionModel[tableName].query(this.database).findById(id)

    console.log(object)

    console.log(this.databaseObjectionModel[tableName])

    return (await this.databaseObjectionModel[tableName]
      .query(this.database)
      .updateAndFetchById(id, record)) as unknown as T
  }

  async deleteRecord(tableName: string, id: string | number): Promise<number> {
    console.log('deleteRecord lck engine', tableName, id)
    console.log('deleteRecord lck engine', this.databaseObjectionModel[tableName])
    const object = await this.databaseObjectionModel[tableName].query(this.database).findById(id)

    console.log(object)

    if (!object) throw new Error('Record not found')

    console.log(this.databaseObjectionModel[tableName])

    return await this.databaseObjectionModel[tableName].query(this.database).deleteById(id)
  }
}
