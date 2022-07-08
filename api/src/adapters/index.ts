import { Params } from '@feathersjs/feathers';
import Knex from 'knex';
import schemaInspector from 'knex-schema-inspector';
import { Column } from 'knex-schema-inspector/dist/types/column';

export class LckDBAdapter {
  type
  options

  constructor (type: string, options: any) {
    this.type = type
    this.options = options
  }

  /**
   * Depending the adapter type,
   * retrieve the remote schema.
   *
   * If type is a database, will ask the DB metadata
   *
   * If type is API like, will ask for an Open API spec ?
   */
   async retrieveSchema () {
    const result: any[] = []
    switch (this.type) {
      case 'sqlite3':
      case 'pg':
        const database = Knex({
          client: this.type,
          connection: this.options,
        });
        const inspector = schemaInspector(database);
        const tables =  await inspector.tables()
        await Promise.all(
          tables.map(async (tableName: string) => {
            const columnInfos = await inspector.columnInfo(tableName)
            result.push({
              name: tableName,
              columns: columnInfos
            })
          })
        )
        break
      case 'baserow':
        await Promise.all(this.options.tableIds.map(async (id: number) => {
          const response = await fetch(this.options.apiURL + 'api/database/fields/table/' + id + '/', {
            headers: {
              Authorization: 'Token ' + this.options.token
            },
          })
          const tableFields = await response.json()
          console.log(tableFields)
          result.push({
            name: 'table_' + id,
            columns: tableFields.map((f: any) => ({
              name: 'field_' + f.id.toString(),
              label: f.name
            }))
          })
        }))
    }
    return result
  }

  async retrieveTables () {
    const database = Knex({
      client: this.type,
      connection: this.options,
    });
    const inspector = schemaInspector(database);
    const tables =  await inspector.tables()
    return tables
  }

  async retrieveTableSchema (tableName: string) {
    const database = Knex({
      client: this.type,
      connection: this.options,
    });
    const result = {
      name: tableName,
      columns: [] as Column[]
    }
    const inspector = schemaInspector(database);
    result.columns = await inspector.columnInfo(tableName)
    return result
  }

  async retrieveTable (tableName: string) {
    const database = Knex({
      client: this.type,
      connection: this.options,
    });
    const inspector = schemaInspector(database);
    const result = await inspector.tableInfo(tableName)
    return result
  }

  async queryTable (tableName: string, params: Params) {
    switch (this.type) {
      case 'sqlite3':
      case 'pg':
        const database = Knex({
          client: this.type,
          connection: this.options,
        })
        const query = database.table(tableName).select()
        if (params.query?.$limit) query.limit(params.query.$limit)
        if (params.query?.$offset) query.offset(params.query.$offset)
        if (params.query?.$relations) {
          /**
           * Add relation to the query, 
           * $relations need to be an array
           */
          if (Array.isArray(params.query?.$relations)) {
            params.query?.$relations.forEach(r => {
              console.log('join ', r)
              query.join(r, tableName + '.' + r + '_id', r + '.id')
                .select(tableName + '.*', r + '.*')
            })
          }
        }
        console.log(query.toSQL())
        const result = await query
        return result

      case 'baserow':
        const apiURL = this.options.apiURL + 'api/database/rows/table/' + tableName.replace('table_','') + '/';
        const response = await fetch(apiURL, {
          headers: {
            Authorization: 'Token ' + this.options.token
          },
        })
        const rows = await response.json()
        return rows.results
    }
  }

  async createRecord  (tableName: string, data: any) {
    console.log('create record', tableName, data)
    switch (this.type) {
      case 'sqlite3':
      case 'pg':
        const database = Knex({
          client: this.type,
          connection: this.options,
        })
        console.log(data)
        const query = database.insert(data).into(tableName)
        return await query
      case 'baserow':
        const apiURL = this.options.apiURL + 'api/database/rows/table/' + tableName.replace('table_','') + '/';
        const response = await fetch(apiURL, {
          headers: {
            Authorization: 'Token ' + this.options.token
          },
        })
        const rows = await response.json()
        return rows.results
    }
  }
}

export default LckDBAdapter
