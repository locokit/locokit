/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection'
import { Application } from '../declarations'

export class TableViewColumn extends Model {
  createdAt!: string;
  updatedAt!: string;
  table_column_id!: string;
  table_view_id!: string;
  position?: number;
  sort?: string;
  filter?: object;
  display?: object;
  visible?: boolean;
  editable?: boolean;

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
        sort: { type: ['string', 'null'] },
        filter: { type: ['object', 'null'] },
        display: { type: ['object', 'null'] },
        visible: { type: ['boolean', 'null'] },
        editable: { type: ['boolean', 'null'] }
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
