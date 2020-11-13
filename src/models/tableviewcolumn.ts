/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection'
import { Application } from '../declarations'

class TableViewHasTableColumn extends Model {
  createdAt!: string;
  updatedAt!: string;
  table_column_id!: string;
  table_view_id!: string;
  position!: number;
  sort!: string;
  filter!: object;
  display!: object;
  visible!: boolean;
  editable!: boolean;

  static get idColumn () {
    return ['table_column_id', 'table_view_id']
  }

  static get tableName (): string {
    return 'table_view_has_table_column'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',

      properties: {
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        table_column_id: { type: 'string' },
        table_view_id: { type: 'string' },
        position: { type: 'number' },
        sort: { type: 'string' },
        filter: { type: 'object' },
        display: { type: 'object' },
        visible: { type: 'boolean' },
        editable: { type: 'boolean' }
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

export default function (app: Application): typeof TableViewHasTableColumn {
  return TableViewHasTableColumn
}
