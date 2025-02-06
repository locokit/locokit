/* eslint-disable camelcase */

import { pgDbTypes } from './pg/dbType'
import { sqliteDbTypes } from './sqlite/dbType'

/**
 * Ids are not in order,
 * this is for backward compatibility with 0.x version
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
  EMAIL: 'EMAIL',

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

/**
 * Component to use for a field
 */
export const FIELD_COMPONENT = Object.freeze({
  INPUT_CURRENCY: 'INPUT_CURRENCY',
  INPUT_DATE: 'INPUT_DATE',
  INPUT_DATETIME: 'INPUT_DATETIME',
  INPUT_EMAIL: 'INPUT_EMAIL',
  INPUT_FLOAT: 'INPUT_FLOAT',
  INPUT_NUMBER: 'INPUT_NUMBER',
  INPUT_PASSWORD: 'INPUT_PASSWORD',
  INPUT_TEXT: 'INPUT_TEXT',
  INPUT_UUID: 'INPUT_UUID',
  INPUT_CHECKBOX: 'INPUT_CHECKBOX',
  INPUT_RADIO: 'INPUT_RADIO',

  TOGGLE_SWITCH: 'TOGGLE_SWITCH',

  TEXTAREA: 'TEXTAREA',

  AUTOCOMPLETE: 'AUTOCOMPLETE',

  SINGLE_SELECT: 'SINGLE_SELECT',
})

export type DB_TYPE = pgDbTypes | sqliteDbTypes
export type DB_DIALECT = 'pg' | 'sqlite3'
export type LocoKitFieldTypeId = keyof typeof FIELD_TYPE
export type LocoKitFieldComponentId = keyof typeof FIELD_COMPONENT

export function convertDBTypeToFieldType(
  dbDialect: DB_DIALECT,
  dbType: DB_TYPE | undefined,
  primary: boolean = false,
): LocoKitFieldTypeId {
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

export type LocoKitFormFieldRule =
  | {
      fieldId: string
      operator: '$eq'
      value: string | number
    }
  | {
      fieldId: string
      operator: '$in'
      value: string[] | number[]
    }

type LocoKitFormFieldBase = {
  /**
   * Id allowing the form to have unique input ids,
   * ideal for accessibility / label purposes.
   */
  id: string
  /**
   * Label displayed near the input field
   */
  label: string
  /**
   * Description is displayed under the input field
   */
  description?: string | string[]
  /**
   * Class to apply on the input field
   */
  class?: string
  /**
   * What type of data this field is
   */
  type: LocoKitFieldTypeId
  /**
   * Which component to use for display and input purpose
   */
  component: LocoKitFieldComponentId
  /**
   * Validation rules to specify if a field's value is OK
   */
  validationRules?: {
    required?: boolean
    requiredIf?: {
      rules: LocoKitFormFieldRule[]
    }
    minLength?: number
    maxLength?: number
  }
  /**
   * Conditional display of the field,
   * with dedicated rules for displaying it.
   *
   * If it's not displayed,
   * it's not taken in consideration during the form validation process.
   */
  conditionalDisplay?: {
    enabled: boolean
    rules: LocoKitFormFieldRule[]
  }
}

export type LocoKitFormFieldAutocomplete = LocoKitFormFieldBase & {
  component: typeof FIELD_COMPONENT.AUTOCOMPLETE
  /**
   * Indicates if the component accepts an arbitrary value or not. If not,
   * a value must be chosen among the list of suggestions (true by default).
   */
  freeInput?: boolean
  /**
   * Data source to use for the auto-completion
   */
  source: {
    table: string
    label: string
    value: string
    /**
     * Color fields to use for font & background
     */
    colorFields?: {
      text: string
      background?: string
    }
  }
}

export type LocoKitFormFieldSingleSelect = LocoKitFormFieldBase & {
  component: typeof FIELD_COMPONENT.SINGLE_SELECT
  /**
   * Source for the data component
   */
  source: {
    options: unknown[]
    label?: string
    value?: string
    /**
     * Color fields to use for font & background
     */
    colorFields?: {
      text: string
      background?: string
    }
  }
}

export type LocoKitFormFieldTextarea = LocoKitFormFieldBase & {
  component: typeof FIELD_COMPONENT.TEXTAREA
  /**
   * Number of visible rows (6 by default).
   */
  rows?: number
  /**
   * Number of visible columns. If undefined, the component will take up
   * all the available width.
   */
  cols?: number
}

export type LocoKitFormField =
  | LocoKitFormFieldBase
  | LocoKitFormFieldAutocomplete
  | LocoKitFormFieldSingleSelect
  | LocoKitFormFieldTextarea
