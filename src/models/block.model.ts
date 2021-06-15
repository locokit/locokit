/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, snakeCaseMappers } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

export class block extends BaseModel {
  title?: string
  container_id!: string
  type!: string
  position?: number
  settings?: object
  elevation?: boolean
  conditional_display_table_view_id?: string
  conditional_display_field_id?: string
  conditional_display_field_value?: boolean

  static get tableName (): string {
    return 'block'
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static get columnNameMappers () {
    return snakeCaseMappers()
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['container_id'],
      properties: {
        title: { type: ['string', 'null'] },
        container_id: {
          type: 'string',
          format: 'uuid',
        },
        type: { enum: ['TableView', 'DetailView', 'Paragraph', 'Markdown', 'Heading', 'Media', 'KanbanView', 'GridView', 'MapView', 'Synthesis', 'MapDetailView', 'ActionButton', 'Default'] },
        position: { type: ['number', 'null'] },
        settings: { type: ['object', 'null'] },
        elevation: { type: 'boolean' },
        conditional_display_table_view_id: {
          type: 'string',
          format: 'uuid',
        },
        conditional_display_field_id: {
          type: 'string',
          format: 'uuid',
        },
        conditional_display_field_value: {
          type: 'boolean',
        },
      },
    }
  }
}

export default function (app: Application): typeof block {
  return block
}
