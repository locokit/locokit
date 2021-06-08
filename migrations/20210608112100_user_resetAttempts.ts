import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('user', table => {
      table.integer('resetAttempts')
    })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('user', table => {
      table.dropColumn('resetAttempts')
    })
}

