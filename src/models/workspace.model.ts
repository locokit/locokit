// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import Knex from 'knex';
import { Application } from '../declarations';

class WorkspacePermission {
  accessDatabase: boolean = false;
}

const defaultWorkspacePermission: WorkspacePermission = {
  accessDatabase: false
}

export class workspace extends Model {
  createdAt!: string;
  updatedAt!: string;
  permissions: WorkspacePermission = { ...defaultWorkspacePermission };

  static get tableName() {
    return 'workspace';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' }
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

  // db.schema.hasTable('workspace').then(exists => {
  //   if (!exists) {
  //     db.schema.createTable('workspace', table => {
  //       table.increments('id');
  //       table.string('text');
  //       table.timestamp('createdAt');
  //       table.timestamp('updatedAt');
  //     })
  //       .then(() => console.log('Created workspace table')) // eslint-disable-line no-console
  //       .catch(e => console.error('Error creating workspace table', e)); // eslint-disable-line no-console
  //   }
  // })
  //   .catch(e => console.error('Error creating workspace table', e)); // eslint-disable-line no-console

  return workspace;
}
