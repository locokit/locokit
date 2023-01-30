import { JSONSchema, Model, RelationMappings } from 'objection'
import { WorkspaceModel } from '../../workspace/workspace.model'
import { UserModel } from '../user/user.model'
import { groupSchema } from './group.schema'

/**
 * Group objection Model
 */
export class GroupModel extends Model {
  static readonly model = 'group'

  static readonly tableName = 'lck_group'

  static get jsonSchema(): JSONSchema {
    return groupSchema
  }

  static get relationMappings(): RelationMappings {
    return {
      workspace: {
        relation: Model.BelongsToOneRelation,
        modelClass: WorkspaceModel,
        join: {
          from: 'lck_group.workspaceId',
          to: 'lck_workspace.id',
        },
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: 'lck_group.id',
          through: {
            from: 'lck_userGroup.groupId',
            to: 'lck_userGroup.userId',
            // extra: ['userGroupRole'],
          },
          to: 'lck_user.id',
        },
      },
    }
  }
}
