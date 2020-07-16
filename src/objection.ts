const { Model } = require('objection');
import { Application } from './declarations';

export default function (app: Application) {
  const { client, connection } = app.get('postgres');
  const knex = require('knex')({
    client,
    connection,
    useNullAsDefault: false,
    // debug: true
  });

  Model.knex(knex);

  app.set('knex', knex);
}
