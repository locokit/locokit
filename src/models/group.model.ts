/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection'
import { Application } from '../declarations'
import { User } from './user.model'
import { workspace as LckWorkspace } from './workspace.model'
import { chapter as LckChapter } from './chapter.model'

export class group extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  workspace?: LckWorkspace;
  chapter?: LckChapter;
  chapter_id?: string;
  workspace_role?: string;
  name!: string;
  users?: User[];

  static get tableName () {
    return 'group'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: { type: 'string' },
        workspace_role: { type: 'string' }
      }
    }
  }

  $beforeInsert () {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }

  static get relationMappings () {
    return {
      workspace: {
        relation: Model.HasOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckWorkspace,
        join: {
          from: 'group.workspace_id',
          to: 'workspace.id'
        }
      },
      chapter: {
        relation: Model.HasOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckChapter,
        join: {
          from: 'group.chapter_id',
          to: 'chapter.id'
        }
      },
      users: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: User,
        join: {
          from: 'group.id',
          through: {
            from: 'user_has_group.group_id',
            to: 'user_has_group.user_id',
            extra: ['uhg_role']
          },
          to: 'user.id'
        }
      }
    }
  }
}

export default function (app: Application) {
  return group
}
