// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

class Attachment extends BaseModel {
  filepath!: string
  filename!: string
  createdAt!: string
  updatedAt!: string

  workspace_id!: string

  static get tableName (): string {
    return 'attachment'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['filepath', 'workspace_id'],

      properties: {
        filepath: { type: 'string' },
        filename: { type: 'string' },
        workspace_id: { type: 'string' },
      },
    }
  }
}

export default function (app: Application): typeof Attachment {
  return Attachment
}
