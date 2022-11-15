import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  console.log(knex.client.config.client)
  await knex.schema.createTable('workspace', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable()
    table.string('slug').unique()
    table.index('slug', 'IDX_workspace_slug')
    table.boolean('legacy').defaultTo(false)
    table.boolean('public').defaultTo(false)
    table.text('documentation')
    table.jsonb('settings').defaultTo({
      color: null,
      backgroundColor: null,
      icon: null,
    })
    table.datetime('createdAt').defaultTo(knex.fn.now())
    table.datetime('updatedAt').defaultTo(knex.fn.now())
    table.integer('createdBy').notNullable()
    table
      .foreign('createdBy', 'FK_workspace_user')
      .references('id')
      .inTable('user')
    table.index('createdBy', 'IDX_workspace_createdBy')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('workspace')
}
