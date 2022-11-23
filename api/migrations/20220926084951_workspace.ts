import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('core')

    .createTable('workspace', (table) => {
      table
        .uuid('id', { primaryKey: true })
        .defaultTo(knex.raw('gen_random_uuid()'))
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
        .inTable('core.user')
      table.index('createdBy', 'IDX_workspace_createdBy')
    })

    /**
     * Role / Permission table
     */
    .createTable('role', (table) => {
      table
        .uuid('id', { primaryKey: true })
        .defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name', 255)
      table.text('documentation')
      table.uuid('workspaceId').notNullable()
      table
        .foreign('workspaceId', 'FK_role_workspace')
        .references('id')
        .inTable('core.workspace')
      table.index('workspaceId', 'IDX_role_workspaceId')
      table.boolean('manager').notNullable().defaultTo(false)
    })

    /**
     * User / group tables
     */
    .createTable('group', (table) => {
      table
        .uuid('id', { primaryKey: true })
        .defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name', 255)
      table.text('documentation')
      table.uuid('workspaceId').notNullable()
      table
        .foreign('workspaceId', 'FK_group_workspace')
        .references('id')
        .inTable('core.workspace')
      table.index('workspaceId', 'IDX_group_workspaceId')
      table.uuid('roleId').notNullable()
      table
        .foreign('roleId', 'FK_group_role')
        .references('id')
        .inTable('core.role')
      table.index('roleId', 'IDX_group_roleId')
    })
    .createTable('userGroup', (table) => {
      table.uuid('groupId').notNullable()
      table
        .foreign('groupId', 'FK_userGroup_group')
        .references('id')
        .inTable('core.group')
      table.index('groupId', 'IDX_userGroup_groupId')
      table.integer('userId').notNullable()
      table
        .foreign('userId', 'FK_userGroup_user')
        .references('id')
        .inTable('core.user')
      table.index('userId', 'IDX_userGroup_userId')

      table.primary(['userId', 'groupId'])
    })

    /**
     * Datasource table
     */
    .createTable('datasource', (table) => {
      table
        .uuid('id', { primaryKey: true })
        .defaultTo(knex.raw('gen_random_uuid()'))
      table.primary(['id'])
      table.string('name').notNullable()
      table.string('slug')
      table.index('slug', 'IDX_datasource_slug')
      table.unique(['slug', 'workspaceId'], { indexName: 'IDX_UNQ_ds_slug' })
      table.text('documentation')
      table.enum('client', ['sqlite3', 'pg', 'legacy']).notNullable()
      table.string('connection').notNullable()
      table.jsonb('credentialsRead').defaultTo({
        username: null,
        password: null,
      })
      table.jsonb('credentialsReadWrite').defaultTo({
        username: null,
        password: null,
      })
      table.jsonb('credentialsAlter').defaultTo({
        username: null,
        password: null,
      })
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())

      table.uuid('workspaceId').notNullable()
      table
        .foreign('workspaceId', 'FK_datasource_workspace')
        .references('id')
        .inTable('core.workspace')
      table.index('workspaceId', 'IDX_datasource_workspaceId')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('core')
    .dropTable('datasource')
    .dropTable('userGroup')
    .dropTable('group')
    .dropTable('role')
    .dropTable('workspace')
}
