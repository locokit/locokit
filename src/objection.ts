import { Application } from './declarations'
const { Model } = require('objection')

export default function (app: Application) {
  const { client, connection } = app.get('postgres')
  const knex = require('knex')({
    client,
    connection,
    useNullAsDefault: false,
    debug: process.env.OBJECTION_DEBUG === 'true' || false
  })

  Model.knex(knex)

  app.set('knex', knex)
}
