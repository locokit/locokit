import { USER_PROFILE } from '@locokit/definitions'
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').createTable('lck_user', (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name', 255)
    table.string('username', 255).unique().notNullable()
    table.string('avatarURL')
    table.string('email', 255).unique().notNullable()
    table.string('password')
    table
      .enum('profile', [USER_PROFILE.MEMBER, USER_PROFILE.CREATOR, USER_PROFILE.ADMIN])
      .defaultTo(USER_PROFILE.CREATOR)
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
  await knex.schema.withSchema('core').dropTable('lck_user')
}
