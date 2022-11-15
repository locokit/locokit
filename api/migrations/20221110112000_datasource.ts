import type { Knex } from 'knex'
import { FIELD_TYPE } from '@locokit/definitions'

export async function up(knex: Knex): Promise<void> {
  await knex.schema

    .createTable('datasource', (table) => {
      table.uuid('id').defaultTo(knex.raw('gen_random_uuid()'))
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
        .inTable('workspace')
      table.index('workspaceId', 'IDX_datasource_workspaceId')
    })

    .createTable('table', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name').notNullable()
      table.string('slug')
      table.index('slug', 'IDX_table_slug')
      table.text('documentation')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.uuid('datasourceId').unsigned()
      table
        .foreign('datasourceId', 'FK_table_datasourceId')
        .references('id')
        .inTable('datasource')
      table.unique(['slug', 'datasourceId'], {
        indexName: 'IDX_UNQ_table_slug',
      })
    })

    .createTable('tableRelation', (table) => {
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.jsonb('settings')
      table.enum('type', ['1-n', 'n-1', 'n-n', '1-1'])
      table.uuid('fromId').unsigned().notNullable()
      table.foreign('fromId', 'FK_tr_fromId').references('id').inTable('table')
      table.uuid('toId').unsigned().notNullable()
      table.foreign('toId', 'FK_tr_toId').references('id').inTable('table')
      table.uuid('troughId').unsigned().nullable()
      table
        .foreign('troughId', 'FK_tr_troughId')
        .references('id')
        .inTable('table')
      table.primary(['fromId', 'toId', 'troughId'])
    })

    .createTable('fieldType', (table) => {
      table.increments('id').primary()
      table.string('type')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
    })

    .createTable('tableField', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name')
      table.text('documentation')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.jsonb('settings')
      table.integer('position')
      table.boolean('reference').defaultTo(false)
      table.integer('reference_position')
      table.uuid('tableId').unsigned()
      table
        .foreign('tableId', 'FK_tf_tableId')
        .references('id')
        .inTable('table')
      table.integer('fieldTypeId').unsigned()
      table
        .foreign('fieldTypeId', 'FK_tf_fieldTypeId')
        .references('id')
        .inTable('fieldType')
    })

    .createTable('tableFieldRelation', (table) => {
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.jsonb('settings')
      table.uuid('fromId').unsigned()
      table
        .foreign('fromId', 'FK_tfr_fromId')
        .references('id')
        .inTable('tableField')
      table.uuid('toId').unsigned()
      table
        .foreign('toId', 'FK_tfr_toId')
        .references('id')
        .inTable('tableField')
      table.primary(['fromId', 'toId'])
    })

    .createTable('dataset', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('name')
      table.text('documentation')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
      table.uuid('tableId').unsigned()
      table
        .foreign('tableId', 'FK_ds_tableId')
        .references('id')
        .inTable('table')
    })

    .createTable('datasetField', (table) => {
      table.uuid('datasetId')
      table.uuid('tableFieldId')
      table.primary(['datasetId', 'tableFieldId'])
      table
        .foreign('tableFieldId', 'FK_dsf_tableFieldId')
        .references('id')
        .inTable('tableField')
      table
        .foreign('datasetId', 'FK_dsf_datasetId')
        .references('id')
        .inTable('dataset')
      table.integer('position')
      table.enum('sortOrder', ['ASC', 'DESC'])
      table.jsonb('filter')
      table.boolean('visible')
      table.timestamp('createdAt').defaultTo('now()')
      table.timestamp('updatedAt').defaultTo('now()')
    })

  await knex('fieldType').insert([
    /**
     * Primitives
     */
    {
      id: FIELD_TYPE.BOOLEAN,
      type: 'Boolean',
    },
    {
      id: FIELD_TYPE.STRING,
      type: 'String',
    },
    {
      id: FIELD_TYPE.NUMBER,
      type: 'Number',
    },
    {
      id: FIELD_TYPE.FLOAT,
      type: 'Float',
    },
    {
      id: FIELD_TYPE.DATE,
      type: 'Date (only)',
    },
    {
      id: FIELD_TYPE.TEXT,
      type: 'Text',
    },
    {
      id: FIELD_TYPE.DATETIME,
      type: 'Date time',
    },

    /**
     * Users / groups
     */
    {
      id: FIELD_TYPE.USER,
      type: 'User',
    },
    {
      id: FIELD_TYPE.GROUP,
      type: 'Group',
    },
    {
      id: FIELD_TYPE.MULTI_USER,
      type: 'Multi user',
    },
    {
      id: FIELD_TYPE.MULTI_GROUP,
      type: 'Multi group',
    },

    /**
     * Schema
     */

    {
      id: FIELD_TYPE.RELATION,
      type: 'Link / relation between tables',
    },
    {
      id: FIELD_TYPE.LOOKUP,
      type: 'Look up column',
    },
    {
      id: FIELD_TYPE.VIRTUAL_LOOKUP,
      type: 'Virtual Look up column (content is not replicated)',
    },
    {
      id: FIELD_TYPE.ROLLUP,
      type: 'Rollup column',
    },

    /**
     * Complex
     */
    {
      id: FIELD_TYPE.SINGLE_SELECT,
      type: 'Single select',
    },
    {
      id: FIELD_TYPE.MULTI_SELECT,
      type: 'Multi select',
    },
    {
      id: FIELD_TYPE.FORMULA,
      type: 'Formula',
    },

    /**
     * Media
     */
    {
      id: FIELD_TYPE.MEDIA,
      type: 'File',
    },
    {
      id: FIELD_TYPE.URL,
      type: 'URL',
    },

    /**
     * Geometry
     */
    {
      id: FIELD_TYPE.GEOMETRY_POINT,
      type: 'Geometry Point',
    },
    {
      id: FIELD_TYPE.GEOMETRY_POLYGON,
      type: 'Geometry Polygon',
    },
    {
      id: FIELD_TYPE.GEOMETRY_LINESTRING,
      type: 'Geometry Linestring',
    },
    {
      id: FIELD_TYPE.GEOMETRY_MULTIPOINT,
      type: 'Geometry Multipoint',
    },
    {
      id: FIELD_TYPE.GEOMETRY_MULTIPOLYGON,
      type: 'Geometry Multipolygon',
    },
    {
      id: FIELD_TYPE.GEOMETRY_MULTILINESTRING,
      type: 'Geometry Multilinestring',
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('datasetField')
    .dropTableIfExists('dataset')
    .dropTableIfExists('tableFieldRelation')
    .dropTableIfExists('tableField')
    .dropTableIfExists('fieldType')
    .dropTableIfExists('tableRelation')
    .dropTableIfExists('table')
    .dropTableIfExists('datasource')
}
