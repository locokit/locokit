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
          description: `
- __TableSet__: Table (header + content) of a set of record
- __DataRecord__: Detail of each data (label + input/text) of a record
- __Paragraph__: Any text
- __Markdown__: Any text with markdown style
- __Media__: Image Collection which can be in shape of Gallery, Carousel and Image or a Video in a player
- __KanbanSet__: Method Kanban on a set of record
- __MapSet__: Map with one or many set of record and one or many geographical data
- __MapField__: Map with one record and one geographical data
- __HighlightField__: Highlighting a field in a record
- __ActionButton__: Button which can be related on a field in a record
- __CardSet__: Collection of card from a set of record
- __MarkdownField__: Text related on a field in a record with markdown style
- __FormRecord__: Same as DataRecord with at least submission button
- __Default__: Safe-keeper (migration backwards compatibility)
          `,
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
