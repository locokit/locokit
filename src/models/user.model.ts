// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection'
import { Application } from '@feathersjs/express'
import { group as LckGroup } from './group.model'

export class User extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  email!: string;
  name: string = '';
  password!: string;
  profile: string = 'USER';
  blocked!: boolean;
  isVerified!: boolean;
  verifyToken!: string;
  verifyShortToken!: string;
  verifyExpires!: string;
  verifyChanges!: Object;
  resetToken!: string;
  resetExpires!: string;

  static get tableName () {
    return 'user'
  }

  static get jsonSchema () {
    return {
      title: 'User',
      type: 'object',
      required: [
        'email',
        'password',
        'name'
      ],

      properties: {

        email: { type: ['string', 'null'] },
        password: { type: 'string' },
        name: { type: 'string' },
        profile: { type: 'string' },
        blocked: { type: 'boolean' },
        isVerified: { type: 'boolean' },
        verifyToken: { type: 'string' },
        verifyShortToken: { type: 'string' },
        verifyExpires: { type: 'date' },
        verifyChanges: { type: 'object' },
        resetToken: { type: 'string' },
        resetExpires: { type: 'date' }

      }
    }
  }

  static get relationMappings () {
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
            extra: ['uhg_role']
          },
          to: 'user.id'
        }
      }
    }
  }

  $beforeInsert () {
    // eslint-disable-next-line no-multi-assign
    this.createdAt = this.updatedAt = new Date().toISOString()
    if (typeof (this.resetExpires) === 'number') {
      this.resetExpires = new Date(this.resetExpires).toISOString()
    }
    if (typeof (this.verifyExpires) === 'number') {
      this.verifyExpires = new Date(this.verifyExpires).toISOString()
    }
  }

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
    if (typeof (this.resetExpires) === 'number') {
      this.resetExpires = new Date(this.resetExpires).toISOString()
    }
    if (typeof (this.verifyExpires) === 'number') {
      this.verifyExpires = new Date(this.verifyExpires).toISOString()
    }
  }
}

export default function (app: Application) {
  return User
}
