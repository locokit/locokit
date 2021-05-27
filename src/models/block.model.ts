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

  static get tableName (): string {
    return 'block'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['container_id'],
      properties: {
        title: { type: ['string', 'null'] },
        container_id: { type: 'string' },
        type: { enum: ['TableView', 'DetailView', 'Paragraph', 'Markdown', 'Heading', 'Media', 'KanbanView', 'GridView', 'MapView', 'Synthesis', 'MapDetailView', 'ActionButton', 'Default'] },
        position: { type: ['number', 'null'] },
        settings: { type: ['object', 'null'] },
      },
    }
  }
}

export default function (app: Application): typeof block {
  return block
}
