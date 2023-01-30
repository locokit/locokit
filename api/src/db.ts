import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'
import { Model } from 'objection'

declare module './declarations' {
  interface Configuration {
    db: Knex
  }
}

export async function db(app: Application): Promise<void> {
  const config = app.get('settings').db

  const db = knex({
    client: config.client,
    useNullAsDefault: false,
    debug: true,
    connection: {
      connectionString: config.connection,
      application_name: 'LocoKit',
    },
    migrations: {
      schemaName: 'public',
    },
    // debug: process.env.OBJECTION_DEBUG === 'true' || false,
    // pool: { min: 0, max: 20 },
  })

  Model.knex(db)

  app.set('db', db)
}
