import type { Knex } from 'knex'

/**
 * These fields are added according to feathers authentication management package
 *
 * https://feathers-a-m.netlify.app/configuration.html#user-model-fields
 */

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', function (table) {
    table.string('name')
    table.boolean('isVerified').defaultTo(false)
    table.string('verifyToken')
    table.string('verifyShortToken')
    table.dateTime('verifyExpires')
    table.jsonb('verifyChanges')
    table.string('resetToken')
    table.string('resetShortToken')
    table.dateTime('resetExpires')
    table.integer('resetAttempts')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', function (table) {
    table.dropColumn('name')
    table.dropColumn('isVerified')
    table.dropColumn('verifyToken')
    table.dropColumn('verifyShortToken')
    table.dropColumn('verifyExpires')
    table.dropColumn('verifyChanges')
    table.dropColumn('resetToken')
    table.dropColumn('resetShortToken')
    table.dropColumn('resetExpires')
    table.dropColumn('resetAttempts')
  })
}
