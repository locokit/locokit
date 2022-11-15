/* eslint-disable camelcase */

/**
 * Ids are not in order,
 * this is for retrocompatibility with 0.x version
 */
export enum FIELD_TYPE {
  /**
   * Primitives
   */
  BOOLEAN = 1,
  STRING = 2,
  NUMBER = 3,
  FLOAT = 4,
  DATE = 5,
  TEXT = 16,
  DATETIME = 21,

  /**
   * Users / groups
   */
  USER = 6,
  GROUP = 7,
  MULTI_USER = 14,
  MULTI_GROUP = 15,

  /**
   * Schema
   */
  RELATION = 8,
  LOOKUP = 9,
  VIRTUAL_LOOKUP = 25,
  ROLLUP = 26,

  /**
   * Complex
   */
  SINGLE_SELECT = 10,
  MULTI_SELECT = 11,
  FORMULA = 12,

  /**
   * Media
   */
  MEDIA = 13,
  URL = 17,

  /**
   * Geometry
   */
  GEOMETRY_POINT = 18,
  GEOMETRY_POLYGON = 19,
  GEOMETRY_LINESTRING = 20,
  GEOMETRY_MULTIPOINT = 22,
  GEOMETRY_MULTIPOLYGON = 23,
  GEOMETRY_MULTILINESTRING = 24,
}
