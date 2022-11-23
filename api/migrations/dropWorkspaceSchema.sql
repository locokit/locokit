--
-- Function to drop a dedicated schema in LocoKit database
-- for a specific workspace
--
CREATE OR REPLACE FUNCTION "core"."dropWorkspaceSchema" (IN "workspace_id" uuid)
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

  -- DROP workspace schema
  EXECUTE format('DROP SCHEMA IF EXISTS %I CASCADE', v_schema);

  RAISE NOTICE 'Schema ''%'' dropped.', v_schema;

  -- REVOKE access to core.user
  EXECUTE format('REVOKE ALL ON core.user FROM %I', v_role_readonly);
  EXECUTE format('REVOKE ALL ON core.user FROM %I', v_role_readwrite);

  -- DROP roles
  EXECUTE format('DROP ROLE %I', v_role_readonly);
  RAISE NOTICE 'Role ''%'' dropped.', v_role_readonly;

  EXECUTE format('DROP ROLE %I', v_role_readwrite);
  RAISE NOTICE 'Role ''%'' dropped.', v_role_readwrite;

RAISE NOTICE 'End of drop of the workspace ''%''.', v_schema;


END
$BODY$;
