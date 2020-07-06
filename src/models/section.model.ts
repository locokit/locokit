// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import Knex from 'knex';
import { Application } from '../declarations';
import { workspace as LckWorkspace } from './workspace.model'
import { page as LckPage } from './page.model'

class section extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get tableName() {
    return 'section';
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
      workspace: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckWorkspace,
        join: {
          from: 'section.workspaceId',
          to: 'workspace.id'
        }
      },
      pages: {
        relation: Model.HasManyRelation,
        modelClass: LckPage,
        join: {
          from: 'section.id',
          to: 'page.section_id'
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

  // db.schema.hasTable('section').then(exists => {
  //   if (!exists) {
  //     db.schema.createTable('section', table => {
  //       table.increments('id');
  //       table.string('text');
  //       table.timestamp('createdAt');
  //       table.timestamp('updatedAt');
  //     })
  //       .then(() => console.log('Created section table')) // eslint-disable-line no-console
  //       .catch(e => console.error('Error creating section table', e)); // eslint-disable-line no-console
  //   }
  // })
  //   .catch(e => console.error('Error creating section table', e)); // eslint-disable-line no-console

  return section;
}
