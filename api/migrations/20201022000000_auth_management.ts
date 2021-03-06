import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('user', function (table) {
      table.boolean('isVerified').defaultTo(false)
      table.string('verifyToken')
      table.string('verifyShortToken')
      table.dateTime('verifyExpires')
      table.jsonb('verifyChanges')
      table.string('resetToken')
      table.string('resetShortToken')
      table.dateTime('resetExpires')
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('user', function (table) {
      table.dropColumn('isVerified')
      table.dropColumn('verifyToken')
      table.dropColumn('verifyShortToken')
      table.dropColumn('verifyExpires')
      table.dropColumn('verifyChanges')
      table.dropColumn('resetToken')
      table.dropColumn('resetShortToken')
      table.dropColumn('resetExpires')
    })
}
