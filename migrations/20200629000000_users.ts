import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .createTable('user', function (table) {
      table.increments('id').primary()
      table.string('name', 255)
      table.string('password', 255).notNullable()
      table.string('email', 255).unique().notNullable()
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.boolean('blocked').defaultTo(false)
      table.enum('profile', ['ADMIN', 'SUPERADMIN', 'USER']).defaultTo('USER').notNullable()
    })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('user')
}
