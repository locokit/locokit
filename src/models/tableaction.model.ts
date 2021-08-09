// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import {
  JSONSchema,
  snakeCaseMappers,
} from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

// In the case of table action, an action is limited to the related table_view. So we don't need to add an attribute `view_id`.

export class TableAction extends BaseModel {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static get columnNameMappers () {
    return snakeCaseMappers()
  }

  label!: string
  class_button!: string
  icon?: string|null
  action!: string
  page_detail_id?: string|null
  page_redirect_id?: string|null
  page_query_field_id?: string|null
  display_field_id?: string|null
  display_field_condition_query?: object|null
  table_id!: string
  process_id?: string|null
  type_page_to?: string|null
  notification_success_title?: string|null
  notification_success_description?: string|null
  notification_error_title?: string|null
  notification_error_description?: string|null

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
        page_redirect_id: { type: ['string', 'null'] },
        page_query_field_id: { type: ['string', 'null'] },
        display_field_id: { type: ['string', 'null'] },
        display_field_condition_query: { type: ['object', 'null'] },
        table_row_id: { type: 'string' },
        process_id: { type: ['object', 'null'] },
        type_page_to: { type: ['string', 'null'] },
        notification_success_title: { type: ['string', 'null'] },
        notification_success_description: { type: ['string', 'null'] },
        notification_error_title: { type: ['string', 'null'] },
        notification_error_description: { type: ['string', 'null'] },

      },
    }
  }
}

export default function (app: Application): typeof TableAction {
  return TableAction
}
