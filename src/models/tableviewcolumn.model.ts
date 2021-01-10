/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'

export class TableViewColumn extends BaseModel {
  /* reference to the table view id */
  table_column_id!: string;
  /* reference to the table column id */
  table_view_id!: string;
  /* order of the column in the view table */
  position?: number;
  /* filter according to Default Query Operators of Feathersjs (e.g `{"$eq": "{userId}"}`) */
  filter?: object;
  /* inject style css rules to the column (e.g `{"width": 583}`) */
  style?: object;
  /* whether the column is displayed for users available. */
  displayed?: boolean;
  /* whether the column is transmitted to the platform. Default value: `true` */
  transmitted?: boolean;
  /* whether the column is editable. */
  editable?: boolean;
  /* value which specify a data/template in order to parameterize a behaviour (e.g `{rowId}`) */
  default?: string;

  static get idColumn (): string[] {
    return [
      'table_view_id',
      'table_column_id'
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
        filter: { type: ['object', 'null'] },
        style: { type: ['object', 'null'] },
        displayed: { type: ['boolean', 'null'], default: true },
        transmitted: { type: ['boolean', 'null'],},
        editable: { type: ['boolean', 'null'], default: false },
        default: { type: ['string', 'null'] }
      }
    }
  }

  $beforeInsert (): void {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate (): void {
    this.updatedAt = new Date().toISOString()
  }
}

export default function (app: Application): typeof TableViewColumn {
  return TableViewColumn
}
