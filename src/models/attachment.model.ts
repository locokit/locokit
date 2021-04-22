// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { JSONSchema } from 'objection'
import { Application } from '../declarations'
import { BaseModel } from './base.model'

export class LckAttachment extends BaseModel {
  filepath!: string
  filename!: string
  mime!: string
  ext!: string
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
        mime: { type: 'string' },
        ext: { type: 'string' },
        workspace_id: { type: 'string' },
      },
    }
  }
}

export default function (app: Application): typeof LckAttachment {
  return LckAttachment
}
