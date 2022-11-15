import { Column } from 'knex-schema-inspector/dist/types/column'
import { Params } from '@feathersjs/feathers'

/**
 * Field propertys,
 * related to the Column type of knex-schema-inspector
 */
export type Field = Column

/**
 * Table for a datasource
 */
export interface Table {
  name: string
  fields: Field[]
}

/**
 * TableRecord for a datasource's table
 *
 * Match
 * * a row for a SQL database
 * * a record for an API
 * * a line for a spreadsheet
 */
export type TableRecord<T> = {
  [Property in keyof T]: T[Property]
}

export interface ConnexionSQL {
  type: 'sqlite3' | 'pg'
  options: string
}

export interface ConnexionBaserow {
  type: 'baserow'
  options: {
    apiURL: string
    token: string
    /**
     * Actually, we don't know how to retrieve
     * all table ids of a baserow connexion.
     * So we set them at the init.
     */
    tableIds: number[]
  }
}

export type Connexion = ConnexionSQL | ConnexionBaserow

export interface PaginatedResult<T> {
  /**
   * Total number of records in the requested table
   * according optional filters
   */
  total: number
  /**
   * Maximum number of records retrieved
   */
  limit: number
  /**
   * Offset used to retrieve records
   */
  offset: number
  /**
   * Array of records
   */
  records: Array<TableRecord<T>>
}

export interface GenericAdapter {
  /**
   * Call this function to close properly
   * dependencies or connexions
   */
  destroy: () => Promise<void>

  boot: () => Promise<void>

  /**
   * Retrieve the schema of datasource,
   * mainly tables for SQL databases
   */
  retrieveSchema: () => Promise<Table[]>

  /**
   * Retrieve the schema of a datasource's table.
   *
   * Name, and fields.
   */
  retrieveTableSchema: (tableName: string) => Promise<Table>

  queryTable: <T>(
    tableName: string,
    params?: Params & { query: Record<string, any> },
  ) => Promise<PaginatedResult<T>>

  createRecord: <T>(tableName: string, record: Partial<T>) => Promise<T>

  getRecord: <T>(tableName: string, id: string | number) => Promise<T>

  patchRecord: <T>(
    tableName: string,
    id: string | number,
    record: Partial<T>,
  ) => Promise<T>

  updateRecord: <T>(
    tableName: string,
    id: string | number,
    record: Partial<T>,
  ) => Promise<T>

  deleteRecord: (tableName: string, id: string | number) => Promise<number>
}
