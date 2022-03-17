import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .raw(`CREATE DOMAIN lck_snake_case AS TEXT
      CHECK(
         VALUE ~ '^[a-z_]$'
      );
    `)
    .alterTable('workspace', table => {
      table.boolean('generate_sql').defaultTo(false)
      table.specificType('slug', 'lck_snake_case')
      table.unique(['slug'])
    })
    .raw('ALTER TABLE workspace ADD CONSTRAINT workspace_slug_notnull_if_generatesqltrue CHECK ( NOT ( generate_sql = True AND slug IS NULL ) );')
    .alterTable('database', table => {
      table.specificType('slug', 'lck_snake_case')
      table.unique(['slug', 'workspace_id'])
    })
    .alterTable('table', table => {
      table.specificType('slug', 'lck_snake_case')
      table.unique(['slug', 'database_id'])
    })
    .alterTable('table_column', table => {
      table.specificType('slug', 'lck_snake_case')
      table.unique(['slug', 'table_id'])
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema
    .alterTable('workspace', table => {
      table.dropColumn('generate_sql')
      table.dropColumn('slug')
    })
    .alterTable('database', table => {
      table.dropColumn('slug')
    })
    .alterTable('table', table => {
      table.dropColumn('slug')
    })
    .alterTable('table_column', table => {
      table.dropColumn('slug')
    })
    .raw('DROP DOMAIN lck_snake_case;')
}
