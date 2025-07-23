import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const doesColumnExist = await knex.schema.withSchema('core').hasColumn('lck_userGroup', 'id')
  if (!doesColumnExist) {
    await knex.schema.withSchema('core').alterTable('lck_userGroup', (table) => {
      table.dropPrimary()
      table.uuid('id', { primaryKey: true }).notNullable().defaultTo(knex.raw('gen_random_uuid()'))
      table.primary(['id'])
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  const doesColumnExist = await knex.schema.withSchema('core').hasColumn('lck_userGroup', 'role')
  if (doesColumnExist) {
    await knex.schema.withSchema('core').alterTable('lck_userGroup', (table) => {
      table.dropColumn('id')
      table.primary(['userId', 'groupId'])
    })
  }
}
