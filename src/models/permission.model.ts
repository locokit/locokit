// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import Knex from 'knex';
import { Application } from '../declarations';

class PermissionSettings {
  actions: string[] = []
  entity: string[] = []
}

const GRANTS_ROLE = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  USER: 'USER'
}


class permission extends Model {
  public createdAt!: string;
  public updatedAt!: string;
  public settings: PermissionSettings = {
    actions: [],
    entity: []
  }
  public role!: string;

  static get tableName() {
    return 'permission';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
        role: { type: 'string' },
        settings: {
          type: 'object',
          properties: {
            actions: { type: 'array' },
            entity: { type: 'array'}
          }
        }
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
  // const db: Knex = app.get('knex');

  // db.schema.hasTable('permission').then(exists => {
  //   if (!exists) {
  //     db.schema.createTable('permission', table => {
  //       table.increments('id');
  //       table.string('text');
  //       table.timestamp('createdAt');
  //       table.timestamp('updatedAt');
  //     })
  //       .then(() => console.log('Created permission table')) // eslint-disable-line no-console
  //       .catch(e => console.error('Error creating permission table', e)); // eslint-disable-line no-console
  //   }
  // })
  //   .catch(e => console.error('Error creating permission table', e)); // eslint-disable-line no-console

  return permission;
}
