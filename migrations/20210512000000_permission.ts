import * as Knex from 'knex'
import { formatAlterTableEnumSql } from '../utils/databaseConstraint'

export async function up (knex: Knex): Promise<any> {
  await knex.transaction(async trx => {
    await knex.raw(
      formatAlterTableEnumSql('user', 'profile', ['ADMIN', 'SUPERADMIN', 'CREATOR', 'USER'])
    )
    await knex.schema
      .createTable('acl_set', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.string('label', 255)
        table.uuid('workspace_id').unsigned().notNullable()
        table.foreign('workspace_id', 'FK_aclset_workspace_id').references('id').inTable('workspace')
        table.uuid('chapter_id').unsigned()
        table.foreign('chapter_id', 'FK_aclset_chapter_id').references('id').inTable('chapter')
        table.boolean('manager').defaultTo(false)
        table.timestamp('createdAt').defaultTo('now()')
        table.timestamp('updatedAt').defaultTo('now()')
      })
      .createTable('acl_database', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.uuid('aclset_id').unsigned().notNullable()
        table.foreign('aclset_id', 'FK_acldb_aclset_id').references('id').inTable('acl_set')
        table.uuid('database_id').unsigned().notNullable()
        table.foreign('database_id', 'FK_acldb_database_id').references('id').inTable('database')
        table.boolean('read').defaultTo(false)
        table.boolean('write').defaultTo(false)
        table.boolean('table_create').defaultTo(false)
        table.timestamp('createdAt').defaultTo('now()')
        table.timestamp('updatedAt').defaultTo('now()')
      })
      .createTable('acl_table', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.uuid('aclset_id').unsigned().notNullable()
        table.foreign('aclset_id', 'FK_acltb_aclset_id').references('id').inTable('acl_set')
        table.uuid('table_id').unsigned().notNullable()
        table.foreign('table_id', 'FK_acltb_table_id').references('id').inTable('table')
        table.boolean('create_rows').defaultTo(false)
        table.boolean('read_rows').defaultTo(false)
        table.boolean('update_rows').defaultTo(false)
        table.boolean('delete_rows').defaultTo(false)
        table.boolean('create_columns').defaultTo(false)
        table.boolean('read_columns').defaultTo(false)
        table.boolean('update_columns').defaultTo(false)
        table.boolean('delete_columns').defaultTo(false)
        table.boolean('create_views').defaultTo(false)
        table.boolean('read_views').defaultTo(false)
        table.boolean('update_views').defaultTo(false)
        table.boolean('delete_views').defaultTo(false)
        table.timestamp('createdAt').defaultTo('now()')
        table.timestamp('updatedAt').defaultTo('now()')
      })
      .createTable('acl_column', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.uuid('aclset_id').unsigned().notNullable()
        table.foreign('aclset_id', 'FK_gac_aclset_id').references('id').inTable('acl_set')
        table.uuid('column_id').unsigned().notNullable()
        table.foreign('column_id', 'FK_gav_column_id').references('id').inTable('table_column')
        table.boolean('read').defaultTo(false)
        table.boolean('write').defaultTo(false)
        table.jsonb('filter')
        table.timestamp('createdAt').defaultTo('now()')
        table.timestamp('updatedAt').defaultTo('now()')
      })
      .createTable('acl_view', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.uuid('aclset_id').unsigned().notNullable()
        table.foreign('aclset_id', 'FK_gav_aclset_id').references('id').inTable('acl_set')
        table.uuid('view_id').unsigned().notNullable()
        table.foreign('view_id', 'FK_gav_view_id').references('id').inTable('table_view')
        table.boolean('read').defaultTo(false)
        table.boolean('write').defaultTo(false)
        table.timestamp('createdAt').defaultTo('now()')
        table.timestamp('updatedAt').defaultTo('now()')
      })
      .alterTable('group', table => {
        table.uuid('aclset_id').unsigned()
        table.foreign('aclset_id', 'FK_group_aclset_id').references('id').inTable('acl_set')
        table.dropColumn('permission')
      })

    /**
     * Fill initially acl_set with group's data
     */
    await knex.raw(`
    INSERT INTO acl_set (label, workspace_id, chapter_id, manager)
    SELECT name, workspace_id, chapter_id, CASE WHEN workspace_role = 'ADMIN' THEN true WHEN workspace_role = 'OWNER' THEN true ELSE false END
    from "group";
    `)
    /**
     * Update groups with new acl_set
     */
    await knex.raw(`
      UPDATE "group" g
      SET aclset_id = (SELECT id FROM acl_set "as" WHERE g.workspace_id = "as".workspace_id AND g.chapter_id = "as".chapter_id );
    `)

    /**
     * Remove old columns
     */
    await knex.schema.alterTable('group', table => {
      table.dropColumn('workspace_role')
      table.dropColumn('workspace_id')
      table.dropColumn('chapter_id')
    })
    await trx.commit()

  })
}

export async function down (knex: Knex): Promise<any> {
  await knex.transaction(async trx => {
    await knex.schema
      .dropTableIfExists('acl_view')
      .dropTableIfExists('acl_column')
      .dropTableIfExists('acl_table')
      .dropTableIfExists('acl_database')
      .alterTable('group', table => {
        table.enum('workspace_role', ['OWNER', 'ADMIN', 'MEMBER']).notNullable().defaultTo('MEMBER')
        table.jsonb('permission').defaultTo([])
        table.uuid('workspace_id').unsigned()
        table.foreign('workspace_id', 'FK_workspace_id').references('id').inTable('workspace')
        table.uuid('chapter_id').unsigned()
        table.foreign('chapter_id', 'FK_chapter_id').references('id').inTable('chapter')
      })

    await knex.raw(`
      UPDATE "group" g
      SET workspace_id = (SELECT workspace_id FROM acl_set "as" WHERE g.aclset_id = "as".id),
      chapter_id = (SELECT chapter_id FROM acl_set "as" WHERE g.aclset_id = "as".id),
      workspace_role = (SELECT CASE WHEN "as".manager = true THEN 'OWNER' ELSE 'MEMBER' END FROM acl_set "as" WHERE g.aclset_id = "as".id)
    `)
    await knex.raw(
      formatAlterTableEnumSql('user', 'profile', ['ADMIN', 'SUPERADMIN', 'USER'])
    )

    await knex.schema
    .alterTable('group', table => {
      table.dropColumn('aclset_id')
    })
    .dropTableIfExists('acl_set')

    await trx.commit()
  })
}
