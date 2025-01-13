import { type Column, type Table as KnexInspectorTable, type ForeignKey } from '@directus/schema'
import { Params } from '@feathersjs/feathers'
import { DiffItem } from '@locokit/definitions'
import { FeatureCollection, Geometry } from 'geojson'

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

export interface FeatureCollectionResult<T> {
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
   * Single record
   */
  data: FeatureCollection<Geometry, T>
}

export type GenericAdapter = {
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

  query: <T extends TableRecord<T>>(
    tableName: string,
    params?: Params & { query: Record<string, any> },
  ) => Promise<PaginatedResult<T> | FeatureCollectionResult<T>>

  get: <T extends TableRecord<T>>(
    tableName: string,
    id: string | number,
    params?: Params & { query: Record<string, any> },
  ) => Promise<T>

  create: <T extends TableRecord<T>>(tableName: string, record: Partial<T>) => Promise<T>

  patch: <T extends TableRecord<T>, PatchData extends Partial<T> = Partial<T>>(
    tableName: string,
    id: string | number,
    record: PatchData,
  ) => Promise<T>

  update: <T extends TableRecord<T>, UpdateData extends Partial<T> = Partial<T>>(
    tableName: string,
    id: string | number,
    record: UpdateData,
  ) => Promise<T>

  delete: <T extends TableRecord<T>>(tableName: string, id: string | number) => Promise<T | null>
}
