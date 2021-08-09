/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, RelationMappings, JSONSchema } from 'objection'
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { Table as LckTable } from './table.model'
import { ColumnType } from './columnType.model'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { TableView } from './tableview.model'

export interface SelectValue {
  label: string
  color: string
  backgroundColor: string
  position: number
}

export class TableColumn extends BaseModel {
  text!: string
  reference!: boolean
  reference_position!: number
  locked!: boolean
  documentation?: string
  settings!: {
    formula?: string
    formula_type_id?: number
    query?: {
      select: string[]
      where: Object
      sort: Array<{ field: string, order: string}>
      limit: number
      skip: number
      aggregate: string // count, avg, sum, min, max, count distinct
    }
    table_to_id?: string
    column_to_id?: string
    column_from_id?: string
    tableId?: string
    localField?: string
    foreignField?: string
    values?: Record<string, SelectValue>
    width?: number
    required?: boolean
    default?: string | boolean
  }

  validation?: object

  position!: number
  table_id!: string
  table?: LckTable
  column_type_id!: number
  column_type?: ColumnType
  originalColumn?: TableColumn
  parents?: TableColumn[]
  children?: TableColumn[]

  static modelName = 'column'

  static get tableName (): string {
    return 'table_column'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
        reference: { type: 'boolean' },
        reference_position: { type: 'number' },
        locked: { type: 'boolean' },
        settings: { type: 'object' },
        table_id: { type: 'string' },
        column_type_id: { type: 'number' },
        position: { type: 'number' },
        validation: { type: 'number' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      table: {
        relation: Model.BelongsToOneRelation,
        modelClass: LckTable,
        join: {
          from: 'table_column.table_id',
          to: 'table.id',
        },
      },
      views: {
        relation: Model.ManyToManyRelation,
        modelClass: TableView,
        join: {
          from: 'table_column.id',
          through: {
            from: 'table_view_has_table_column.table_column_id',
            to: 'table_view_has_table_column.table_view_id',
          },
          to: 'table_view.id',
        },
      },
      column_type: {
        relation: Model.BelongsToOneRelation,
        modelClass: ColumnType,
        join: {
          from: 'table_column.column_type_id',
          to: 'column_type.id',
        },
      },
      parents: {
        relation: Model.ManyToManyRelation,
        modelClass: TableColumn,
        join: {
          from: 'table_column.id',
          through: {
            // table_column_relation is the join table.
            from: 'table_column_relation.table_column_to_id',
            to: 'table_column_relation.table_column_from_id',
          },
          to: 'table_column.id',
        },
      },
      children: {
        relation: Model.ManyToManyRelation,
        modelClass: TableColumn,
        join: {
          from: 'table_column.id',
          through: {
            // table_column_relation is the join table.
            from: 'table_column_relation.table_column_from_id',
            to: 'table_column_relation.table_column_to_id',
          },
          to: 'table_column.id',
        },
      },
    }
  }

  /**
   * Returns the original type id of the column. Note that for a LOOKED_UP_COLUMN, the returned type
   * is the LOOKED_UP_COLUMN type if the parents are not computed.
   * @returns The original type id of the column.
   */
  originalTypeId (): COLUMN_TYPE {
    if (this.column_type_id === COLUMN_TYPE.FORMULA) return this.settings.formula_type_id as COLUMN_TYPE
    if (this.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN || (Array.isArray(this.parents) && this.parents.length === 0) || !this.parents) {
      return this.column_type_id
    }
    return this.parents[0].originalTypeId()
  }

  /**
   * Returns the original column of the current one. Note that for a LOOKED_UP_COLUMN, the returned column
   * is the current one if the parents are not computed.
   * @returns The original column related to the current one.
   */
  getOriginalColumn (): TableColumn {
    if (this.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN || (Array.isArray(this.parents) && this.parents.length === 0) || !this.parents) {
      return this
    }
    return this.parents[0].getOriginalColumn()
  }
}

export type LckColumnFilter = Record<string, string | Array<string | number> | Object>

export class TableColumnDTO extends TableColumn {
  filter?: LckColumnFilter
  sort?: Object
}

export default function (app: Application): typeof TableColumn {
  return TableColumn
}
