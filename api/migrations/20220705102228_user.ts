import { PROFILE } from '@locokit/definitions'
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').createTable('user', (table) => {
    table.increments('id')
    table.string('name', 255)
    table.string('email', 255).unique().notNullable()
    table.string('password')
    table.string('auth0Id')
    table.string('github').unique()
    table
      .enum('profile', [PROFILE.MEMBER, PROFILE.CREATOR, PROFILE.ADMIN])
      .defaultTo(PROFILE.CREATOR)
    table.boolean('isVerified').defaultTo(false)
    table.string('verifyToken')
    table.string('verifyShortToken')
    table.dateTime('verifyExpires')
    table.jsonb('verifyChanges')
    table.string('resetToken')
    table.string('resetShortToken')
    table.dateTime('resetExpires')
    table.integer('resetAttempts')

    table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.datetime('lastConnection')
    table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').dropTable('user')
}
