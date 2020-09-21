// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '@feathersjs/express';

export class user extends Model {
  createdAt!: string;
  updatedAt!: string;
  email!: string;
  first_name: string = '';
  last_name: string = '';
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
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        profile: { type: 'string' },
        blocked: { type: 'boolean' },

        // auth0Id: { type: 'string' },

      }
    };
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
