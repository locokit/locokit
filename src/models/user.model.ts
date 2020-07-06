// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '@feathersjs/express';
// import Knex from 'knex';
// import { Application } from '../declarations';

export class user extends Model {
  createdAt!: string;
  updatedAt!: string;
  email!: string;
  first_name: string = '';
  last_name: string = '';
  password!: string;
  profile: string = 'USER';
  // auth0Id: string = '';

  static get tableName() {
    return 'user';
  }

  static get jsonSchema() {
    return {
      title: 'User',
      type: 'object',
      required: ['email', 'password'],

      properties: {

        email: { type: ['string', 'null'] },
        password: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        profile: { type: 'string' },

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

// export default user

export default function (app: Application) {
  // const db: Knex = app.get('knex');

  // db.schema.hasTable('user').then(exists => {
  //   if (!exists) {
  //     db.schema.createTable('user', table => {
  //       table.increments('id');

  //       table.string('email').unique();
  //       table.string('password');


  //       table.string('auth0Id');

  //       table.timestamp('createdAt');
  //       table.timestamp('updatedAt');
  //     })
  //       .then(() => console.log('Created user table')) // eslint-disable-line no-console
  //       .catch(e => console.error('Error creating user table', e)); // eslint-disable-line no-console
  //   }
  // })
  //   .catch(e => console.error('Error creating user table', e)); // eslint-disable-line no-console

  return user;
}
