import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createSchema('core')
    .raw('CREATE EXTENSION unaccent;')
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropSchema('core')
}
