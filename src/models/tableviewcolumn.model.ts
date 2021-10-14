/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'

export class TableViewColumn extends BaseModel {
  /* reference to the table view id */
  table_column_id!: string
  /* reference to the table column id */
  table_view_id!: string
  /* order of the column in the view table */
  position?: number
  /* filter according to Default Query Operators of Feathersjs (e.g `{"$eq": "{userId}"}`) */
  filter?: object
  /* filter from data contained in the foreign table (for user, group, or relation between tables columns...)
   * according to Default Query Operators of Feathersjs (e.g `{"data": { "p1" : "2" }}`)
   */
  foreign_filter?: object
  /* inject style css rules to the column (e.g `{"width": 583}`) */
  style?: object
  /* whether the column has to be displayed */
  displayed?: boolean
  /* whether the column is transmitted in the API response. Default value: `true` */
  transmitted?: boolean
  /* whether the column is editable. */
  editable?: boolean
  /* value which specify a data/template in order to parameterize a behaviour (e.g `{rowId}`) */
  default?: Record<string, any>
  /* sorts values into a column. (e.g `ASC` or `DESC`) */
  sort?: string
  /* value is required for this column. */
  /* TODO: delete this field, but be sure that's not used */
  required?: boolean
  /**
   * used for conditional display for a field
   * could be $eq / $in / $ne operator,
   * associated to a value or a set of values.
   */
  display_conditions?: Array<{
    field_id: string
    operator: '$eq' | '$in' | '$ne'
    value: string | number | string[] | number []
  }>

  static get idColumn (): string[] {
    return [
      'table_view_id',
      'table_column_id',
    ]
  }

  static get tableName (): string {
    return 'table_view_has_table_column'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      properties: {
        createdAt: { type: ['string', 'null'] },
        updatedAt: { type: ['string', 'null'] },
        position: { type: ['number', 'null'] },
        sort: { type: ['string', 'null'] },
        filter: { type: ['object', 'null'] },
        foreign_filter: { type: ['object', 'null'] },
        style: { type: ['object', 'null'] },
        displayed: { type: ['boolean', 'null'], default: true },
        transmitted: { type: ['boolean', 'null'] },
        editable: { type: ['boolean', 'null'], default: false },
        default: { type: ['object', 'null'] },
        required: { type: 'boolean', default: false },
        display_conditions: {
          type: ['array', 'null'],
          items: {
            type: 'object',
            properties: {
              field_id: {
                type: 'string',
              },
              operator: {
                type: 'string',
                enum: ['$eq', '$in', '$ne'],
              },
              value: {
                type: ['string', 'number'],
              },
            },
          },
        },
      },
    }
  }
}

export default function (app: Application): typeof TableViewColumn {
  return TableViewColumn
}
