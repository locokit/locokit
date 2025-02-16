import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').alterTable('lck_userGroup', (table) => {
    table
      .dropForeign('groupId', 'FK_userGroup_group')
      .foreign('groupId', 'FK_userGroup_group')
      .references('id')
      .inTable('core.lck_group')
      .onDelete('CASCADE')
    table
      .dropForeign('userId', 'FK_userGroup_user')
      .foreign('userId', 'FK_userGroup_user')
      .references('id')
      .inTable('core.lck_user')
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').alterTable('lck_userGroup', (table) => {
    table
      .dropForeign('groupId', 'FK_userGroup_group')
      .foreign('groupId', 'FK_userGroup_group')
      .references('id')
      .inTable('core.lck_group')
    table
      .dropForeign('userId', 'FK_userGroup_user')
      .foreign('userId', 'FK_userGroup_user')
      .references('id')
      .inTable('core.lck_user')
  })
}
