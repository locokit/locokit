--
-- Function to create a dedicated schema in LocoKit database
-- for a specific workspace
--
CREATE OR REPLACE FUNCTION "core"."createDatasourceSchema" (IN "datasource_id" uuid)
  RETURNS void
  LANGUAGE 'plpgsql'
  VOLATILE
  PARALLEL UNSAFE
  COST 100

AS $BODY$

DECLARE
  v_datasource core.lck_datasource%ROWTYPE;
  v_schema varchar;
  v_role_readonly varchar;
  v_role_readwrite varchar;
  v_role_alter varchar;

BEGIN

  RAISE NOTICE 'Calling createDatasourceSchema(''%'')', datasource_id;

  SET search_path = core;

  -- SELECT the datasource
  EXECUTE format('SELECT *
  FROM lck_datasource
  WHERE id = ''%s''', $1)
  INTO v_datasource
  USING datasource_id;

  RAISE NOTICE 'Datasource found : slug = %, name = %', v_datasource.slug, v_datasource.name;

  v_schema := 'ds_' || v_datasource.id ;
  v_role_readonly := v_schema || '_ro';
  v_role_readwrite := v_schema || '_rw';
  v_role_alter := v_schema || '_alter';

  -- CREATE workspace schema
  EXECUTE format('CREATE SCHEMA %I', v_schema);

  RAISE NOTICE 'Schema ''%'' created.', v_schema;

  -- CREATE roles
  EXECUTE format('CREATE ROLE %I', v_role_readonly);

  RAISE NOTICE 'Role ''%'' created.', v_role_readonly;

  EXECUTE format('CREATE ROLE %I', v_role_readwrite);

  RAISE NOTICE 'Role ''%'' created.', v_role_readwrite;

  EXECUTE format('CREATE ROLE %I', v_role_alter);

  RAISE NOTICE 'Role ''%'' created.', v_role_alter;

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

  RAISE NOTICE 'Schema ''%'' set up.', v_schema;

  RAISE NOTICE 'End of creation of the workspace ''%''.', v_schema;


END
$BODY$;
