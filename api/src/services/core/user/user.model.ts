import { AnyQueryBuilder, Model, Modifiers, RelationMappings, raw } from 'objection'
import BaseModel from '@/commons/BaseModel'
import { WorkspaceModel } from '@/services/core/workspace/workspace.model'
import { UserGroupModel } from '@/services/core/user-group/user-group.model'

export class UserModel extends BaseModel {
  static readonly model = 'user'

  static readonly tableName = 'lck_user'

  static modifiers: Modifiers<AnyQueryBuilder> = {
    notInGroup(query, groupId) {
      query
        .leftJoin('lck_userGroup as nig_group', function () {
          this.on('lck_user.id', '=', 'nig_group.userId').andOn(
            'nig_group.groupId',
            '=',
            // @ts-expect-error bad typing between objection and knex
            raw('?', [groupId]),
          )
        })
        .whereNull('nig_group.groupId')
    },
  }

  static get relationMappings(): RelationMappings {
    return {
      memberships: {
        relation: Model.HasManyRelation,
        modelClass: UserGroupModel,
        join: {
          from: 'lck_user.id',
          to: 'lck_userGroup.userId',
        },
      },
      workspaces: {
        relation: Model.HasManyRelation,
        modelClass: WorkspaceModel,
        join: {
          from: 'lck_user.id',
          to: 'lck_workspace.createdBy',
        },
      },
    }
  }
}
