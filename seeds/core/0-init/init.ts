import * as Knex from 'knex'

export async function seed (knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  /**
   * Process part
   */
  await knex('process_run').del()
  await knex('process').del()
  /**
   * Storage
   */
  await knex('table_view_has_table_column').del()
  await knex('table_view').del()
  await knex('table_row_relation').del()
  await knex('table_row').del()
  await knex('table_column_relation').del()
  await knex('table_column').del()
  await knex('table_relation').del()
  await knex('table').del()
  await knex('database').del()
  await knex('block').del()
  await knex('container').del()
  await knex('page').del()
  await knex('user_has_group').del()
  await knex('group').del()
  await knex('acl_set').del()
  await knex('chapter').del()
  await knex('attachment').del()
  await knex('workspace').del()
  await knex('user').del()
};
