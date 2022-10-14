import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    db: Knex
  }
}

export function db(app: Application): void {
  const config = app.get('settings').db
  const db = knex(config)

  app.set('db', db)
}
