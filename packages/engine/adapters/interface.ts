import { Column } from 'knex-schema-inspector/dist/types/column'
import { Table as KnexInspectorTable } from 'knex-schema-inspector/dist/types/table'
import { Params } from '@feathersjs/feathers'
import { DiffItem } from '@locokit/definitions'
import { ForeignKey } from 'knex-schema-inspector/dist/types/foreign-key'

/**
 * Field propertys,
 * related to the Column type of knex-schema-inspector
 */
export type Field = Column

/**
 * Table for a datasource
 */
export interface Table extends KnexInspectorTable {
  fields?: Field[]
  foreigns?: ForeignKey[]
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
  role?: string
  schema?: string
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
  skip: number
  /**
   * Array of records
   */
  data: Array<TableRecord<T>>
}

export interface GenericAdapter {
  boot: () => Promise<void>

  /**
   * Call this function to close properly
   * dependencies or connexions
   */
  destroy: () => Promise<void>

  /**
   * Retrieve the schema of datasource,
   * mainly tables for SQL databases
   */
  retrieveSchema: (schema?: string) => Promise<Table[]>

  /**
   * Retrieve the schema of a datasource's table.
   *
   * Name, and fields.
   */
  retrieveTable: (tableName: string) => Promise<Table>

  /**
   * Apply a migration
   */
  applyMigration: (migration: DiffItem[]) => Promise<void>

  query: <T>(
    tableName: string,
    params?: Params & { query: Record<string, any> },
  ) => Promise<PaginatedResult<T>>

  get: <Result>(
    tableName: string,
    id: string | number,
    params?: Params & { query: Record<string, any> },
  ) => Promise<Result>

  create: <Result>(tableName: string, record: Partial<Result>) => Promise<Result>

  patch: <Result, PatchData extends Partial<Result> = Partial<Result>>(
    tableName: string,
    id: string | number,
    record: PatchData,
  ) => Promise<Result>

  update: <Result, UpdateData extends Partial<Result> = Partial<Result>>(
    tableName: string,
    id: string | number,
    record: UpdateData,
  ) => Promise<Result>

  delete: <Result>(tableName: string, id: string | number) => Promise<Result | null>
}
