--
-- Function to drop a dedicated schema in LocoKit database
-- for a specific workspace
--
CREATE OR REPLACE FUNCTION core."dropWorkspaceSchema"(IN "workspace_slug" text)
 RETURNS void
 LANGUAGE plpgsql
AS $BODY$

DECLARE
  v_schema varchar;
  v_role_readonly varchar;
  v_role_readwrite varchar;

BEGIN

  RAISE NOTICE 'Calling dropWorkspaceSchema(''%'')', $1;

  SET search_path = core;

  v_schema := 'w_' || workspace_slug;
  v_role_readonly := v_schema || '_ro';
  v_role_readwrite := v_schema || '_rw';

  -- DROP workspace schema
  EXECUTE format('DROP SCHEMA IF EXISTS %I CASCADE', v_schema);

  RAISE NOTICE 'Schema ''%'' dropped.', v_schema;

  -- DROP v_role_readwrite as it inherit from v_role_readonly
  EXECUTE format('DROP ROLE IF EXISTS %I', v_role_readwrite);
  RAISE NOTICE 'Role ''%'' dropped.', v_role_readwrite;

  -- REVOKE access to core.user
  EXECUTE format('REVOKE ALL ON core.lck_user FROM %I', v_role_readonly);
  EXECUTE format('REVOKE USAGE ON SCHEMA core FROM %I', v_role_readonly);

  EXECUTE format('DROP ROLE IF EXISTS %I', v_role_readonly);
  RAISE NOTICE 'Role ''%'' dropped.', v_role_readonly;

RAISE NOTICE 'End of drop of the workspace ''%''.', v_schema;


END
$BODY$
;
