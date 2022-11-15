import { PROFILE } from '@locokit/definitions'
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', function (table) {
    table.string('github').unique()
    table
      .enum('profile', [PROFILE.MEMBER, PROFILE.CREATOR, PROFILE.ADMIN])
      .defaultTo(PROFILE.CREATOR)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', function (table) {
    table.dropColumn('github')
    table.dropColumn('profile')
  })
}
