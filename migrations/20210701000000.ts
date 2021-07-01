import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  await knex.transaction(async trx => {
    await knex.schema
      .alterTable('acl_table', table => {
        table.jsonb('read_filter')
      })
      .alterTable('table_view', table => {
        table.jsonb('filter')
      })
    await trx.commit()
  })
}

export async function down (knex: Knex): Promise<any> {
  await knex.transaction(async trx => {
    await knex.schema
    .alterTable('table_view', table => {
      table.dropColumn('filter')
    })
    .alterTable('acl_table', table => {
      table.dropColumn('read_filter')
    })
    await trx.commit()
  })
}
