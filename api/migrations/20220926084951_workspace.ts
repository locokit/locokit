import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('core')

    .createTable('lck_workspace', (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name', 50).notNullable()
      table.string('slug', 60).unique()
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
      table.uuid('createdBy').notNullable()
      table.foreign('createdBy', 'FK_workspace_user').references('id').inTable('core.lck_user')
      table.index('createdBy', 'IDX_workspace_createdBy')
      table.datetime('softDeletedAt')
    })

    /**
     * Role / Permission table
     */
    .createTable('lck_policy', (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name', 255).notNullable()
      table.text('documentation')
      table.uuid('workspaceId').notNullable()
      table
        .foreign('workspaceId', 'FK_policy_workspace')
        .references('id')
        .inTable('core.lck_workspace')
      table.index('workspaceId', 'IDX_policy_workspaceId')
      table.boolean('manager').notNullable().defaultTo(false)
      table.boolean('public').notNullable().defaultTo(false)
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())
    })

    /**
     * User / group tables
     */
    .createTable('lck_group', (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name', 255).notNullable()
      table.text('documentation')
      table.uuid('workspaceId').notNullable()
      table
        .foreign('workspaceId', 'FK_group_workspace')
        .references('id')
        .inTable('core.lck_workspace')
      table.index('workspaceId', 'IDX_group_workspaceId')
      table.uuid('policyId').notNullable()
      table.foreign('policyId', 'FK_group_policy').references('id').inTable('core.lck_policy')
      table.index('policyId', 'IDX_group_policyId')
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())
    })
    .createTable('lck_userGroup', (table) => {
      table.uuid('groupId').notNullable()
      table.foreign('groupId', 'FK_userGroup_group').references('id').inTable('core.lck_group')
      table.index('groupId', 'IDX_userGroup_groupId')
      table.uuid('userId').notNullable()
      table.foreign('userId', 'FK_userGroup_user').references('id').inTable('core.lck_user')
      table.index('userId', 'IDX_userGroup_userId')
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())

      table.primary(['userId', 'groupId'])
    })

    /**
     * Datasource table
     */
    .createTable('lck_datasource', (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name', 255).notNullable()
      table.string('slug')
      table.index('slug', 'IDX_datasource_slug')
      table.unique(['slug', 'workspaceId'], { indexName: 'IDX_UNQ_datasource_slug' })
      table.text('documentation')
      table.enum('client', ['sqlite3', 'pg']).notNullable()
      table.enum('type', ['remote', 'local']).notNullable()
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
        .inTable('core.lck_workspace')
      table.index('workspaceId', 'IDX_datasource_workspaceId')
    })

    /**
     * Table table
     */
    .createTable('lck_table', (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name', 255).notNullable()
      table.string('slug')
      table.index('slug', 'IDX_table_slug')
      table.string('schema')
      table.unique(['schema', 'slug', 'datasourceId'], { indexName: 'IDX_UNQ_table_schema_slug' })
      table.text('documentation')
      table.jsonb('settings').defaultTo({})
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())

      table.uuid('datasourceId').notNullable()
      table
        .foreign('datasourceId', 'FK_table_datasource')
        .references('id')
        .inTable('core.lck_datasource')
      table.index('datasourceId', 'IDX_table_datasourceId')
    })

    /**
     * Table dataset
     */
    .createTable('lck_dataset', (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name').notNullable()
      table.string('slug')
      table.index('slug', 'IDX_dataset_slug')
      table.unique(['slug', 'tableId'], { indexName: 'IDX_UNQ_dataset_slug' })
      table.text('documentation')
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())

      table.uuid('tableId').notNullable()
      table.foreign('tableId', 'FK_dataset_table').references('id').inTable('core.lck_table')
      table.index('tableId', 'IDX_dataset_tableId')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('core')
    .dropTable('lck_dataset')
    .dropTable('lck_table')
    .dropTable('lck_datasource')
    .dropTable('lck_userGroup')
    .dropTable('lck_group')
    .dropTable('lck_policy')
    .dropTable('lck_workspace')
}
