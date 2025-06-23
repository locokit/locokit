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

  RAISE NOTICE 'Calling createWorkspaceSchema(''%'')', workspace_id;

  SET search_path = core;

  -- SELECT the workspace
  EXECUTE format('SELECT *
  FROM lck_workspace
  WHERE id = ''%s''', $1)
  INTO v_workspace
  USING workspace_id;

  RAISE NOTICE 'Workspace found : slug = %, name = %', v_workspace.slug, v_workspace.name;

  v_schema := 'w_' || v_workspace.slug;
  v_role_readonly := v_schema || '_ro';
  v_role_readwrite := v_schema || '_rw';


  -- CREATE workspace schema
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema);

  -- CREATE extension postgis
  EXECUTE format('CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA %I', v_schema);

  RAISE NOTICE 'Schema ''%'' created.', v_schema;

  -- CREATE roles

  IF EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = v_role_readonly
  ) THEN
    RAISE NOTICE 'Role "%s" already exists. Skipping.', v_role_readonly;
  ELSE
    EXECUTE format('CREATE ROLE %I', v_role_readonly);
  END IF;

  RAISE NOTICE 'Role ''%'' created.', v_role_readonly;

  IF EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = v_role_readwrite
  ) THEN
    RAISE NOTICE 'Role "%s" already exists. Skipping.', v_role_readwrite;
  ELSE
    EXECUTE format('CREATE ROLE %I', v_role_readwrite);
  END IF;

  RAISE NOTICE 'Role ''%'' created.', v_role_readwrite;

  -- GRANT access to readonly (user with access to the workspace)
  EXECUTE format('
    GRANT SELECT
    ON ALL TABLES IN SCHEMA %I
    TO %I'
  , v_schema, v_role_readonly);

  -- GRANT access to core.lck_user
  EXECUTE format('GRANT USAGE ON SCHEMA core TO %I', v_role_readonly);
  EXECUTE format('GRANT SELECT (id, username, profile) ON core.lck_user TO %I', v_role_readonly);

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
  EXECUTE format('CREATE TABLE IF NOT EXISTS "policy" (
    "workspaceId" uuid DEFAULT ''%s'',

    CONSTRAINT "PK_policy" PRIMARY KEY (id),

    CONSTRAINT "FK_policy_workspace" FOREIGN KEY ("workspaceId")
      REFERENCES "core"."lck_workspace" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE

  ) INHERITS ("core"."lck_policy")', workspace_id);

  EXECUTE format('CREATE TABLE IF NOT EXISTS "group" (
    "workspaceId" uuid DEFAULT ''%s'',

    CONSTRAINT "PK_group" PRIMARY KEY (id),

    CONSTRAINT "FK_group_workspace" FOREIGN KEY ("workspaceId")
      REFERENCES "core"."lck_workspace" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE,

    CONSTRAINT "FK_group_policy" FOREIGN KEY ("policyId")
      REFERENCES "policy" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION

  ) INHERITS ("core"."lck_group")', workspace_id);

  CREATE INDEX IF NOT EXISTS "IDX_group_policy"
    ON "group" USING btree
    ("policyId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "userGroup" (

    CONSTRAINT "PK_userGroup" PRIMARY KEY ("id"),

    CONSTRAINT "UNQ_userGroup" UNIQUE ("groupId", "userId"),

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

  EXECUTE format('CREATE TABLE IF NOT EXISTS "datasource" (
    "workspaceId" uuid NOT NULL DEFAULT ''%s'',

    CONSTRAINT "PK_datasource" PRIMARY KEY (id),
    CONSTRAINT "UNQ_ds_slug" UNIQUE NULLS NOT DISTINCT (slug, "workspaceId")

  ) INHERITS ("core"."lck_datasource")', workspace_id);

  -- CREATE all tables for metamodel

  CREATE TABLE IF NOT EXISTS "migration" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    name character varying(50),

    "datasourceId" uuid NOT NULL,

    applied timestamp with time zone DEFAULT null,
    reverted timestamp with time zone DEFAULT null,

    direction character varying(28) NOT NULL DEFAULT 'both',

    "diffToApply" jsonb DEFAULT null,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_migration" PRIMARY KEY (id),
    CONSTRAINT "FK_migration_datasource" FOREIGN KEY ("datasourceId")
      REFERENCES "datasource" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE,
    CONSTRAINT "CHECK_migration_direction" CHECK (direction = ANY (ARRAY[
      'both'::text,
      'from-datasource-to-metamodel'::text,
      'from-metamodel-to-datasource'::text
    ]))
  );

  CREATE INDEX IF NOT EXISTS "IDX_migration_datasource"
    ON "migration" USING btree
    ("datasourceId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "table" (
    CONSTRAINT "PK_table" PRIMARY KEY (id),
    CONSTRAINT "UNQ_table_slug" UNIQUE NULLS NOT DISTINCT ("schema", slug, "datasourceId"),
    CONSTRAINT "FK_table_datasource" FOREIGN KEY ("datasourceId")
      REFERENCES "datasource" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
  ) INHERITS ("core"."lck_table");

  CREATE INDEX IF NOT EXISTS "IDX_table_slug"
    ON "table" USING btree
    (slug ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_table_datasource"
    ON "table" USING btree
    ("datasourceId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "tableField" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(50),
    type character varying(24),
    "dbType" character varying(30),
    slug character varying(50),
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
    CONSTRAINT "UNQ_tableField_slug" UNIQUE NULLS NOT DISTINCT (slug, "tableId"),
    CONSTRAINT "PK_tableField" PRIMARY KEY (id),
    CONSTRAINT "CHECK_tableField_type" CHECK (type = ANY (ARRAY[
      'NATIVE'::text,
      --
      -- Ids
      --
      'ID_NUMBER'::text,
      'ID_UUID'::text,

      --
      -- Primitives
      --
      'BOOLEAN'::text,

      'NUMBER'::text,
      'FLOAT'::text,

      'STRING'::text,
      'TEXT'::text,

      'DATE'::text,
      'DATETIME'::text,

      'UUID'::text,

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
      'JSON'::text,
      'NETWORK'::text,
      --
      -- Media
      --
      'MEDIA'::text,
      'URL'::text,
      --
      -- Geometry
      --
      'GEOMETRY'::text,
      'GEOMETRY_POINT'::text,
      'GEOMETRY_POLYGON'::text,
      'GEOMETRY_LINESTRING'::text,
      'GEOMETRY_MULTIPOINT'::text,
      'GEOMETRY_MULTIPOLYGON'::text,
      'GEOMETRY_MULTILINESTRING'::text,
      --
      -- Arrays
      --
      'ARRAY_TEXT'::text,
      'ARRAY_UUID'::text,
      'ARRAY_BOOLEAN'::text,
      'ARRAY_NUMBER'::text,
      'ARRAY_DATE'::text

    ]))
  );
  CREATE INDEX IF NOT EXISTS "IDX_tableField_table"
    ON "tableField" USING btree
    ("tableId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "tableRelation" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    name character varying(50),
    slug character varying(50),

    "fromTableId" uuid NOT NULL,
    "toTableId" uuid NOT NULL,

    "fromFieldId" uuid NOT NULL,
    "toFieldId" uuid NOT NULL,

    "throughTableId" uuid,
    "throughFieldId" uuid,
    type character varying(3),

    settings jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_tableRelation" PRIMARY KEY (id),
    CONSTRAINT "UNQ_tableRelation_slug" UNIQUE NULLS NOT DISTINCT (slug, "fromTableId"),
    CONSTRAINT "FK_tableRelation_from" FOREIGN KEY ("fromTableId")
        REFERENCES "table" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_tableRelation_to" FOREIGN KEY ("toTableId")
        REFERENCES "table" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_tableRelation_through" FOREIGN KEY ("throughTableId")
        REFERENCES "table" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_tableRelation_fromField" FOREIGN KEY ("fromFieldId")
        REFERENCES "tableField" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "FK_tableRelation_toField" FOREIGN KEY ("toFieldId")
        REFERENCES "tableField" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "FK_tableRelation_throughField" FOREIGN KEY ("throughFieldId")
        REFERENCES "tableField" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "CHECK_tableRelation_type" CHECK (type = ANY (ARRAY['1-n'::text, 'n-1'::text, 'n-m'::text, '1-1'::text]))
  );

  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_fromTable"
    ON "tableRelation" USING btree
    ("fromTableId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_toTable"
    ON "tableRelation" USING btree
    ("toTableId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_throughTable"
    ON "tableRelation" USING btree
    ("throughTableId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_fromField"
    ON "tableRelation" USING btree
    ("fromFieldId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_toField"
    ON "tableRelation" USING btree
    ("toFieldId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_tableRelation_throughField"
    ON "tableRelation" USING btree
    ("throughFieldId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS dataset (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(255),
    slug character varying(255),
    documentation text,
    "tableId" uuid NOT NULL,

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_dataset" PRIMARY KEY (id),
    CONSTRAINT "UNQ_dataset_slug" UNIQUE NULLS NOT DISTINCT (slug, "tableId"),

    CONSTRAINT "FK_dataset_tableId" FOREIGN KEY ("tableId")
      REFERENCES "table" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
  ) INHERITS ("core"."lck_dataset");
  CREATE INDEX IF NOT EXISTS "IDX_dataset_table"
    ON "dataset" USING btree
    ("tableId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "datasetField" (
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
    CONSTRAINT "UNQ_datasetField" UNIQUE NULLS NOT DISTINCT ("datasetId", "tableFieldId"),

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

  CREATE TABLE IF NOT EXISTS "policyVariable" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    name character varying(50),
    slug character varying(50) NOT NULL,
    documentation text,

    "policyId" uuid NOT NULL,
    "tableId" uuid NOT NULL,
    "tableFieldId" uuid NOT NULL,
    "level" character varying(10),

    "defaultValue" jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_policyVariable" PRIMARY KEY (id),

    CONSTRAINT "FK_policyVariable_policyId" FOREIGN KEY ("policyId")
        REFERENCES "policy" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_policyVariable_tableId" FOREIGN KEY ("tableId")
        REFERENCES "table" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_policyVariable_tableFieldId" FOREIGN KEY ("tableFieldId")
        REFERENCES "tableField" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,

    CONSTRAINT "CHECK_policyVariable_level" CHECK (
      "level" = ANY (ARRAY[
        'user'::text,
        'group'::text,
        'user+group'::text
      ])
    )
  );
  CREATE INDEX IF NOT EXISTS "IDX_policyVariable_policy"
    ON "policyVariable" USING btree
    ("policyId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_policyVariable_table"
    ON "policyVariable" USING btree
    ("tableId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_policyVariable_tableField"
    ON "policyVariable" USING btree
    ("tableFieldId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "policyTable" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    documentation text,

    "policyId" uuid NOT NULL,
    "tableId" uuid NOT NULL,

    "read" jsonb DEFAULT '{}'::jsonb,
    "create" jsonb DEFAULT '{}'::jsonb,
    "patch" jsonb DEFAULT '{}'::jsonb,
    "remove" jsonb DEFAULT '{}'::jsonb,

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_policyTable" PRIMARY KEY (id),

    CONSTRAINT "FK_policyTable_policyId" FOREIGN KEY ("policyId")
        REFERENCES "policy" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_policyTable_tableId" FOREIGN KEY ("tableId")
        REFERENCES "table" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS "IDX_policyTable_policy"
    ON "policyTable" USING btree
    ("policyId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_policyTable_table"
    ON "policyTable" USING btree
    ("tableId" ASC NULLS LAST)
    TABLESPACE pg_default;


  CREATE TABLE IF NOT EXISTS "policyTableField" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    documentation text,

    "policyId" uuid NOT NULL,
    "tableFieldId" uuid NOT NULL,

    "read" boolean DEFAULT FALSE,
    "write" boolean DEFAULT FALSE,

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_policyTableField" PRIMARY KEY (id),

    CONSTRAINT "FK_policyTableField_policyId" FOREIGN KEY ("policyId")
        REFERENCES "policy" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_policyTableField_tableFieldId" FOREIGN KEY ("tableFieldId")
        REFERENCES "tableField" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS "IDX_policyTableField_policy"
    ON "policyTableField" USING btree
    ("policyId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_policyTableField_tableField"
    ON "policyTableField" USING btree
    ("tableFieldId" ASC NULLS LAST)
    TABLESPACE pg_default;


  CREATE TABLE IF NOT EXISTS "groupPolicyVariable" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    documentation text,

    "value" jsonb DEFAULT '{}'::jsonb,

    "policyVariableId" uuid NOT NULL,
    "groupId" uuid NOT NULL,

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_groupPolicyVariable" PRIMARY KEY (id),

    CONSTRAINT "FK_groupPolicyVariable_policyVariableId" FOREIGN KEY ("policyVariableId")
      REFERENCES "policyVariable" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE,
    CONSTRAINT "FK_groupPolicyVariable_groupId" FOREIGN KEY ("groupId")
      REFERENCES "group" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE

  );
  CREATE INDEX IF NOT EXISTS "IDX_groupPolicyVariable_policyVariable"
    ON "groupPolicyVariable" USING btree
    ("policyVariableId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_groupPolicyVariable_group"
    ON "groupPolicyVariable" USING btree
    ("groupId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "userGroupPolicyVariable" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    "value" jsonb DEFAULT '{}'::jsonb,

    "userGroupId" uuid NOT NULL,
    "policyVariableId" uuid NOT NULL,

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_userGroupPolicyVariable" PRIMARY KEY (id),

    CONSTRAINT "FK_userGroupPolicyVariable_policyVariableId" FOREIGN KEY ("policyVariableId")
      REFERENCES "policyVariable" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE,
    CONSTRAINT "FK_userGroupPolicyVariable_groupId" FOREIGN KEY ("userGroupId")
      REFERENCES "userGroup" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE

  );
  CREATE INDEX IF NOT EXISTS "IDX_userGroupPolicyVariable_policyVariable"
    ON "userGroupPolicyVariable" USING btree
    ("policyVariableId" ASC NULLS LAST)
    TABLESPACE pg_default;
  CREATE INDEX IF NOT EXISTS "IDX_userGroupPolicyVariable_userGroup"
    ON "userGroupPolicyVariable" USING btree
    ("userGroupId" ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "workflow" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(255),
    slug character varying(255) NOT NULL,
    documentation text,
    public boolean DEFAULT FALSE,
    filepath character varying(255) NOT NULL,

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_workflow" PRIMARY KEY (id),
    CONSTRAINT "UNQ_workflow_slug" UNIQUE NULLS NOT DISTINCT (slug)
  );
  CREATE INDEX IF NOT EXISTS "IDX_workflow_slug"
    ON "workflow" USING btree
    (slug ASC NULLS LAST)
    TABLESPACE pg_default;

  CREATE TABLE IF NOT EXISTS "workflowRun" (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "workflowId" uuid NOT NULL,

    input jsonb DEFAULT null,
    result jsonb DEFAULT null,
    output jsonb DEFAULT null,
    status character varying(3) DEFAULT 'NOK',

    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_workflowRun" PRIMARY KEY (id),
    CONSTRAINT "FK_workflowRun_workflow" FOREIGN KEY ("workflowId")
        REFERENCES "workflow" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "CHECK_workflowRun_status" CHECK (status = ANY (ARRAY[
      'OK'::text,
      'NOK'::text
    ]))
  );

  RAISE NOTICE 'View ''%''.''lck_user'' set up.', v_schema;

  EXECUTE format('
  CREATE OR REPLACE VIEW %I.lck_user AS
  SELECT id, username, email, blocked, "isVerified" from "core"."lck_user";'
  , v_schema);

  RAISE NOTICE 'Schema ''%'' set up.', v_schema;

  RAISE NOTICE 'End of creation of the workspace ''%''.', v_schema;


END
$BODY$;
