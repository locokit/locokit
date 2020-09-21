import * as Knex from "knex";

/**
 * Add a size for the table_column table
 * Useful for displaying columns in lck-front project
 * * for administration purpose
 * * or for the visualization part
 */

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('table_column', function(table) {
      table.integer('size').defaultTo(100);
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('table_column', function(table) {
      table.dropColumn('size')
    })
}
