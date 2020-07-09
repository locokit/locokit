// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { table as LckTable } from './table.model'
import { columnType as LckColumnType } from './columnType.model'

export class column extends Model {
  createdAt!: string;
  updatedAt!: string;
  text: string = 'unknown text';
  data: Object = {};

  static get tableName() {
    return 'table_column';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
        data: { type: 'object'}
      }
    };
  }

  static get relationMappings() {
    return {
      table: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckTable,
        join: {
          from: 'table_column.tableid',
          to: 'table.id'
        }
      },
      type: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckColumnType,
        join: {
          from: 'table_column.column_type_id',
          to: 'column_type.id'
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
  // const db: Knex = app.get('knex');

  // db.schema.hasTable('row').then(exists => {
  //   if (!exists) {
  //     db.schema.createTable('row', table => {
  //       table.increments('id');
  //       table.string('text');
  //       table.timestamp('createdAt').defaultTo('now()');
  //       table.timestamp('updatedAt').defaultTo('now()');
  //       table.jsonb('data')
  //     })
  //       .then(() => console.log('Created row table')) // eslint-disable-line no-console
  //       .catch(e => console.error('Error creating row table', e)); // eslint-disable-line no-console
  //   }
  // })
  //   .catch(e => console.error('Error creating row table', e)); // eslint-disable-line no-console

  return column;
}
