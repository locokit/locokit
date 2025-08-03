/**
 * Field type LocoKit accept in its metamodel
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

  /**
   * Arrays of
   */
  ARRAY_TEXT: 'ARRAY_TEXT',
  ARRAY_UUID: 'ARRAY_UUID',
  ARRAY_BOOLEAN: 'ARRAY_BOOLEAN',
  ARRAY_NUMBER: 'ARRAY_NUMBER',
  ARRAY_DATE: 'ARRAY_DATE',
})
export type LocoKitFieldTypeId = keyof typeof FIELD_TYPE

/**
 * Component to use for a field,
 * it can be for input, but also only-display purpose
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
  MULTI_SELECT: 'MULTI_SELECT',

  SPECIFIC_COMPONENT: 'SPECIFIC_COMPONENT',
})
export type LocoKitFieldComponentId = keyof typeof FIELD_COMPONENT

/**
 * Basic value for a field
 */
export type LocoKitTableFieldValue =
  | number
  | string
  | boolean
  | number[]
  | string[]
  | boolean[]
  | undefined
  | null
  | Object
  | Object[]

export type LocoKitTableFieldComplexValue = Record<string, LocoKitTableFieldValue>
