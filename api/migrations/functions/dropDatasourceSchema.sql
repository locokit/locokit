--
-- Function to drop a dedicated schema in LocoKit database
-- for a specific datasource
--
CREATE OR REPLACE FUNCTION core."dropDatasourceSchema"(IN "datasource_slug" text)
 RETURNS void
 LANGUAGE plpgsql
AS $BODY$

DECLARE
  v_schema varchar;

  cur_workspace_roles cursor (role_prefix text) for
    SELECT rolname FROM pg_catalog.pg_roles
    WHERE rolname LIKE role_prefix || '%' ;

BEGIN

  RAISE NOTICE 'Calling dropDatasourceSchema(''%'')', $1;

  SET search_path = core;

  v_schema := 'ds_' || datasource_slug;

  -- DROP workspace schema
  EXECUTE format('DROP SCHEMA IF EXISTS %I CASCADE', v_schema);

  RAISE NOTICE 'Schema ''%'' dropped.', v_schema;

  FOR v_current_role IN cur_workspace_roles(v_schema) LOOP
    RAISE NOTICE 'Current role ''%''', v_current_role.rolname;

    -- REVOKE access to core.user
    EXECUTE format('REVOKE ALL ON core.lck_user FROM %I', v_current_role.rolname);
    EXECUTE format('REVOKE USAGE ON SCHEMA core FROM %I', v_current_role.rolname);

    EXECUTE format('DROP ROLE IF EXISTS %I', v_current_role.rolname);
    RAISE NOTICE 'Role ''%'' dropped.', v_current_role.rolname;

  END LOOP;

  RAISE NOTICE 'End of drop of the workspace ''%''.', v_schema;

END;
$BODY$
