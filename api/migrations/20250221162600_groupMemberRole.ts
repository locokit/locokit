import type { Knex } from 'knex'
import { USER_PROFILE } from '@locokit/definitions'

export async function up(knex: Knex): Promise<void> {
  const doesColumnExist = await knex.schema.withSchema('core').hasColumn('lck_userGroup', 'role')
  if (!doesColumnExist) {
    await knex.schema.withSchema('core').alterTable('lck_userGroup', (table) => {
      table
        .enum('role', [USER_PROFILE.MEMBER, USER_PROFILE.CREATOR, USER_PROFILE.ADMIN])
        .notNullable()
        .defaultTo(USER_PROFILE.MEMBER)
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  const doesColumnExist = await knex.schema.withSchema('core').hasColumn('lck_userGroup', 'role')
  if (doesColumnExist) {
    await knex.schema.withSchema('core').alterTable('lck_userGroup', (table) => {
      table.dropColumn('role')
    })
  }
}
