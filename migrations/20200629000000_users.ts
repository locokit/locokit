import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('user', function (table) {
      table.increments('id').primary();
      table.string('first_name', 255);
      table.string('last_name', 255);
      table.string('password', 255).notNullable();
      table.string('email', 255).unique().notNullable();
      table.timestamp('createdAt').defaultTo('now()');
      table.timestamp('updatedAt').defaultTo('now()');
      table.boolean('blocked').defaultTo(false);
      table.enum('profile', ['ADMIN', 'SUPERADMIN', 'USER']).defaultTo('USER').notNullable();
    })

    .createTable('group', function (table) {
      // table.increments('id').primary();
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name', 255).notNullable();
      table.timestamp('createdAt').defaultTo('now()');
      table.timestamp('updatedAt').defaultTo('now()');
    })

    .createTable('user_has_group', function (table) {
      table.integer('user_id').unsigned()
      table.uuid('group_id').unsigned()
      table.primary(['user_id', 'group_id'])
      table.foreign('user_id', 'FK_user_id').references('id').inTable('user')
      table.foreign('group_id', 'FK_group_id').references('id').inTable('group')
      table.enum('role', ['OWNER', 'ADMIN', 'MEMBER']).notNullable().defaultTo('MEMBER');
      table.timestamp('createdAt').defaultTo('now()');
      table.timestamp('updatedAt').defaultTo('now()');
    });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
      .dropTableIfExists("user_has_group")
      .dropTableIfExists("group")
      .dropTableIfExists("user");
}
