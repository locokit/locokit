/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, QueryBuilder, RelationMappings, JSONSchema } from 'objection'
import { Application } from '../declarations'
import { TableColumn, TableColumnDTO } from './tablecolumn.model'
import { TableRow } from './tablerow.model'
import { BaseModel } from './base.model'
import { Table } from './table.model'
import { TableAction } from './tableaction.model'

export interface TableViewFilter {
  operator: string
  values: Array<{
    action: string
    column: string
    dbAction: string
    pattern: boolean | number | string | Array<string|number>
  }>
}

export class TableView extends BaseModel {
  columns?: TableColumnDTO[]
  text!: string
  slug!: string
  documentation?: string
  locked!: boolean
  position?: number
  table_id!: string
  table?: Table
  filter?: TableViewFilter

  static get tableName (): string {
    return 'table_view'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text', 'table_id'],

      properties: {
        text: { type: 'string' },
        slug: { type: 'string' },
        table_id: { type: 'string' },
        documentation: { type: 'string' },
        locked: { type: 'boolean' },
        position: { type: ['number', 'null'] },
        filter: { type: ['object', 'null'] },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      columns: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: TableColumn,
        join: {
          from: 'table_view.id',
          through: {
            from: 'table_view_has_table_column.table_view_id',
            to: 'table_view_has_table_column.table_column_id',
            extra: ['displayed', 'filter', 'foreign_filter', 'transmitted', 'position', 'editable', 'style', 'default', 'required', 'display_conditions'],
          },
          to: 'table_column.id',
        },
        modify (query: QueryBuilder<TableColumn>) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          query.clear('limit')
        },
      },
      rows: {
        relation: Model.HasManyRelation,
        modelClass: TableRow,
        join: {
          from: 'table_view.table_id',
          to: 'table_row.table_id',
        },
      },
      table: {
        relation: Model.HasOneRelation,
        modelClass: Table,
        join: {
          from: 'table_view.table_id',
          to: 'table.id',
        },
      },
      actions: {
        relation: Model.ManyToManyRelation,
        modelClass: TableAction,
        join: {
          from: 'table_view.id',
          through: {
            from: 'table_view_has_table_action.table_view_id',
            to: 'table_view_has_table_action.table_action_id',
          },
          to: 'table_action.id',
        },
        modify (query: QueryBuilder<TableColumn>) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          query.clear('limit')
        },
      },
    }
  }
}

export default function (app: Application): typeof TableView {
  return TableView
}
