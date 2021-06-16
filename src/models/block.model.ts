/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema, snakeCaseMappers } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

// TableSet: Table (header + content) of a set of record
// DataRecord: Detail of each data (label + input/text) of a record
// Paragraph: Any text
// Markdown: Any text with markdown style
// Media: Image Collection which can be in shape of Gallery, Carousel and Image or a Video in a player
// KanbanSet: Method Kanban on a set of record
// MapSet: Map with one or many set of record and one or many geographical data
// MapField: Map with one record and one geographical data
// HighlightField: Highlighting a field in a record
// ActionButton: Button which can be related on a field in a record
// CardSet: Collection of card from a set of record
// MarkdownField: Text related on a field in a record with markdown style
// FormRecord: Same as DataRecord with at least submission button
// Default: Safe-keeper (migration backwards compatibility)

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
        type: {
          enum: [
            'TableSet',
            'DataRecord',
            'Paragraph',
            'Markdown',
            'Media',
            'KanbanSet',
            'HighlightField',
            'MapSet',
            'MapField',
            'ActionButton',
            'CardSet',
            'MarkdownField',
            'FormRecord',
            'Default',
          ],
        },
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
