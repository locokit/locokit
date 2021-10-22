import * as Knex from 'knex'

// Remove 'acl_table', 'acl_database', 'acl_column' and 'acl_view' records linked to the deleted aclset (CASCADE)

export async function up (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('acl_database', table => {
      table.dropForeign(['aclset_id'], 'FK_acldb_aclset_id')
      table
        .foreign('aclset_id', 'FK_acldb_aclset_id')
        .references('id')
        .inTable('acl_set')
        .onDelete('CASCADE')
    })

    .alterTable('acl_table', table => {
      table.dropForeign(['aclset_id'], 'FK_acltb_aclset_id')
      table
        .foreign('aclset_id', 'FK_acltb_aclset_id')
        .references('id')
        .inTable('acl_set')
        .onDelete('CASCADE')
    })

    .alterTable('acl_column', table => {
      table.dropForeign(['aclset_id'], 'FK_gac_aclset_id')
      table
        .foreign('aclset_id', 'FK_gac_aclset_id')
        .references('id')
        .inTable('acl_set')
        .onDelete('CASCADE')
    })

    .alterTable('acl_view', table => {
      table.dropForeign(['aclset_id'], 'FK_gav_aclset_id')
      table
        .foreign('aclset_id', 'FK_gav_aclset_id')
        .references('id')
        .inTable('acl_set')
        .onDelete('CASCADE')
    })

}

export async function down (knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('acl_database', table => {
      table.dropForeign(['aclset_id'], 'FK_acldb_aclset_id')
      table
        .foreign('aclset_id', 'FK_acldb_aclset_id')
        .references('id')
        .inTable('acl_set')
    })

    .alterTable('acl_table', table => {
      table.dropForeign(['aclset_id'], 'FK_acltb_aclset_id')
      table
        .foreign('aclset_id', 'FK_acltb_aclset_id')
        .references('id')
        .inTable('acl_set')
    })

    .alterTable('acl_column', table => {
      table.dropForeign(['aclset_id'], 'FK_gac_aclset_id')
      table
        .foreign('aclset_id', 'FK_gac_aclset_id')
        .references('id')
        .inTable('acl_set')
    })

    .alterTable('acl_view', table => {
      table.dropForeign(['aclset_id'], 'FK_gav_aclset_id')
      table
        .foreign('aclset_id', 'FK_gav_aclset_id')
        .references('id')
        .inTable('acl_set')
    })
}
