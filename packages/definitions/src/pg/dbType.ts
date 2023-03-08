/**
 * PostgreSQL data types
 * Generated on a pg database
 * 2023-03-03
 * 
 * https://www.postgresql.org/docs/current/datatype.html
 */

/**
SELECT n.nspname as "Schema",
  pg_catalog.format_type(t.oid, NULL) AS "Name",
  pg_catalog.obj_description(t.oid, 'pg_type') as "Description"
FROM pg_catalog.pg_type t
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid))
  AND NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
  AND pg_catalog.pg_type_is_visible(t.oid)
ORDER BY 1, 2;
*/

export type pgDbTypes =
  /**
   * Schema pb_catalog
   */
  'abstime' //	absolute, limited-range date and time (Unix system time)
  | 'aclitem' //	access control list
  | 'any'
  | 'anyarray' //	
  | 'anyelement' //	
  | 'anyenum' //	
  | 'anynonarray' //	
  | 'anyrange' //	
  | 'bigint' //	~18 digit integer, 8-byte storage
  | 'bit' //	fixed-length bit string
  | 'bit varying' //	variable-length bit string
  | 'boolean' //	boolean, 'true'/'false'
  | 'box' //	geometric box '(lower left,upper right)'
  | 'bytea' //	variable-length string, binary values escaped
  | 'char'	// single character
  | 'character' //	char(length), blank-padded string, fixed storage length
  | 'character varying' //	varchar(length), non-blank-padded string, variable storage length
  | 'cid' //	command identifier type, sequence in transaction id
  | 'cidr' //	network IP address/netmask, network address
  | 'circle' //	geometric circle '(center,radius)'
  | 'cstring' //	
  | 'date' //	date
  | 'daterange' //	range of dates
  | 'double' // precision	double-precision floating point number, 8-byte storage
  | 'event_trigger' //	
  | 'fdw_handler' //	
  | 'gtsvector' //	GiST index internal text representation for text search
  | 'index_am_handler' //	
  | 'inet' //	IP address/netmask, host address, netmask optional
  | 'int2vector' //	array of int2, used in system tables
  | 'int4range' //	range of integers
  | 'int8range' //	range of bigints
  | 'integer' //	-2 billion to 2 billion integer, 4-byte storage
  | 'internal' //	
  | 'interval' //	@ <number> <units>, time interval
  | 'json' //	
  | 'jsonb' //	Binary JSON
  | 'language_handler' //	
  | 'line' //	geometric line
  | 'lseg' //	geometric line segment '(pt1,pt2)'
  | 'macaddr' //	XX:XX:XX:XX:XX:XX, MAC address
  | 'money' //	monetary amounts, $d,ddd.cc
  | 'name' //	63-byte type for storing system identifiers
  | 'numeric' //	numeric(precision, decimal), arbitrary precision number
  | 'numrange' //	range of numerics
  | 'oid' //	object identifier(oid), maximum 4 billion
  | 'oidvector' //	array of oids, used in system tables
  | 'opaque' //	
  | 'path' //	geometric path '(pt1,...)'
  | 'pg_ddl_command' //	internal type for passing CollectedCommand
  | 'pg_lsn' //	PostgreSQL LSN datatype
  | 'pg_node_tree' //	string representing an internal node tree
  | 'point' //	geometric point '(x, y)'
  | 'polygon' //	geometric polygon '(pt1,...)'
  | 'real' //	single-precision floating point number, 4-byte storage
  | 'record' //	
  | 'refcursor' //	reference to cursor (portal name)
  | 'regclass' //	registered class
  | 'regconfig' //	registered text search configuration
  | 'regdictionary' //	registered text search dictionary
  | 'regnamespace' //	registered namespace
  | 'regoper' //	registered operator
  | 'regoperator' //	registered operator (with args)
  | 'regproc' //	registered procedure
  | 'regprocedure' //	registered procedure (with args)
  | 'regrole' //	registered role
  | 'regtype' //	registered type
  | 'reltime' //	relative, limited-range time interval (Unix delta time)
  | 'smallint' //	-32 thousand to 32 thousand, 2-byte storage
  | 'smgr' //	storage manager
  | 'text' //	variable-length string, no limit specified
  | 'tid' //	(block, offset), physical location of tuple
  | 'timestamp' //	date and time
  | 'timestamp without time zone' //	date and time
  | 'timestamp with time zone' //	date and time with time zone
  | 'timestamptz' //	date and time with time zone
  | 'time' //	time of day
  | 'time without time zone' //	time of day
  | 'time with time zone' //	time of day with time zone
  | 'timetz' //	time of day with time zone
  | 'tinterval' //	(abstime,abstime), time interval
  | 'trigger' //	
  | 'tsm_handler' //	
  | 'tsquery' //	query representation for text search
  | 'tsrange' //	range of timestamps without time zone
  | 'tstzrange' //	range of timestamps with time zone
  | 'tsvector' //	text representation for text search
  | 'txid_snapshot' //	txid snapshot
  | 'unknown' //	
  | 'uuid' //	UUID datatype
  | 'void' //	
  | 'xid' //	transaction id
  | 'xml' //	XML content
  /**
   * Schema public
   */
  | 'addbandarg' //	postgis raster type: A composite type used as input into the ST_AddBand function defining the attributes and initial value of the new band.
  | 'agg_count' //	
  | 'agg_samealignment' //	
  | 'box2d' //	postgis type: A box composed of x min, ymin, xmax, ymax. Often used to return the 2d enclosing box of a geometry.
  | 'box2df' //	
  | 'box3d' //	postgis type: A box composed of x min, ymin, zmin, xmax, ymax, zmax. Often used to return the 3d extent of a geometry or collection of geometries.
  | 'geography' //	postgis type: Ellipsoidal spatial data type.
  | 'geometry' //	postgis type: Planar spatial data type.
  | 'geometry_dump' //	postgis type: A spatial datatype with two fields - geom (holding a geometry object) and path[] (a 1-d array holding the position of the geometry within the dumped object.)
  | 'geomval' //	postgis raster type: A spatial datatype with two fields - geom (holding a geometry object) and val (holding a double precision pixel value from a raster band).
  | 'gidx' //	
  | 'rastbandarg' //	postgis raster type: A composite type for use when needing to express a raster and a band index of that raster.
  | 'raster' //	postgis raster type: raster spatial data type.
  | 'reclassarg' //	postgis raster type: A composite type used as input into the ST_Reclass function defining the behavior of reclassification.
  | 'spheroid' //	
  | 'summarystats' //	postgis raster type: A composite type returned by the ST_SummaryStats and ST_SummaryStatsAgg functions.
  | 'unionarg' //	postgis raster type: A composite type used as input into the ST_Union function defining the bands to be processed and behavior of the UNION operation.
  | 'valid_detail' //	
  /**
   * Schema tiger
   */
  | 'norm_addy' //	
  /**
   * Schema topology
   */
  | 'getfaceedges_returntype' //	postgis type: A composite type that consists of a sequence number and edge number. This is the return type for ST_GetFaceEdges
  | 'topoelement' //	postgis domain: An array of 2 integers generally used to identify a TopoGeometry component.
  | 'topoelementarray' //	postgis domain: An array of TopoElement objects
  | 'topogeometry' //	postgis type: A composite type representing a topologically defined geometry
  | 'validatetopology_returntype' //	postgis type: A composite type that consists of an error message and id1 and id2 to denote location of error. This is the return type for ValidateTopology
