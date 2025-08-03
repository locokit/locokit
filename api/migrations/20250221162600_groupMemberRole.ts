import type { Knex } from 'knex'
import { GROUP_ROLE } from '@locokit/shared'

export async function up(knex: Knex): Promise<void> {
  const doesColumnExist = await knex.schema.withSchema('core').hasColumn('lck_userGroup', 'role')
  if (!doesColumnExist) {
    await knex.schema.withSchema('core').alterTable('lck_userGroup', (table) => {
      table
        .enum('role', [GROUP_ROLE.MEMBER, GROUP_ROLE.OWNER, GROUP_ROLE.ADMIN])
        .notNullable()
        .defaultTo(GROUP_ROLE.MEMBER)
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
