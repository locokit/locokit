// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { row as LckRow } from './row.model'
import { column as LckColumn } from './column.model'


export class table extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get tableName() {
    return 'table';
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
      columns: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckColumn,
        join: {
          from: 'table.id',
          to: 'table_column.table_id'
        }
      },
      rows: {
        relation: Model.HasManyRelation,
        modelClass: LckRow,
        join: {
          from: 'table.id',
          to: 'table_row.table_id'
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

  // db.schema.hasTable('table').then(exists => {
  //   if (!exists) {
  //     db.schema.createTable('table', table => {
  //       table.increments('id');
  //       table.string('text');
  //       table.timestamp('createdAt');
  //       table.timestamp('updatedAt');
  //     })
  //       .then(() => console.log('Created table table')) // eslint-disable-line no-console
  //       .catch(e => console.error('Error creating table table', e)); // eslint-disable-line no-console
  //   }
  // })
  //   .catch(e => console.error('Error creating table table', e)); // eslint-disable-line no-console

  return table;
}
