import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('user_has_group', function (table) {
      table.renameColumn('role', 'uhg_role')
    })
    .alterTable('group', function (table) {
      table.renameColumn('role', 'workspace_role')
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('user_has_group', function (table) {
      table.renameColumn('uhg_role', 'role')
    })
    .alterTable('group', function (table) {
      table.renameColumn('workspace_role', 'role')
    })
}
