import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  await knex("table_column_relation").del()
  await knex("table_view_has_table_column").del()
  await knex("table_view").del()
  await knex("table_row").del()
  await knex("table_column").del()
  await knex("column_type").del()
  await knex("table").del()
  await knex("database").del()
  await knex("group_has_workspace").del()
  await knex("block").del()
  await knex("container").del()
  await knex("page").del()
  await knex("chapter").del()
  await knex("workspace").del()
  await knex("user_has_group").del()
  await knex("group").del()
  await knex("user").del()
};
