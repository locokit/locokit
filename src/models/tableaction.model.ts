// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import {
  JSONSchema,
  snakeCaseMappers
} from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

export class TableAction extends BaseModel {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  label!: string
  class_button!: string
  icon?: string|null
  action!: string
  page_detail_id?: string
  display_field_id?: string
  display_field_condition_query?: object|null

  table_id!: string
  process_id?: string

  static get tableName (): string {
    return 'table_action'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['table_row_id'],
      properties: {
        label: { type: 'string' },
        class_button: { type: 'string' },
        icon: { type: ['string', 'null'] },
        action: { type: 'string' },
        page_detail_id: { type: ['string', 'null'] },
        display_field_id: { type: ['string', 'null'] },
        display_field_condition_query: { type: ['object', 'null'] },
        table_row_id: { type: 'string' },
        process_id: { type: 'string' },
      },
    }
  }
}

export default function (app: Application): typeof TableAction {
  return TableAction
}
