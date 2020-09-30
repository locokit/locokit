// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { user as LckUser } from './user.model';
import { workspace as LckWorkspace } from './workspace.model';

class LckWorkspaceExtended extends LckWorkspace {
  role!: string;
  chapter_id?: string;
}

export class group extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  workspaces?: LckWorkspaceExtended[];
  name!: string;
  users?: LckUser[];

  static get tableName() {
    return 'group';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: { type: 'string' }
      }
    };
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get relationMappings() {
    return {
      workspaces: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckWorkspace,
        join: {
          from: 'group.id',
          through: {
            from: 'group_has_workspace.group_id',
            to: 'group_has_workspace.workspace_id',
            extra: ['role', 'chapter_id']
          },
          to: 'workspace.id',
        }
      },
      users: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckUser,
        join: {
          from: 'group.id',
          through: {
            from: 'user_has_group.group_id',
            to: 'user_has_group.user_id',
            extra: ['role']
          },
          to: 'user.id',
        }
      },
    }
  }
}

export default function (app: Application) {
  return group;
}
