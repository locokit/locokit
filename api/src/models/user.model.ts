// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Application } from '@feathersjs/express'
import { Group } from './group.model'
import { Model, RelationMappings, JSONSchema, QueryBuilder, Modifiers } from 'objection'

export type UserProfile = 'USER' | 'ADMIN' | 'SUPERADMIN' | 'CREATOR'
export class User extends Model {
  id!: number
  createdAt!: string
  updatedAt!: string
  email!: string
  name!: string
  password!: string
  profile!: UserProfile
  blocked!: boolean
  isVerified!: boolean
  verifyToken?: string
  verifyShortToken?: string
  verifyExpires?: string
  verifyChanges?: Object
  resetToken?: string | null
  resetShortToken?: string | null
  resetExpires?: string

  static modelName: 'user'

  static get tableName (): string {
    return 'user'
  }

  static get jsonSchema (): JSONSchema {
    return {
      title: 'User',
      type: 'object',
      required: [
        'email',
        'password',
        'name',
      ],

      definitions: {
        userRequest: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            email: { type: ['string'] },
            name: { type: ['string'] },
          },
        },
      },

      properties: {

        email: { type: ['string'] },
        password: { type: 'string' },
        name: { type: 'string' },
        profile: {
          type: 'string',
          enum: [
            'USER',
            'CREATOR',
            'ADMIN',
            'SUPERADMIN',
          ],
          description: `
| Profile        | Permissions                                           |
| -------------- | ----------------------------------------------------- |
| \`USER\`       | can access to its group and all related resources     |
| \`CREATOR\`    | can create / manage workspace (it owns)               |
| \`ADMIN\`      | can create users and change profile until ADMIN grade |
|                | can see all workspaces                                |
|                | can create groups                                     |
|                | can affect users to groups                            |
| \`SUPERADMIN\` | manager the instance (config, theme, ...)             |
|                | update users' profile                                 |
`,
        },
        blocked: {
          type: 'boolean',
        },
        isVerified: {
          type: 'boolean',
        },
        // verifyToken: { type: ['string', 'null'] },
        // verifyShortToken: { type: ['string', 'null'] },
        // verifyExpires: { type: 'string', format: 'date-time' },
        // verifyChanges: { type: 'object' },
        // resetToken: { type: ['string', 'null'] },
        // resetShortToken: { type: ['string', 'null'] },
        // resetExpires: { type: 'string', format: 'date-time' },
        // groups: {
        //   type: 'array',
        //   readOnly: true,
        //   items: {
        //     $ref: '#/components/schemas/group',
        //   },
        //   description: "User's groups. Set if the `$eager=groups` is set.",
        // },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      groups: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: Group,
        join: {
          from: 'group.id',
          through: {
            from: 'user_has_group.user_id',
            to: 'user_has_group.group_id',
            extra: ['uhg_role'],
          },
          to: 'user.id',
        },
      },
      /**
       * This relation is used only for CASL abilities.
       * This could avoid conflicts with end users
       * joining with ORM-wrapper feathers-objection
       * and $joinRelation
       */
      groupsacl: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: Group,
        join: {
          from: 'group.id',
          through: {
            from: 'user_has_group.user_id',
            to: 'user_has_group.group_id',
            extra: ['uhg_role'],
          },
          to: 'user.id',
        },
      },
    }
  }

  static get modifiers (): Modifiers {
    return {
      serialize: async (builder: QueryBuilder<User>) => {
        return await builder.clearSelect()
          .select('user.id', 'user.createdAt', 'user.updatedAt', 'user.name')
      },
    }
  }

  $beforeInsert (): void {
    // eslint-disable-next-line no-multi-assign
    this.createdAt = this.updatedAt = new Date().toISOString()
    if (typeof (this.resetExpires) === 'number') {
      this.resetExpires = new Date(this.resetExpires).toISOString()
    }
    if (typeof (this.verifyExpires) === 'number') {
      this.verifyExpires = new Date(this.verifyExpires).toISOString()
    }
  }

  $beforeUpdate (): void {
    this.updatedAt = new Date().toISOString()
    if (typeof (this.resetExpires) === 'number') {
      this.resetExpires = new Date(this.resetExpires).toISOString()
    }
    if (typeof (this.verifyExpires) === 'number') {
      this.verifyExpires = new Date(this.verifyExpires).toISOString()
    }
  }
}

export default function (app: Application): typeof Model {
  return User
}
