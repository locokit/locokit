// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { table as LckTable } from './table.model'

export class database extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get tableName() {
    return 'database';
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

  static get relationMappings() {
    return {
      tables: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckTable,
        join: {
          from: 'database.id',
          to: 'table.database_id'
        }
      }
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
  // const db: Knex = app.get('knex');

  // db.schema.hasTable('database').then(exists => {
  //   if (!exists) {
  //     db.schema.createTable('database', table => {
  //       table.increments('id');
  //       table.string('text');
  //       table.timestamp('createdAt');
  //       table.timestamp('updatedAt');
  //     })
  //       .then(() => console.log('Created database table')) // eslint-disable-line no-console
  //       .catch(e => console.error('Error creating database table', e)); // eslint-disable-line no-console
  //   }
  // })
  //   .catch(e => console.error('Error creating database table', e)); // eslint-disable-line no-console

  return database;
}
