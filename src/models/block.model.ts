/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection'
import { Application } from '../declarations'

export class block extends Model {
  createdAt!: string;
  updatedAt!: string;
  title?: string;
  container_id!: string;
  type!: string;
  position?: number;
  settings?: object;

  static get tableName () {
    return 'block'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['container_id'],

      properties: {
        title: { type: ['string', 'null'] },
        container_id: { type: 'string' },
        type: { enum: ['TableView', 'DetailView', 'Paragraph', 'Markdown', 'Heading', 'Media', 'KanbanView', 'GridView'] },
        position: { type: ['number', 'null'] },
        settings: { type: ['object', 'null'] }
      }
    }
  }

  $beforeInsert () {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }
}

export default function (app: Application) {
  return block
}
