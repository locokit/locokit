import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('w', (table) => {
    table.increments('id')
    table.primary(['id'])
    table.string('name').notNullable()
    table.string('slug')
    table.index('slug', 'IDX_w_slug')
    table.boolean('legacy').defaultTo(false)
    table.boolean('public').defaultTo(false)
    table.string('documentation')
    table.jsonb('settings').defaultTo({
      color: null,
      backgroundColor: null,
      icon: null,
    })
    table.datetime('createdAt').defaultTo('now()')
    table.datetime('updatedAt').defaultTo('now()')
    table.integer('createdBy').notNullable()
    table.foreign('createdBy', 'FK_w_user').references('id').inTable('user')
    table.index('createdBy', 'IDX_w_createdBy')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('w')
}
