import { Application } from './declarations'
import { Model } from 'objection'

export default function (app: Application): void {
  const { client, connection } = app.get('postgres')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const knex = require('knex')({
    client,
    connection,
    useNullAsDefault: false,
    debug: process.env.OBJECTION_DEBUG === 'true' || false,
    pool: { min: 0, max: 20 },
  })

  Model.knex(knex)

  app.set('knex', knex)
}
