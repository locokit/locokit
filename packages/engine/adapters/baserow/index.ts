import { Params } from '@feathersjs/feathers'
import { ConnexionBaserow, GenericAdapter, Field, Table } from '../interface'

export class BaserowAdapter implements GenericAdapter {
  apiURL
  tableIds
  token

  constructor(connexion: ConnexionBaserow) {
    this.apiURL = connexion.options.apiURL
    this.tableIds = connexion.options.tableIds
    this.token = connexion.options.token
  }

  /**
   * Nothing to destroy for Baserow Adapter
   */
  async destroy() {}

  async boot() {}

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
    await Promise.all(
      this.tableIds.map(async (id: number) => {
        const response = await fetch(this.apiURL + 'api/database/fields/table/' + id + '/', {
          headers: {
            Authorization: 'Token ' + this.token,
          },
        })
        const tableFields = await response.json()
        result.push({
          name: 'table_' + id,
          fields: tableFields.map((f: any) => ({
            name: 'field_' + f.id.toString(),
            label: f.name,
          })),
        })
      }),
    )
    return result
  }

  async retrieveTables() {
    /**
     * TODO: prefer use the api/database/tables/database/{databaseId} endpoint
     * to retrieve all tables of a database
     */
    return this.tableIds.map((id) => 'table_' + id)
  }

  async retrieveTableSchema(tableName: string) {
    const tableId = tableName.replace('table_', '')
    const result = {
      name: tableName,
      fields: [] as Field[],
    }
    const response = await fetch(this.apiURL + 'api/database/fields/table/' + tableId + '/', {
      headers: {
        Authorization: 'Token ' + this.token,
      },
    })
    const tableFields = await response.json()
    result.fields = tableFields.map((f: any) => ({
      name: 'field_' + f.id.toString(),
      label: f.name,
      ...f,
    }))
    return result
  }

  async getRecord<T>(tableName: string, id: string | number) {
    const apiURL =
      this.apiURL + 'api/database/rows/table/' + tableName.replace('table_', '') + '/' + id
    const response = await fetch(apiURL, {
      headers: {
        Authorization: 'Token ' + this.token,
      },
    })
    const rows = await response.json()
    return rows.results
  }

  async queryTable(tableName: string, params?: Params) {
    const apiURL = this.apiURL + 'api/database/rows/table/' + tableName.replace('table_', '') + '/'
    const response = await fetch(apiURL, {
      headers: {
        Authorization: 'Token ' + this.token,
      },
    })
    const rows = await response.json()
    return rows.results
  }

  async createRecord(tableName: string, data: any) {
    console.log('create record', tableName, data)
    const apiURL = this.apiURL + 'api/database/rows/table/' + tableName.replace('table_', '') + '/'
    const response = await fetch(apiURL, {
      headers: {
        Authorization: 'Token ' + this.token,
      },
    })
    const rows = await response.json()
    return rows.results
  }

  async patchRecord<T>(tableName: string, id: string | number, record: Partial<T>) {
    console.log('patch record', tableName, id)
    const apiURL = this.apiURL + 'api/database/rows/table/' + tableName.replace('table_', '') + '/'
    const response = await fetch(apiURL, {
      headers: {
        Authorization: 'Token ' + this.token,
      },
    })
    const rows = await response.json()
    return rows.results
  }

  async updateRecord<T>(tableName: string, id: string | number, record: Partial<T>) {
    console.log('update record', tableName, id)
    const apiURL = this.apiURL + 'api/database/rows/table/' + tableName.replace('table_', '') + '/'
    const response = await fetch(apiURL, {
      headers: {
        Authorization: 'Token ' + this.token,
      },
    })
    const rows = await response.json()
    return rows.results
  }

  async deleteRecord<T>(tableName: string, id: string | number): Promise<T | null> {
    console.log('delete record', tableName, id)
    const apiURL = this.apiURL + 'api/database/rows/table/' + tableName.replace('table_', '') + '/'
    const response = await fetch(apiURL, {
      headers: {
        Authorization: 'Token ' + this.token,
      },
    })
    return null
  }
}
