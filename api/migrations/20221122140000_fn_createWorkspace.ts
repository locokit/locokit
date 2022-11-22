import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').raw(`

  CREATE OR REPLACE FUNCTION core.createWorkspaceSchema (IN "workspace_id" uuid)
  RETURNS void
  LANGUAGE 'plpgsql'
  VOLATILE
  PARALLEL UNSAFE
  COST 100

AS $BODY$
DECLARE
v_workspace core.workspace%ROWTYPE;
v_schema varchar;
v_role_readonly varchar;
v_role_readwrite varchar;
BEGIN

RAISE NOTICE 'Calling createWorkspaceSchema(''%'')', $1;

SET search_path = core;

-- SELECT the workspace
EXECUTE 'SELECT *
FROM workspace
WHERE id = ''' || $1 || ''''
INTO v_workspace
USING workspace_id;

RAISE NOTICE 'Workspace found : slug = %, name = %', v_workspace.slug, v_workspace.name;

v_schema := 'lck_' || v_workspace.slug;
v_role_readonly := v_schema || '_ro';
v_role_readwrite := v_schema || '_rw';

-- CREATE workspace schema
EXECUTE format('CREATE SCHEMA %I', v_schema);

-- CREATE roles
EXECUTE format('CREATE ROLE %I', v_role_readonly);
EXECUTE format('CREATE ROLE %I', v_role_readwrite);

-- GRANT access to readonly (user with access to the workspace)
EXECUTE format('
GRANT SELECT
ON ALL TABLES IN SCHEMA %I
TO %I'
, v_schema, v_role_readonly);

-- GRANT access to readwrite (manager of the workspace)
EXECUTE format('
GRANT SELECT, INSERT, UPDATE, DELETE
  ON ALL TABLES IN SCHEMA %I
  TO %I'
, v_schema, v_role_readwrite);

-- CREATE the tables of the workspace schema
EXECUTE format('SET search_path = %s', v_schema);

-- CREATE TABLE workspace () INHERITS ("core"."workspace");
EXECUTE format('CREATE TABLE "group" (
workspaceId uuid DEFAULT ''%s''
) INHERITS ("core"."group")', $1);
CREATE TABLE "user" () INHERITS ("core"."user");
CREATE TABLE "userGroup" () INHERITS ("core"."userGroup");
EXECUTE format('CREATE TABLE "datasource" (
"workspaceId" uuid NOT NULL DEFAULT ''%s'',
CONSTRAINT datasource_pkey PRIMARY KEY (id),
CONSTRAINT "IDX_UNQ_ds_slug" UNIQUE (slug, "workspaceId"),
CONSTRAINT datasource_client_check CHECK (client = ANY (ARRAY[''sqlite3''::text, ''pg''::text, ''legacy''::text]))
) INHERITS ("core"."datasource")', $1);

-- CREATE all tables for metamodel

CREATE TABLE "table" (
id uuid NOT NULL DEFAULT gen_random_uuid(),
name character varying(255) COLLATE pg_catalog."default" NOT NULL,
slug character varying(255) COLLATE pg_catalog."default",
documentation text COLLATE pg_catalog."default",
settings jsonb DEFAULT '{}'::jsonb,
"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
"datasourceId" uuid NOT NULL,
CONSTRAINT table_pkey PRIMARY KEY (id),
CONSTRAINT table_slug_unique UNIQUE (slug),
CONSTRAINT "FK_table_datasource" FOREIGN KEY ("datasourceId")
    REFERENCES "datasource" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE INDEX IF NOT EXISTS "IDX_table_slug"
ON "table" USING btree
(slug COLLATE pg_catalog."default" ASC NULLS LAST)
TABLESPACE pg_default;


CREATE TABLE "tableRelation" (
"fromId" uuid NOT NULL,
"toId" uuid NOT NULL,
"throughId" uuid,
type character varying(3),

settings jsonb DEFAULT '{}'::jsonb,
"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT "FK_tableRelation_from" FOREIGN KEY ("fromId")
    REFERENCES "table" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
CONSTRAINT "FK_tableRelation_to" FOREIGN KEY ("toId")
    REFERENCES "table" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
CONSTRAINT "FK_tableRelation_through" FOREIGN KEY ("throughId")
    REFERENCES "table" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
CONSTRAINT "tableRelation_pkey" PRIMARY KEY ("fromId", "toId", "throughId"),
CONSTRAINT "tableRelation_type_check" CHECK (type = ANY (ARRAY['1-n'::text, 'n-1'::text, 'n-n'::text, '1-1'::text]))

);

END
$BODY$;
    `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').raw(`
  DROP FUNCTION core."createWorkspaceSchema";
  `)
}

//   .createTable('fieldType', (table) => {
//     table.increments('id').primary()
//     table.string('type')
//     table.timestamp('createdAt').defaultTo('now()')
//     table.timestamp('updatedAt').defaultTo('now()')
//   })
//   .createTable('tableField', (table) => {
//     table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
//     table.string('name')
//     table.text('documentation')
//     table.timestamp('createdAt').defaultTo('now()')
//     table.timestamp('updatedAt').defaultTo('now()')
//     table.jsonb('settings')
//     table.integer('position')
//     table.boolean('reference').defaultTo(false)
//     table.integer('reference_position')
//     table.uuid('tableId').unsigned()
//     table
//       .foreign('tableId', 'FK_tf_tableId')
//       .references('id')
//       .inTable('table')
//     table.integer('fieldTypeId').unsigned()
//     table
//       .foreign('fieldTypeId', 'FK_tf_fieldTypeId')
//       .references('id')
//       .inTable('fieldType')
//   })
//   .createTable('tableFieldRelation', (table) => {
//     table.timestamp('createdAt').defaultTo('now()')
//     table.timestamp('updatedAt').defaultTo('now()')
//     table.jsonb('settings')
//     table.uuid('fromId').unsigned()
//     table
//       .foreign('fromId', 'FK_tfr_fromId')
//       .references('id')
//       .inTable('tableField')
//     table.uuid('toId').unsigned()
//     table
//       .foreign('toId', 'FK_tfr_toId')
//       .references('id')
//       .inTable('tableField')
//     table.primary(['fromId', 'toId'])
//   })
//   .createTable('dataset', (table) => {
//     table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
//     table.string('name')
//     table.text('documentation')
//     table.timestamp('createdAt').defaultTo('now()')
//     table.timestamp('updatedAt').defaultTo('now()')
//     table.uuid('tableId').unsigned()
//     table
//       .foreign('tableId', 'FK_ds_tableId')
//       .references('id')
//       .inTable('table')
//   })
//   .createTable('datasetField', (table) => {
//     table.uuid('datasetId')
//     table.uuid('tableFieldId')
//     table.primary(['datasetId', 'tableFieldId'])
//     table
//       .foreign('tableFieldId', 'FK_dsf_tableFieldId')
//       .references('id')
//       .inTable('tableField')
//     table
//       .foreign('datasetId', 'FK_dsf_datasetId')
//       .references('id')
//       .inTable('dataset')
//     table.integer('position')
//     table.enum('sortOrder', ['ASC', 'DESC'])
//     table.jsonb('filter')
//     table.boolean('visible')
//     table.timestamp('createdAt').defaultTo('now()')
//     table.timestamp('updatedAt').defaultTo('now()')
//   })
// await knex('fieldType').insert([
//   /**
//    * Primitives
//    */
//   {
//     id: FIELD_TYPE.BOOLEAN,
//     type: 'Boolean',
//   },
//   {
//     id: FIELD_TYPE.STRING,
//     type: 'String',
//   },
//   {
//     id: FIELD_TYPE.NUMBER,
//     type: 'Number',
//   },
//   {
//     id: FIELD_TYPE.FLOAT,
//     type: 'Float',
//   },
//   {
//     id: FIELD_TYPE.DATE,
//     type: 'Date (only)',
//   },
//   {
//     id: FIELD_TYPE.TEXT,
//     type: 'Text',
//   },
//   {
//     id: FIELD_TYPE.DATETIME,
//     type: 'Date time',
//   },
//   /**
//    * Users / groups
//    */
//   {
//     id: FIELD_TYPE.USER,
//     type: 'User',
//   },
//   {
//     id: FIELD_TYPE.GROUP,
//     type: 'Group',
//   },
//   {
//     id: FIELD_TYPE.MULTI_USER,
//     type: 'Multi user',
//   },
//   {
//     id: FIELD_TYPE.MULTI_GROUP,
//     type: 'Multi group',
//   },
//   /**
//    * Schema
//    */
//   {
//     id: FIELD_TYPE.RELATION,
//     type: 'Link / relation between tables',
//   },
//   {
//     id: FIELD_TYPE.LOOKUP,
//     type: 'Look up column',
//   },
//   {
//     id: FIELD_TYPE.VIRTUAL_LOOKUP,
//     type: 'Virtual Look up column (content is not replicated)',
//   },
//   {
//     id: FIELD_TYPE.ROLLUP,
//     type: 'Rollup column',
//   },
//   /**
//    * Complex
//    */
//   {
//     id: FIELD_TYPE.SINGLE_SELECT,
//     type: 'Single select',
//   },
//   {
//     id: FIELD_TYPE.MULTI_SELECT,
//     type: 'Multi select',
//   },
//   {
//     id: FIELD_TYPE.FORMULA,
//     type: 'Formula',
//   },
//   /**
//    * Media
//    */
//   {
//     id: FIELD_TYPE.MEDIA,
//     type: 'File',
//   },
//   {
//     id: FIELD_TYPE.URL,
//     type: 'URL',
//   },
//   /**
//    * Geometry
//    */
//   {
//     id: FIELD_TYPE.GEOMETRY_POINT,
//     type: 'Geometry Point',
//   },
//   {
//     id: FIELD_TYPE.GEOMETRY_POLYGON,
//     type: 'Geometry Polygon',
//   },
//   {
//     id: FIELD_TYPE.GEOMETRY_LINESTRING,
//     type: 'Geometry Linestring',
//   },
//   {
//     id: FIELD_TYPE.GEOMETRY_MULTIPOINT,
//     type: 'Geometry Multipoint',
//   },
//   {
//     id: FIELD_TYPE.GEOMETRY_MULTIPOLYGON,
//     type: 'Geometry Multipolygon',
//   },
//   {
//     id: FIELD_TYPE.GEOMETRY_MULTILINESTRING,
//     type: 'Geometry Multilinestring',
//   },
// ])
