/* eslint-disable camelcase */

import { pgDbTypes } from './pg/dbType'
import { sqliteDbTypes } from './sqlite/dbType'

/**
 * Ids are not in order,
 * this is for retrocompatibility with 0.x version
 */
export const FIELD_TYPE = Object.freeze({
  /**
   * Keep the original type,
   * for providing a basic input to the end user
   */
  NATIVE: 'NATIVE',

  /**
   * Ids
   */
  ID_NUMBER: 'ID_NUMBER',
  ID_UUID: 'ID_UUID',

  /**
   * Primitives
   */
  BOOLEAN: 'BOOLEAN',

  NUMBER: 'NUMBER',
  FLOAT: 'FLOAT',

  STRING: 'STRING',
  TEXT: 'TEXT',

  DATE: 'DATE',
  DATETIME: 'DATETIME',

  UUID: 'UUID',

  /**
   * Users / groups
   */
  USER: 'USER',
  GROUP: 'GROUP',
  MULTI_USER: 'MULTI_USER',
  MULTI_GROUP: 'MULTI_GROUP',

  /**
   * Schema
   */
  RELATION: 'RELATION',
  LOOKUP: 'LOOKUP',
  VIRTUAL_LOOKUP: 'VIRTUAL_LOOKUP',
  ROLLUP: 'ROLLUP',

  /**
   * Complex
   */
  SINGLE_SELECT: 'SINGLE_SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  FORMULA: 'FORMULA',
  JSON: 'JSON',
  NETWORK: 'NETWORK', // IPv4 / IPv6 with optional netmask

  /**
   * Media
   */
  MEDIA: 'MEDIA',
  URL: 'URL',

  /**
   * Geometry
   */
  GEOMETRY: 'GEOMETRY', // no control will be done to check validity of geometry
  GEOMETRY_POINT: 'GEOMETRY_POINT',
  GEOMETRY_POLYGON: 'GEOMETRY_POLYGON',
  GEOMETRY_LINESTRING: 'GEOMETRY_LINESTRING',
  GEOMETRY_MULTIPOINT: 'GEOMETRY_MULTIPOINT',
  GEOMETRY_MULTIPOLYGON: 'GEOMETRY_MULTIPOLYGON',
  GEOMETRY_MULTILINESTRING: 'GEOMETRY_MULTILINESTRING',
})

export type DB_TYPE = pgDbTypes | sqliteDbTypes
export type DB_DIALECT = 'pg' | 'sqlite3'

export function convertDBTypeToFieldType(
  dbDialect: DB_DIALECT,
  dbType: DB_TYPE | undefined,
  primary: boolean = false,
): keyof typeof FIELD_TYPE {
  if (!dbDialect) throw new Error('Dialect undefined.')
  if (!dbType) throw new Error('Data type undefined.')

  const arrayDeep = (dbType.match(/\[\]/g) || []).length
  if (arrayDeep > 0) return FIELD_TYPE.NATIVE

  switch (dbDialect) {
    /**
     * Check https://www.postgresql.org/docs/current/datatype.html
     */
    case 'pg':
      // we lower the db type as it can be sometimes UPPERCASE
      switch (dbType.toLowerCase() as pgDbTypes) {
        /**
         * Boolean fields
         */
        case 'boolean':
          return FIELD_TYPE.BOOLEAN

        /**
         * Date fields
         */
        case 'date':
          return FIELD_TYPE.DATE
        case 'timestamp':
        case 'timestamp without time zone':
        case 'timestamp with time zone':
        case 'timestamptz':
          return FIELD_TYPE.DATETIME

        /**
         * Numeric fields
         */
        case 'smallint':
        case 'integer':
        case 'bigint':
          return primary ? FIELD_TYPE.ID_NUMBER : FIELD_TYPE.NUMBER
        case 'numeric':
          return FIELD_TYPE.FLOAT

        /**
         * String fields
         */
        case 'character varying':
          return FIELD_TYPE.STRING
        case 'text':
          return FIELD_TYPE.TEXT

        /**
         * Geometry fields
         */
        case 'geometry':
        case 'geography':
          return FIELD_TYPE.GEOMETRY
        case 'point':
          return FIELD_TYPE.GEOMETRY_POINT
        case 'polygon':
          return FIELD_TYPE.GEOMETRY_POLYGON

        /**
         * Other types
         */
        case 'jsonb':
          return FIELD_TYPE.JSON
        case 'inet':
          return FIELD_TYPE.NETWORK
        case 'uuid':
          return primary ? FIELD_TYPE.ID_UUID : FIELD_TYPE.UUID
        default:
          if (process.env.NODE_ENV === 'production') {
            console.warn('New data type found without matching field type : ' + dbType)
            return FIELD_TYPE.STRING
          }
      }
      break
    /**
     * Check https://www.sqlite.org/datatype3.html
     */
    case 'sqlite3':
      switch (dbType as sqliteDbTypes) {
        case 'bool':
          return FIELD_TYPE.BOOLEAN
        case 'datetime':
          return FIELD_TYPE.DATETIME
        case 'date':
          return FIELD_TYPE.DATE
        case 'smallintunsigned':
        case 'integer':
          return FIELD_TYPE.NUMBER
        case 'decimal':
        case 'float':
          return FIELD_TYPE.FLOAT
        case 'varchar':
          return FIELD_TYPE.STRING
        case 'text':
          return FIELD_TYPE.TEXT
        default:
          if (process.env.NODE_ENV === 'production') {
            console.warn('New data type found without matching field type : ' + dbType)
            return FIELD_TYPE.STRING
          }
          throw new Error('New data type found without matching field type : ' + dbType)
      }
    default:
      throw new Error(`New dialect found without matching : ${dbDialect as string}`)
  }

  throw new Error(`No matching found for dialect ${dbDialect} and type ${dbType}`)
}
