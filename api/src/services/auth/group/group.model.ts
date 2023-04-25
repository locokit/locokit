import { JSONSchema, Model, RelationMappings } from 'objection'
import { WorkspaceModel } from '../../workspace/workspace.model'
import { UserGroupModel } from '../user-group/user-group.model'
import { UserModel } from '../user/user.model'
import { RoleModel } from '../role/role.model'
import { groupSchema } from './group.schema'

/**
 * Group objection Model
 */
export class GroupModel extends Model {
  static readonly model = 'group'

  static readonly tableName = 'lck_group'

  // static get jsonSchema(): JSONSchema {
  //   return groupSchema
  // }

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
      policy: {
        relation: Model.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: 'lck_group.roleId',
          to: 'lck_role.id',
        },
      },
      userGroups: {
        relation: Model.HasManyRelation,
        modelClass: UserGroupModel,
        join: {
          from: 'lck_group.id',
          to: 'lck_userGroup.group_id',
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
