// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '@feathersjs/express';
import { group as LckGroup} from './group.model'

export class user extends Model {
  createdAt!: string;
  updatedAt!: string;
  email!: string;
  name: string = '';
  password!: string;
  profile: string = 'USER';
  blocked!: boolean;
  // auth0Id: string = '';

  static get tableName() {
    return 'user';
  }

  static get jsonSchema() {
    return {
      title: 'User',
      type: 'object',
      required: [
        'email',
        'password'
      ],

      properties: {

        email: { type: ['string', 'null'] },
        password: { type: 'string' },
        name: { type: 'string' },
        profile: { type: 'string' },
        blocked: { type: 'boolean' },

        // auth0Id: { type: 'string' },

      }
    };
  }

  static get relationMappings() {
    return {
      groups: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckGroup,
        join: {
          from: 'group.id',
          through: {
            from: 'user_has_group.user_id',
            to: 'user_has_group.group_id',
            extra: ['role']
          },
          to: 'user.id',
        }
      },
    }
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default function (app: Application) {
  return user;
}
