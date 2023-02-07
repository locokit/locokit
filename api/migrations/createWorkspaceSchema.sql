--
-- Function to create a dedicated schema in LocoKit database
-- for a specific workspace
--
CREATE OR REPLACE FUNCTION "core"."createWorkspaceSchema" (IN "workspace_id" uuid)
  RETURNS void
  LANGUAGE 'plpgsql'
  VOLATILE
  PARALLEL UNSAFE
  COST 100

AS $BODY$

DECLARE
  v_workspace core.lck_workspace%ROWTYPE;
  v_schema varchar;
  v_role_readonly varchar;
  v_role_readwrite varchar;

BEGIN

  RAISE NOTICE 'Calling createWorkspaceSchema(''%'')', $1;

  SET search_path = core;

  -- SELECT the workspace
  EXECUTE 'SELECT *
  FROM lck_workspace
  WHERE id = ''' || $1 || ''''
  INTO v_workspace
  USING workspace_id;

  RAISE NOTICE 'Workspace found : slug = %, name = %', v_workspace.slug, v_workspace.name;

  v_schema := 'w_' || v_workspace.slug;
  v_role_readonly := v_schema || '_ro';
  v_role_readwrite := v_schema || '_rw';

  -- CREATE workspace schema
  EXECUTE format('CREATE SCHEMA %I', v_schema);

  RAISE NOTICE 'Schema ''%'' created.', v_schema;

  -- CREATE roles
  EXECUTE format('CREATE ROLE %I', v_role_readonly);

  RAISE NOTICE 'Role ''%'' created.', v_role_readonly;

  EXECUTE format('CREATE ROLE %I', v_role_readwrite);

  RAISE NOTICE 'Role ''%'' created.', v_role_readwrite;

  -- GRANT access to readonly (user with access to the workspace)
  EXECUTE format('
    GRANT SELECT
    ON ALL TABLES IN SCHEMA %I
    TO %I'
  , v_schema, v_role_readonly);

  -- GRANT access to core.lck_user
  EXECUTE format('GRANT USAGE ON SCHEMA core TO %I', v_role_readonly);
  EXECUTE format('GRANT SELECT (id, name, profile) ON core.lck_user TO %I', v_role_readonly);

  -- GRANT access to readwrite (manager of the workspace)
  EXECUTE format('GRANT %I TO %I', v_role_readonly, v_role_readwrite);

  EXECUTE format('
  GRANT INSERT, UPDATE, DELETE
    ON ALL TABLES IN SCHEMA %I
    TO %I'
  , v_schema, v_role_readwrite);

  RAISE NOTICE 'Role ''%'' set up.', v_role_readonly;
  RAISE NOTICE 'Role ''%'' set up.', v_role_readwrite;


  --
  -- CREATE the tables of the workspace schema
  --
  EXECUTE format('SET search_path = %s', v_schema);

  RAISE NOTICE 'Creating table for workspace ''%''...', v_schema;

  --
  -- CREATE tables from core schema
  --
  EXECUTE format('CREATE TABLE "role" (
    workspaceId uuid DEFAULT ''%s'',

    CONSTRAINT "PK_role" PRIMARY KEY (id),

    CONSTRAINT "FK_role_workspace" FOREIGN KEY ("workspaceId")
      REFERENCES "core"."lck_workspace" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION

  ) INHERITS ("core"."lck_role")', $1);

  EXECUTE format('CREATE TABLE "group" (
    workspaceId uuid DEFAULT ''%s'',

    CONSTRAINT "PK_group" PRIMARY KEY (id),

    CONSTRAINT "FK_group_workspace" FOREIGN KEY ("workspaceId")
      REFERENCES "core"."lck_workspace" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION,

    CONSTRAINT "FK_group_role" FOREIGN KEY ("roleId")
      REFERENCES "role" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION

  ) INHERITS ("core"."lck_group")', $1);

  CREATE INDEX IF NOT EXISTS "IDX_group_role"
    ON "group" USING btree
    ("roleId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE "userGroup" (

    CONSTRAINT "PK_userGroup" PRIMARY KEY ("userId", "groupId"),

    CONSTRAINT "FK_userGroup_group" FOREIGN KEY ("groupId")
      REFERENCES "group" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE,

    CONSTRAINT "FK_userGroup_user" FOREIGN KEY ("userId")
      REFERENCES "core"."lck_user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE

  ) INHERITS ("core"."lck_userGroup");

  CREATE INDEX IF NOT EXISTS "IDX_userGroup_group"
    ON "userGroup" USING btree
    ("groupId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_userGroup_user"
    ON "userGroup" USING btree
    ("userId" ASC NULLS LAST)
    TABLESPACE pg_default;

  EXECUTE format('CREATE TABLE "datasource" (
    "workspaceId" uuid NOT NULL DEFAULT ''%s'',

    CONSTRAINT "PK_datasource" PRIMARY KEY (id),
    CONSTRAINT "UNQ_ds_slug" UNIQUE (slug, "workspaceId"),
    CONSTRAINT "CHECK_datasource_client"
      CHECK (client = ANY (ARRAY[''sqlite3''::text, ''pg''::text, ''legacy''::text]))

  ) INHERITS ("core"."lck_datasource")', $1);

  -- CREATE all tables for metamodel

  CREATE TABLE "table" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(255) NOT NULL,
    slug character varying(255),
    documentation text,
    settings jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "datasourceId" uuid NOT NULL,
    CONSTRAINT "PK_table" PRIMARY KEY (id),
    CONSTRAINT "UNQ_table_slug" UNIQUE (slug),
    CONSTRAINT "FK_table_datasource" FOREIGN KEY ("datasourceId")
      REFERENCES "datasource" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS "IDX_table_slug"
    ON "table" USING btree
    (slug ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_table_datasource"
    ON "table" USING btree
    ("datasourceId" ASC NULLS LAST)
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
    CONSTRAINT "PK_tableRelation" PRIMARY KEY ("fromId", "toId", "throughId"),
    CONSTRAINT "CHECK_tableRelation_type" CHECK (type = ANY (ARRAY['1-n'::text, 'n-1'::text, 'n-n'::text, '1-1'::text]))
  );

  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_from"
    ON "tableRelation" USING btree
    ("fromId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_to"
    ON "tableRelation" USING btree
    ("toId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_through"
    ON "tableRelation" USING btree
    ("throughId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE "tableField" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(255),
    type character varying(20),
    slug character varying(255),
    documentation text,
    position integer,
    reference boolean NOT NULL default(false),
    "referencePosition" integer,
    "tableId" uuid NOT NULL,

    settings jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_tableField_table" FOREIGN KEY ("tableId")
        REFERENCES "table" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "PK_tableField" PRIMARY KEY (id),
    CONSTRAINT "CHECK_tableField_type" CHECK (type = ANY (ARRAY[
      --
      -- Primitives
      --
      'BOOLEAN'::text,
      'STRING'::text,
      'NUMBER'::text,
      'FLOAT'::text,
      'DATE'::text,
      'TEXT'::text,
      'DATETIME'::text,
      --
      -- Users / groups
      --
      'USER'::text,
      'GROUP'::text,
      'MULTI_USER'::text,
      'MULTI_GROUP'::text,
      --
      -- Schema
      --
      'RELATION'::text,
      'LOOKUP'::text,
      'VIRTUAL_LOOKUP'::text,
      'ROLLUP'::text,
      --
      -- Complex
      --
      'SINGLE_SELECT'::text,
      'MULTI_SELECT'::text,
      'FORMULA'::text,
      --
      -- Media
      --
      'MEDIA'::text,
      'URL'::text,
      --
      -- Geometry
      --
      'GEOMETRY_POINT'::text,
      'GEOMETRY_POLYGON'::text,
      'GEOMETRY_LINESTRING'::text,
      'GEOMETRY_MULTIPOINT'::text,
      'GEOMETRY_MULTIPOLYGON'::text,
      'GEOMETRY_MULTILINESTRING'::text
    ]))
  );
  CREATE INDEX IF NOT EXISTS "IDX_tableField_table"
    ON "tableField" USING btree
    ("tableId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE dataset (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(255),
    documentation text,
    "tableId" uuid NOT NULL,

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_dataset" PRIMARY KEY (id),

    CONSTRAINT "FK_dataset_tableId" FOREIGN KEY ("tableId")
      REFERENCES "table" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS "IDX_dataset_table"
    ON "dataset" USING btree
    ("tableId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE "datasetField" (
    "datasetId" uuid NOT NULL,
    "tableFieldId" uuid NOT NULL,
    position integer,
    "sortOrder" character varying(4),
    filter jsonb DEFAULT '{}'::jsonb,
    visible boolean NOT NULL default(true),
    settings jsonb DEFAULT '{}'::jsonb,

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_datasetField" PRIMARY KEY ("datasetId", "tableFieldId"),
    CONSTRAINT "UNQ_datasetField" UNIQUE ("datasetId", "tableFieldId"),

    CONSTRAINT "FK_datasetField_dataset" FOREIGN KEY ("datasetId")
        REFERENCES "dataset" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_datasetField_tableField" FOREIGN KEY ("tableFieldId")
        REFERENCES "tableField" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "CHECK_datasetField_sortOrder"
      CHECK ("sortOrder" = ANY (ARRAY['ASC'::text, 'DESC'::text]))

  );
  CREATE INDEX IF NOT EXISTS "IDX_datasetField_dataset"
    ON "datasetField" USING btree
    ("datasetId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_datasetField_tableField"
    ON "datasetField" USING btree
    ("tableFieldId" ASC NULLS LAST)
    TABLESPACE pg_default;

  RAISE NOTICE 'Schema ''%'' set up.', v_schema;

  RAISE NOTICE 'End of creation of the workspace ''%''.', v_schema;


END
$BODY$;