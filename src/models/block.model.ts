/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

export class block extends BaseModel {
  title?: string
  container_id!: string
  type!: string
  position?: number
  settings?: object
  elevation?: boolean
  conditionalDisplayTableViewId?: string
  conditionalDisplayFieldId?: string
  conditionalDisplayFieldValue?: boolean

  static get tableName (): string {
    return 'block'
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
        conditionalDisplayTableViewId: {
          type: 'string',
          format: 'uuid',
        },
        conditionalDisplayFieldId: {
          type: 'string',
          format: 'uuid',
        },
        conditionalDisplayFieldValue: {
          type: 'boolean',
        },
      },
    }
  }
}

export default function (app: Application): typeof block {
  return block
}
