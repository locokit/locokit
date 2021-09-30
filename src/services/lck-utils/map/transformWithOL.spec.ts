/* eslint-disable @typescript-eslint/camelcase */
import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'
import { GeoJSONFeature } from 'ol/format/GeoJSON'

import { LckTableRow, LckTableRowDataComplex, LckTableView, LckTableViewColumn, SORT_COLUMN } from '@/services/lck-api/definitions'

import {
  convertToValidGeometry,
  GEO_STYLE,
  getEditableGeometryTypes,
  getLckGeoResources,
  getOnlyGeoColumns,
  getStyleLayers,
  isGeoBlock,
  LckPopupI18nOptions,
  makeGeoJsonFeaturesCollection,
  mapDefaultStyle,
  transformFeatureToWKT,
} from './transformWithOL'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import GeometryType from 'ol/geom/GeometryType'
import MultiPoint from 'ol/geom/MultiPoint'
import MultiPolygon from 'ol/geom/MultiPolygon'
import Polygon from 'ol/geom/Polygon'
import MultiLineString from 'ol/geom/MultiLineString'
import LineString from 'ol/geom/LineString'

// Visualization part
// Page
const pageDetailId = '333c21e6-5339-4748-903f-8c77e21314aa'

// Database part
// Table view
const geoTableView: LckTableView = {
  id: '263c21e6-5339-4748-903f-8c77e21314cf',
  text: 'Table view with geographic data',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
  locked: false,
}

const stringTableView: LckTableView = {
  id: '363c21e6-5339-4748-903f-8c77e21314cg',
  text: 'Table view without geographic data',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
  locked: false,
}

const emptyTableView: LckTableView = {
  id: '463c21e6-5339-4748-903f-8c77e21314ch',
  text: 'Table view without any data',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf',
  locked: false,
}

// Table columns
const defaultParamsTableViewColumn = {
  table_id: geoTableView.table_id,
  editable: false,
  reference: false,
  position: 0,
  transmitted: false,
  displayed: true,
  required: false,
  sort: 'DESC' as SORT_COLUMN,
  table_column_id: '',
  table_view_id: geoTableView.id,
  style: {},
  reference_position: 0,
  locked: false,
}

const geoPointColumn: LckTableViewColumn = {
  text: 'Point',
  id: 'e065323c-1151-447f-be0f-6d2728117b40',
  settings: {},
  column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
  ...defaultParamsTableViewColumn,
}

const geoPolygonColumn: LckTableViewColumn = {
  text: 'Geographic area',
  id: 'e065323c-1151-447f-be0f-6d2728117b39',
  settings: {},
  column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
  ...defaultParamsTableViewColumn,
  editable: true,
}

const geoLineStringColumn: LckTableViewColumn = {
  text: 'Line string',
  id: 'e065323c-1151-447f-be0f-6d2728117b38',
  settings: {},
  column_type_id: COLUMN_TYPE.GEOMETRY_LINESTRING,
  ...defaultParamsTableViewColumn,
}

const stringColumn: LckTableViewColumn = {
  text: 'Name',
  id: 'e065323c-1151-447f-be0f-6d2728117b37',
  settings: {},
  column_type_id: COLUMN_TYPE.STRING,
  ...defaultParamsTableViewColumn,
}

const relationBetweenTablesColumn: LckTableViewColumn = {
  text: 'RBT',
  id: 'e065323c-1151-447f-be0f-6d2728117b36',
  settings: {
    tableId: 't065323c-1151-447f-be0f-6d2728117b35',
  },
  column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
  ...defaultParamsTableViewColumn,
}

const booleanLookedUpColumn: LckTableViewColumn = {
  text: 'Boolean LUC',
  id: 'e065323c-1151-447f-be0f-6d2728117b35',
  settings: {
    localField: relationBetweenTablesColumn.id,
    foreignField: 'f065323c-1151-447f-be0f-6d2728117b35',
  },
  column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
  ...defaultParamsTableViewColumn,
}

const geoPointLookedUpColumn: LckTableViewColumn = {
  text: 'Geo Point LUC',
  id: 'e065323c-1151-447f-be0f-6d2728117b34',
  settings: {
    localField: relationBetweenTablesColumn.id,
    foreignField: 'f065323c-1151-447f-be0f-6d2728117b34',
  },
  column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
  ...defaultParamsTableViewColumn,
}

const singleSelectColumn: LckTableViewColumn = {
  text: 'Selection',
  id: 'e065323c-1151-447f-be0f-6d2728117b35',
  settings: {
    values: {
      1: {
        backgroundColor: '#ddd',
        color: '#aaa',
        label: 'First option',
        value: '1',
      },
      2: {
        backgroundColor: '#eee',
        color: '#bbb',
        label: 'Second option',
        value: '2',
      },
      3: {
        backgroundColor: '#fff',
        color: '#ccc',
        label: 'Third option',
        value: '3',
      },
    },
  },
  column_type_id: COLUMN_TYPE.SINGLE_SELECT,
  ...defaultParamsTableViewColumn,
}

const booleanColumn: LckTableViewColumn = {
  text: 'Checkbox',
  id: 'e065323c-1151-447f-be0f-6d2728117b34',
  settings: {},
  column_type_id: COLUMN_TYPE.BOOLEAN,
  ...defaultParamsTableViewColumn,
}

const geoColumns: LckTableViewColumn[] = [
  geoPointColumn,
  geoPolygonColumn,
]

const allColumns: LckTableViewColumn[] = [
  stringColumn,
  geoPointColumn,
  geoPolygonColumn,
]

const allColumnsObject: Record<string, LckTableViewColumn> = {
  [stringColumn.id]: stringColumn,
  [booleanLookedUpColumn.id]: booleanLookedUpColumn,
  [geoPointColumn.id]: geoPointColumn,
  [geoPolygonColumn.id]: geoPolygonColumn,
  [relationBetweenTablesColumn.id]: relationBetweenTablesColumn,
}

geoTableView.columns = allColumns
stringTableView.columns = [stringColumn]

// Table rows
const firstRow: LckTableRow = {
  text: 'First row',
  data: {
    [stringColumn.id]: 'first',
    [booleanLookedUpColumn.id]: {
      reference: 'unknown',
      value: true,
    },
    [relationBetweenTablesColumn.id]: {
      reference: 'foreign-row-1',
      value: 'foreign row 1',
    },
    [geoPolygonColumn.id]: 'SRID=4326;POLYGON((1.4 45.75,2 45.6,1.9 45.3,1.4 45.75))',
    [geoPointColumn.id]: 'SRID=4326;POINT(1.4 45)',
    [geoPointLookedUpColumn.id]: { value: 'SRID=4326;POINT(1.4 40)', reference: 'unknown' },
  },
  id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d',
}
const secondRow: LckTableRow = {
  text: '',
  data: {
    [booleanLookedUpColumn.id]: {
      reference: 'unknown',
      value: false,
    },
    [relationBetweenTablesColumn.id]: {
      reference: 'foreign-row-2',
      value: 'foreign row 2',
    },
    [stringColumn.id]: 'second',
    [geoPolygonColumn.id]: 'SRID=4326;POLYGON((1.5 46.75,2.1 46.6,2.0 46.3,1.5 46.75))',
    [geoPointColumn.id]: 'SRID=4326;POINT(1.5 46)',
    [geoPointLookedUpColumn.id]: { value: 'SRID=4326;POINT(1.5 41)', reference: 'unknown' },
  },
  id: '38ed19db-588d-4ca1-8ab3-c8b17d60db3d',
}
const thirdRow: LckTableRow = {
  text: 'third row',
  data: {
    [booleanLookedUpColumn.id]: {
      reference: 'unknown',
      value: false,
    },
    [relationBetweenTablesColumn.id]: {
      reference: 'foreign-row-2',
      value: 'foreign row 2',
    },
    [stringColumn.id]: 'third',
    [geoPolygonColumn.id]: 'SRID=4326;POLYGON((1.5 46.75,2.1 46.6,2.0 46.3,1.5 47.75))',
    [geoPointColumn.id]: 'SRID=4326;POINT(1.6 47)',
    [geoPointLookedUpColumn.id]: { value: 'SRID=4326;POINT(1.5 41)', reference: 'unknown' },
  },
  id: '38ed19db-588d-4ca1-8ab3-c8b17d60db4d',
}
const emptyRow: LckTableRow = {
  text: '',
  data: {},
  id: '38ed19db-588d-4ca1-8ab3-c8b17d60db5d',
}

const rows: LckTableRow[] = [
  firstRow,
  secondRow,
  emptyRow,
]

// Others
const i18nOptions: LckPopupI18nOptions = {
  dateFormat: 'yyyy-mm-dd',
  datetimeFormat: 'yyyy-mm-dd HH:MM',
  noData: 'No data',
  noReference: 'No reference',
}

describe('Transformations with OpenLayers', () => {
  describe('transformFeatureToWKT', () => {
    it('returns the eWKT value related to a single GeoJSON feature', () => {
      const geoJSONFeature: GeoJSONFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [10, 20],
        },
        properties: {},
      }
      expect(transformFeatureToWKT(geoJSONFeature))
        .toBe('SRID=4326;POINT(10 20)')
    })
    it('returns the eWKT value related to a single GeoJSON feature with the specified srid', () => {
      const geoJSONFeature: GeoJSONFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [10, 20],
        },
        properties: {},
      }
      expect(transformFeatureToWKT(geoJSONFeature, undefined, '3857'))
        .toMatch(/^SRID=3857;POINT\(1113194.9[0-9]* 2273030.9[0-9]*\)$/) // Regex to take into account the roundings
    })
    it('returns the eWKT value related to a single GeoJSON feature with the specified srid and target column type id', () => {
      const geoJSONFeature: GeoJSONFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [10, 20],
        },
        properties: {},
      }
      expect(transformFeatureToWKT(geoJSONFeature, COLUMN_TYPE.GEOMETRY_MULTIPOINT, '3857'))
        .toMatch(/^SRID=3857;MULTIPOINT\(\(1113194.9[0-9]* 2273030.9[0-9]*\)\)$/) // Regex to take into account the roundings
    })
    it('returns the eWKT value related to a GeoJSON features collection', () => {
      const geoJSONFeature: GeoJSONFeature = {
        type: 'Feature',
        geometry: {
          type: 'GeometryCollection',
          geometries: [
            {
              coordinates: [10, 20],
              type: 'Point',
            },
            {
              coordinates: [30, 40],
              type: 'Point',
            },
          ],
        },
        properties: {},
      }
      expect(transformFeatureToWKT(geoJSONFeature))
        .toBe('SRID=4326;GEOMETRYCOLLECTION(POINT(10 20),POINT(30 40))')
    })
  })

  describe('isGeoBlock', () => {
    it('Returns true if the current block type is a map view', () => {
      expect(isGeoBlock(BLOCK_TYPE.MAP_SET)).toBe(true)
    })
    it('Returns true if the current block type is a map detail view', () => {
      expect(isGeoBlock(BLOCK_TYPE.MAP_FIELD)).toBe(true)
    })
    it('Returns false if the current block type is a table view', () => {
      expect(isGeoBlock(BLOCK_TYPE.TABLE_SET)).toBe(false)
    })
  })

  describe('convertToValidGeometry', () => {
    it('Keep the same geometry if it is a point for a GEOMETRY_POINT column', () => {
      const feature = new Feature<Point>(new Point([10, 20]))
      convertToValidGeometry(feature, COLUMN_TYPE.GEOMETRY_POINT)
      const newGeometry = feature.getGeometry() as Point
      expect(newGeometry?.getType()).toEqual(GeometryType.POINT)
      expect((newGeometry as Point).getCoordinates()).toEqual([10, 20])
    })
    it('Keep the same geometry if it is a multi-point for a GEOMETRY_MULTIPOINT column', () => {
      const feature = new Feature<MultiPoint>(new MultiPoint([[10, 20], [30, 40]]))
      convertToValidGeometry(feature, COLUMN_TYPE.GEOMETRY_MULTIPOINT)
      const newGeometry = feature.getGeometry() as MultiPoint
      expect(newGeometry.getType()).toEqual(GeometryType.MULTI_POINT)
      expect(newGeometry.getCoordinates()).toEqual([[10, 20], [30, 40]])
    })
    it('Change the geometry if it is a point for a GEOMETRY_MULTIPOINT column', () => {
      const feature = new Feature<Point>(new Point([10, 20]))
      convertToValidGeometry(feature, COLUMN_TYPE.GEOMETRY_MULTIPOINT)
      const newGeometry = feature.getGeometry() as unknown as MultiPoint
      expect(newGeometry.getType()).toEqual(GeometryType.MULTI_POINT)
      expect(newGeometry.getCoordinates()).toEqual([[10, 20]])
    })
    it('Keep the same geometry if it is a multi-polygon for a GEOMETRY_MULTIPOLYGON column', () => {
      const feature = new Feature<MultiPolygon>(new MultiPolygon([[[[10, 20]], [[30, 40]]]]))
      convertToValidGeometry(feature, COLUMN_TYPE.GEOMETRY_MULTIPOLYGON)
      const newGeometry = feature.getGeometry() as MultiPolygon
      expect(newGeometry.getType()).toEqual(GeometryType.MULTI_POLYGON)
      expect(newGeometry.getCoordinates()).toEqual([[[[10, 20]], [[30, 40]]]])
    })
    it('Change the geometry if it is a polygon for a GEOMETRY_MULTIPOLYGON column', () => {
      const feature = new Feature<Polygon>(new Polygon([[[10, 20]], [[30, 40]]]))
      convertToValidGeometry(feature, COLUMN_TYPE.GEOMETRY_MULTIPOLYGON)
      const newGeometry = feature.getGeometry() as unknown as MultiPolygon
      expect(newGeometry.getType()).toEqual(GeometryType.MULTI_POLYGON)
      expect(newGeometry.getCoordinates()).toEqual([[[[10, 20]], [[30, 40]]]])
    })
    it('Keep the same geometry if it is a multi-linestring for a GEOMETRY_MULTILINESTRING column', () => {
      const feature = new Feature<MultiLineString>(new MultiLineString([[[10, 20], [30, 40]]]))
      convertToValidGeometry(feature, COLUMN_TYPE.GEOMETRY_MULTILINESTRING)
      const newGeometry = feature.getGeometry() as MultiLineString
      expect(newGeometry.getType()).toEqual(GeometryType.MULTI_LINE_STRING)
      expect(newGeometry.getCoordinates()).toEqual([[[10, 20], [30, 40]]])
    })
    it('Change the geometry if it is a linestring for a GEOMETRY_MULTILINESTRING column', () => {
      const feature = new Feature<LineString>(new LineString([[10, 20], [30, 40]]))
      convertToValidGeometry(feature, COLUMN_TYPE.GEOMETRY_MULTILINESTRING)
      const newGeometry = feature.getGeometry() as unknown as MultiLineString
      expect(newGeometry.getType()).toEqual(GeometryType.MULTI_LINE_STRING)
      expect(newGeometry.getCoordinates()).toEqual([[[10, 20], [30, 40]]])
    })
    it('Do not change anything if the feature has no geometry', () => {
      const feature = new Feature()
      convertToValidGeometry(feature, COLUMN_TYPE.GEOMETRY_POINT)
      expect(feature.getGeometry()).toBeUndefined()
    })
  })
  describe('getOnlyGeoColumns', () => {
    it('Returns all the geographic columns of the table view if no column id is specified in the map source settings', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
      }
      const geoColumns = getOnlyGeoColumns(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([geoPointColumn, geoPolygonColumn])
    })
    it('Returns an empty array if no column id is specified in the map source settings and there is no geographic column', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
      }
      const geoColumns = getOnlyGeoColumns([stringColumn], mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
    it('Returns an array containing one geographic column if a column id is specified in the map source settings', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: geoPointColumn.id,
      }
      const geoColumns = getOnlyGeoColumns(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([geoPointColumn])
    })
    it('Returns an empty array if the specified column id does not exist in the table view', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: 'e065323c-1151-447f-be0f-6d2728117b00',
      }
      const geoColumns = getOnlyGeoColumns(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
    it('Returns an empty array if the specified column id is not a geographic column', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: geoLineStringColumn.id,
      }
      const geoColumns = getOnlyGeoColumns(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
  })
  describe('makeGeoJsonFeaturesCollection', () => {
    const mapSourceSettings = {
      id: '263c21e6-5339-4748-903f-8c77e21314cf',
    }
    describe('with aggregation', () => {
      it('Throw an error if the aggregated column is unknown', () => {
        expect(() =>
          makeGeoJsonFeaturesCollection(
            [firstRow],
            geoColumns,
            allColumnsObject,
            {
              id: '263c21e6-5339-4748-903f-8c77e21314cf',
              aggregationField: 'unknown-field',
            },
            i18nOptions,
          ),
        ).toThrowError(TypeError)
      })
      it('Throw an error if the aggregated column is not a relation between tables column', () => {
        expect(() =>
          makeGeoJsonFeaturesCollection(
            [firstRow],
            geoColumns,
            allColumnsObject,
            {
              id: '263c21e6-5339-4748-903f-8c77e21314cf',
              aggregationField: stringColumn.id,
            },
            i18nOptions,
          ),
        ).toThrowError(TypeError)
      })
      it('Return an empty features array if there is no row', () => {
        const features = makeGeoJsonFeaturesCollection(
          [],
          geoColumns,
          allColumnsObject,
          {
            id: '263c21e6-5339-4748-903f-8c77e21314cf',
            aggregationField: relationBetweenTablesColumn.id,
          },
          i18nOptions,
        )
        expect(features.type).toBe('FeatureCollection')
        expect(features.features).toHaveLength(0)
      })
      it('Return an empty features array and an empty editable geometry types set if there is no geographic columns', () => {
        const features = makeGeoJsonFeaturesCollection(
          [firstRow],
          [],
          allColumnsObject,
          {
            id: '263c21e6-5339-4748-903f-8c77e21314cf',
            aggregationField: relationBetweenTablesColumn.id,
          },
          i18nOptions,
        )
        expect(features.type).toBe('FeatureCollection')
        expect(features.features).toHaveLength(0)
      })
      it('Return the aggregated features', () => {
        const features = makeGeoJsonFeaturesCollection(
          [
            firstRow, // Linked to foreign-row-1
            secondRow, // Linked to foreign-row-2
            thirdRow, // Linked to foreign-row-2
            emptyRow, // Must not be kept as there is no aggregation value
          ],
          [
            geoPointColumn, // Must not be used as it is not linked to the aggregation field
            geoPointLookedUpColumn, // Must be used as it is linked to the aggregation field
          ],
          allColumnsObject,
          {
            id: '263c21e6-5339-4748-903f-8c77e21314cf',
            aggregationField: relationBetweenTablesColumn.id,
          },
          i18nOptions,
        )
        expect(features.type).toBe('FeatureCollection')
        expect(features.features).toHaveLength(2)
        // Aggregation of the first row
        expect(features.features).toContainEqual({
          id: 'foreign-row-1:f065323c-1151-447f-be0f-6d2728117b34',
          geometry: {
            type: 'Point',
            coordinates: [1.4, 40],
          },
          properties: {
            columnId: 'f065323c-1151-447f-be0f-6d2728117b34',
            id: 'foreign-row-1:f065323c-1151-447f-be0f-6d2728117b34',
            point_count: 1,
            rowId: 'foreign-row-1',
          },
          type: 'Feature',
        })
        // Aggregation of the second and the third rows
        expect(features.features).toContainEqual({
          id: 'foreign-row-2:f065323c-1151-447f-be0f-6d2728117b34',
          geometry: {
            type: 'Point',
            coordinates: [1.5, 41],
          },
          properties: {
            columnId: 'f065323c-1151-447f-be0f-6d2728117b34',
            id: 'foreign-row-2:f065323c-1151-447f-be0f-6d2728117b34',
            point_count: 2,
            rowId: 'foreign-row-2',
          },
          type: 'Feature',
        })
      })
      it('If the popup is desired but no title has been configured, return the text of the aggregation row', () => {
        const features = makeGeoJsonFeaturesCollection(
          [firstRow],
          [geoPointLookedUpColumn],
          allColumnsObject,
          {
            id: geoTableView.id,
            popup: true,
            aggregationField: relationBetweenTablesColumn.id,
          },
          i18nOptions,
        )
        expect(features.features).toHaveLength(1)
        expect(features.features[0].properties?.title).toBe('foreign row 1')
      })
      it('If the popup title is configured to display the values of a column which is not linked to the aggregated field, throw an error', () => {
        expect(() =>
          makeGeoJsonFeaturesCollection(
            [firstRow],
            [geoPointLookedUpColumn],
            allColumnsObject,
            {
              id: geoTableView.id,
              popup: true,
              popupSettings: {
                title: stringColumn.id,
                contentFields: [],
              },
              aggregationField: relationBetweenTablesColumn.id,
            },
            i18nOptions,
          ),
        ).toThrowError(TypeError)
      })
      it('If the popup title is configured as an id of a column which is linked to the aggregated field, return the column value', () => {
        const features = makeGeoJsonFeaturesCollection(
          [firstRow],
          [geoPointLookedUpColumn],
          allColumnsObject,
          {
            id: geoTableView.id,
            popup: true,
            popupSettings: {
              title: booleanLookedUpColumn.id,
              contentFields: [],
            },
            aggregationField: relationBetweenTablesColumn.id,
          },
          i18nOptions,
        )
        expect(features.features).toHaveLength(1)
        expect(features.features[0].properties?.title).toBe(true)
      })
      it('If the popup content is configured with a valid column id, display the value of the corresponding field with the specified css class', () => {
        const features = makeGeoJsonFeaturesCollection(
          [firstRow],
          [geoPointLookedUpColumn],
          allColumnsObject,
          {
            id: geoTableView.id,
            popup: true,
            popupSettings: {
              contentFields: [
                {
                  field: booleanLookedUpColumn.id,
                  class: 'my-custom-css-class',
                },
              ],
            },
            aggregationField: relationBetweenTablesColumn.id,
          },
          i18nOptions,
        )
        expect(features.features).toHaveLength(1)
        expect(features.features[0].properties?.content).toHaveLength(1)
        expect(features.features[0].properties?.content[0]).toMatchObject({
          field: {
            label: 'Boolean LUC',
            value: true,
          },
          class: 'my-custom-css-class',
        })
      })
      it('If the popup content is configured with a valid column id, display the value of the corresponding field with the specified css class', () => {
        expect(() =>
          makeGeoJsonFeaturesCollection(
            [firstRow],
            [geoPointLookedUpColumn],
            allColumnsObject,
            {
              id: geoTableView.id,
              popup: true,
              popupSettings: {
                contentFields: [
                  {
                    field: stringColumn.id,
                    class: 'my-custom-css-class',
                  },
                ],
              },
              aggregationField: relationBetweenTablesColumn.id,
            },
            i18nOptions,
          ),
        ).toThrowError(TypeError)
      })
      it('If some columns which are linked to the aggregation field are used to define the style source, add the related values', () => {
        const features = makeGeoJsonFeaturesCollection(
          [firstRow, secondRow, thirdRow],
          [geoPointLookedUpColumn],
          allColumnsObject,
          {
            id: geoTableView.id,
            aggregationField: relationBetweenTablesColumn.id,
          },
          i18nOptions,
          [booleanLookedUpColumn.id],
        )
        expect(features.features).toHaveLength(2)
        expect(features.features[0].properties?.[booleanLookedUpColumn.id]).toBe(true)
        expect(features.features[1].properties?.[booleanLookedUpColumn.id]).toBe(false)
      })
      it('If some columns which are not linked to the aggregation field are used to define the style source, throw an error', () => {
        expect(() =>
          makeGeoJsonFeaturesCollection(
            [firstRow, secondRow, thirdRow],
            [geoPointLookedUpColumn],
            allColumnsObject,
            {
              id: geoTableView.id,
              aggregationField: relationBetweenTablesColumn.id,
            },
            i18nOptions,
            [booleanLookedUpColumn.id, stringColumn.id],
          ),
        ).toThrowError(TypeError)
      })
    })
    it('Returns an empty features array if there is no row', () => {
      const features = makeGeoJsonFeaturesCollection(
        [],
        geoColumns,
        allColumnsObject,
        mapSourceSettings,
        i18nOptions,
      )
      expect(features.type).toBe('FeatureCollection')
      expect(features.features).toHaveLength(0)
    })
    it('Returns an empty features array if there is no geographic columns', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow],
        [],
        allColumnsObject,
        mapSourceSettings,
        i18nOptions,
      )
      expect(features.features).toHaveLength(0)
    })
    it('Do not add a feature if the row data is empty', () => {
      const features = makeGeoJsonFeaturesCollection(
        [emptyRow],
        geoColumns,
        allColumnsObject,
        mapSourceSettings,
        i18nOptions,
      )
      expect(features.features).toHaveLength(0)
    })
    it('If the sources are specified, add the id, columnId and rowId properties to each feature', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumnsObject,
        mapSourceSettings,
        i18nOptions,
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties).toMatchObject({
        rowId: firstRow.id,
        columnId: geoPointColumn.id,
        id: `${firstRow.id}:${geoPointColumn.id}`,
      })
      expect(features.features[1].properties).toMatchObject({
        rowId: firstRow.id,
        columnId: geoPolygonColumn.id,
        id: `${firstRow.id}:${geoPolygonColumn.id}`,
      })
    })
    it('If the pageDetailId option is configured, add a title property to each feature', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow, secondRow],
        geoColumns,
        allColumnsObject,
        {
          id: geoTableView.id,
          popup: true,
          popupSettings: {
            pageDetailId,
          },
        },
        i18nOptions,
      )
      expect(features.features).toHaveLength(4)
      // The first row has a reference -> we use it
      expect(features.features[0].properties?.title).toBe(firstRow.text)
      // The second row has an empty reference -> we display the default message
      expect(features.features[3].properties?.title).toBe(i18nOptions.noReference)
    })
    it('If the popup title is configured as a column id, display the value of the corresponding field', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumnsObject,
        {
          id: geoTableView.id,
          popup: true,
          popupSettings: {
            title: stringColumn.id,
            contentFields: [],
          },
        },
        i18nOptions,
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.title).toBe(firstRow.data[stringColumn.id])
    })
    it('If the popup content is configured with a valid column id, display the value of the corresponding field with the specified css class', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumnsObject,
        {
          id: geoTableView.id,
          popup: true,
          popupSettings: {
            contentFields: [
              {
                field: stringColumn.id,
                class: 'my-custom-css-class',
              },
            ],
          },
        },
        i18nOptions,
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.content).toHaveLength(1)
      expect(features.features[0].properties?.content[0]).toMatchObject({
        field: {
          label: stringColumn.text,
          value: firstRow.data[stringColumn.id],
        },
        class: 'my-custom-css-class',
      })
    })
    it('If the popup content is configured with an invalid column id, just pass this step', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumnsObject,
        {
          id: geoTableView.id,
          popup: true,
          popupSettings: {
            title: '',
            contentFields: [
              {
                field: 'invalid-column-id',
                class: 'my-custom-css-class',
              },
            ],
          },
        },
        i18nOptions,
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.content).toHaveLength(0)
    })
    it('If some columns are used to define the style source, add the related values', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow, secondRow],
        [geoPointColumn],
        allColumnsObject,
        {
          id: geoTableView.id,
          popup: false,
        },
        i18nOptions,
        [
          stringColumn.id,
        ],
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.[stringColumn.id]).toBe(firstRow.data[stringColumn.id])
      expect(features.features[1].properties?.[stringColumn.id]).toBe(secondRow.data[stringColumn.id])
    })
    it('If some LUC columns are used to define the style source, add the related values', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow, secondRow],
        [geoPointColumn],
        allColumnsObject,
        {
          id: geoTableView.id,
          popup: false,
        },
        i18nOptions,
        [
          booleanLookedUpColumn.id,
        ],
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.[booleanLookedUpColumn.id]).toBe((firstRow.data[booleanLookedUpColumn.id] as LckTableRowDataComplex).value)
      expect(features.features[1].properties?.[booleanLookedUpColumn.id]).toBe((secondRow.data[booleanLookedUpColumn.id] as LckTableRowDataComplex).value)
    })
  })
  describe('getEditableGeometryTypes', () => {
    it('Return the OL geometry types related to the geographic editable columns', () => {
      const editableGeometryTypes = getEditableGeometryTypes(allColumns)
      expect(editableGeometryTypes.size).toBe(1)
      expect(editableGeometryTypes.has(COLUMN_TYPE.GEOMETRY_POLYGON))
    })
  })
  describe('getLckGeoResources', () => {
    it('Returns an empty array if there is no source', () => {
      expect(
        getLckGeoResources(
          { [geoTableView.id]: geoTableView },
          { [geoTableView.id]: rows },
          {
            sources: [],
          },
          i18nOptions,
        ),
      ).toEqual([])
    })
    it('Return an empty array if the table view has no column', () => {
      expect(
        getLckGeoResources(
          { [emptyTableView.id]: emptyTableView },
          { [emptyTableView.id]: [] },
          {
            sources: [],
          },
          i18nOptions,
        ),
      ).toEqual([])
    })
    it('Return an empty array if the table view has no geographic column', () => {
      expect(
        getLckGeoResources(
          { [stringTableView.id]: stringTableView },
          { [stringTableView.id]: [] },
          {
            sources: [],
          },
          i18nOptions,
        ),
      ).toEqual([])
    })
    it('Return an empty array if the table view id specified in the map settings is invalid', () => {
      expect(
        getLckGeoResources(
          { [stringTableView.id]: stringTableView },
          { [stringTableView.id]: [] },
          {
            sources: [{
              id: 'invalid-tableview-id',
            }],
          },
          i18nOptions,
        ),
      ).toEqual([])
    })
    it('Return the valid resources if only the table view id is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: rows },
        {
          sources: [{
            id: geoTableView.id,
          }],
        },
        i18nOptions,
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].id).toBe('features-collection-source-0')
      expect(resources[0].type).toBe('FeatureCollection')
      expect(resources[0].features).toHaveLength(4)
      expect(resources[0].popupMode).toBeNull()
      expect(resources[0].pageDetailId).toBeFalsy()
      expect(resources[0].editableGeometryTypes.size).toBe(1)
      expect(resources[0].editableGeometryTypes.has(COLUMN_TYPE.GEOMETRY_POLYGON)).toBe(true)
      expect(resources[0].selectable).toBe(false)
      expect(resources[0].layers).toContainEqual(expect.objectContaining({
        ...GEO_STYLE.Point,
        id: `features-collection-source-0-${GEO_STYLE.Point.id}-${COLUMN_TYPE.GEOMETRY_POINT}`,
      }))
      expect(resources[0].layers).toContainEqual(expect.objectContaining({
        ...GEO_STYLE.Polygon,
        id: `features-collection-source-0-${GEO_STYLE.Polygon.id}-${COLUMN_TYPE.GEOMETRY_POLYGON}`,
      }))
    })
    it('Returns that the resource is selectable if it is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: [] },
        {
          sources: [{
            id: geoTableView.id,
            selectable: true,
          }],
        },
        i18nOptions,
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].selectable).toBe(true)
    })
    it('Returns that the pop up can be displayed for the resource if it is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: [] },
        {
          sources: [{
            id: geoTableView.id,
            popup: true,
          }],
        },
        i18nOptions,
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].popupMode).toBe('click')
    })
    it('Returns that the pop up can be displayed for the resource on hover if it is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: [] },
        {
          sources: [{
            id: geoTableView.id,
            popup: true,
            popupSettings: {
              onHover: true,
            },
          }],
        },
        i18nOptions,
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].popupMode).toBe('hover')
    })
    it('Returns the page detail id for the resource if it is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: [] },
        {
          sources: [{
            id: geoTableView.id,
            popup: true,
            popupSettings: {
              pageDetailId,
            },
          }],
        },
        i18nOptions,
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].pageDetailId).toBe(pageDetailId)
    })
    it('Returns the correct style based on the specified default one', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: [] },
        {
          sources: [{
            id: geoTableView.id,
            style: {
              default: {
                stroke: {
                  color: '#000',
                  width: 10,
                },
                fill: {
                  color: '#FFF',
                  width: 2,
                },
              },
            },
          }],
        },
        i18nOptions,
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].layers[0]).toEqual({
        ...GEO_STYLE.Point,
        id: `features-collection-source-0-${GEO_STYLE.Point.id}-${COLUMN_TYPE.GEOMETRY_POINT}`,
        paint: {
          'circle-color': '#FFF',
          'circle-stroke-color': '#000',
          'circle-stroke-width': 10,
          'circle-radius': 2,
          'circle-opacity': mapDefaultStyle.opacity,
        },
        layout: {},
      })
    })
  })
  describe('getStyleLayers', () => {
    describe('Geometry point', () => {
      it('Return the correct default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}-${COLUMN_TYPE.GEOMETRY_POINT}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': mapDefaultStyle.fill.color,
            'circle-stroke-color': mapDefaultStyle.stroke.color,
            'circle-stroke-width': mapDefaultStyle.stroke.width,
            'circle-radius': mapDefaultStyle.fill.width,
          },
          layout: {},
        })
      })
      it('Return the specified default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            default: {
              fill: {
                color: '#000',
                width: 2,
              },
              stroke: {
                color: '#111',
                width: 10,
              },
              paint: {
                'circle-blur': 1,
                'circle-radius': 3,
              },
              layout: {
                visibility: 'none',
              },
            },
          },
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}-${COLUMN_TYPE.GEOMETRY_POINT}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': '#000',
            'circle-stroke-color': '#111',
            'circle-stroke-width': 10,
            'circle-radius': 3,
            'circle-blur': 1,
          },
          layout: {
            visibility: 'none',
          },
        })
      })
      it('Return the specified default style with markers', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            default: {
              icon: 'myUrlIcon',
              fill: {
                color: '#000',
                width: 2,
              },
              stroke: {
                color: '#111',
                width: 10,
              },
              paint: {
                'text-halo-width': 1,
                'text-halo-color': '#fff',
              },
            },
          },
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Marker,
          id: `myResourceId-${GEO_STYLE.Marker.id}-${COLUMN_TYPE.GEOMETRY_POINT}`,
          paint: {
            'icon-opacity': mapDefaultStyle.opacity,
            'icon-color': '#000',
            'text-halo-width': 1,
            'text-halo-color': '#fff',
          },
          layout: {
            'icon-image': 'myUrlIcon',
            'icon-size': 2,
            'icon-allow-overlap': true,
            'text-font': [
              'Open Sans Regular',
            ],
          },
          imagesToLoad: new Set(['myUrlIcon']),
        })
      })
      it('Return the style based on explicit style settings with one field', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            fields: [booleanColumn.id],
            dataDriven: [
              {
                values: [
                  {
                    value: false,
                    field: booleanColumn.id,
                  },
                ],
                style: {
                  stroke: {
                    color: '#111',
                    width: 5,
                  },
                },
              },
              {
                values: [
                  {
                    value: true,
                    field: booleanColumn.id,
                  },
                ],
                style: {
                  fill: {
                    color: '#222',
                    width: 3,
                  },
                },
              },
            ],
          },
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}-${COLUMN_TYPE.GEOMETRY_POINT}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': [
              'case',
              ['all', ['==', ['get', booleanColumn.id], true]],
              '#222',
              mapDefaultStyle.fill.color,
            ],
            'circle-radius': [
              'case',
              ['all', ['==', ['get', booleanColumn.id], true]],

              3,
              mapDefaultStyle.fill.width,
            ],
            'circle-stroke-color': [
              'case',
              ['all', ['==', ['get', booleanColumn.id], false]],
              '#111',
              mapDefaultStyle.stroke.color,
            ],
            'circle-stroke-width': [
              'case',
              ['all', ['==', ['get', booleanColumn.id], false]],
              5,
              mapDefaultStyle.stroke.width,
            ],
          },
          layout: {},
        })
      })
      it('Return the style based on explicit style settings with several fields', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            fields: [booleanColumn.id, singleSelectColumn.id],
            dataDriven: [
              {
                values: [
                  {
                    value: false,
                    field: booleanColumn.id,
                  },
                  {
                    value: '1',
                    field: singleSelectColumn.id,
                  },
                ],
                style: {
                  stroke: {
                    color: '#111',
                    width: 5,
                  },
                },
              },
              {
                values: [
                  {
                    value: true,
                    field: booleanColumn.id,
                  },
                ],
                style: {
                  fill: {
                    color: '#222',
                    width: 3,
                  },
                },
              },
            ],
          },
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}-${COLUMN_TYPE.GEOMETRY_POINT}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': [
              'case',
              ['all', ['==', ['get', booleanColumn.id], true]],
              '#222',
              mapDefaultStyle.fill.color,
            ],
            'circle-radius': [
              'case',
              ['all', ['==', ['get', booleanColumn.id], true]],

              3,
              mapDefaultStyle.fill.width,
            ],
            'circle-stroke-color': [
              'case',
              [
                'all',
                ['==', ['get', booleanColumn.id], false],
                ['==', ['get', singleSelectColumn.id], '1'],
              ],
              '#111',
              mapDefaultStyle.stroke.color,
            ],
            'circle-stroke-width': [
              'case',
              [
                'all',
                ['==', ['get', booleanColumn.id], false],
                ['==', ['get', singleSelectColumn.id], '1'],
              ],
              5,
              mapDefaultStyle.stroke.width,
            ],
          },
          layout: {},
        })
      })
      it('Return the style based on explicit style settings with markers', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            fields: [booleanColumn.id],
            dataDriven: [
              {
                values: [
                  {
                    value: false,
                    field: booleanColumn.id,
                  },
                ],
                style: {
                  icon: 'myNewIconUrl1',
                },
              },
              {
                values: [
                  {
                    value: true,
                    field: booleanColumn.id,
                  },
                ],
                style: {
                  icon: 'myNewIconUrl2',
                },
              },
            ],
          },
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toStrictEqual({
          ...GEO_STYLE.Marker,
          id: `myResourceId-${GEO_STYLE.Marker.id}-${COLUMN_TYPE.GEOMETRY_POINT}`,
          paint: {
            'icon-opacity': mapDefaultStyle.opacity,
            'icon-color': mapDefaultStyle.fill.color,
          },
          layout: {
            'icon-size': mapDefaultStyle.icon.size,
            'icon-image': [
              'case',
              ['all', ['==', ['get', booleanColumn.id], false]],
              'myNewIconUrl1',
              ['all', ['==', ['get', booleanColumn.id], true]],
              'myNewIconUrl2',
              mapDefaultStyle.icon.url,
            ],
            'icon-allow-overlap': true,
            'text-font': [
              'Open Sans Regular',
            ],
          },
          imagesToLoad: new Set([
            mapDefaultStyle.icon.url,
            'myNewIconUrl1',
            'myNewIconUrl2',
          ]),
        })
      })
    })
    describe('Geometry polygon', () => {
      it('Return the correct default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPolygonColumn],
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Polygon,
          id: `myResourceId-${GEO_STYLE.Polygon.id}-${COLUMN_TYPE.GEOMETRY_POLYGON}`,
          paint: {
            'fill-opacity': mapDefaultStyle.opacity,
            'fill-color': mapDefaultStyle.fill.color,
            'fill-outline-color': mapDefaultStyle.stroke.color,
          },
          layout: {},
        })
      })
      it('Return the specified default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPolygonColumn],
          {
            default: {
              fill: {
                color: '#000',
              },
              stroke: {
                color: '#111',
                width: 10,
              },
            },
          },
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Polygon,
          id: `myResourceId-${GEO_STYLE.Polygon.id}-${COLUMN_TYPE.GEOMETRY_POLYGON}`,
          paint: {
            'fill-opacity': mapDefaultStyle.opacity,
            'fill-color': '#000',
            'fill-outline-color': '#111',
          },
          layout: {},
        })
      })
    })
    describe('Geometry linestring', () => {
      it('Return the correct default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoLineStringColumn],
          {
            default: {},
          },
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Linestring,
          id: `myResourceId-${GEO_STYLE.Linestring.id}-${COLUMN_TYPE.GEOMETRY_LINESTRING}`,
          paint: {
            'line-opacity': mapDefaultStyle.opacity,
            'line-color': mapDefaultStyle.fill.color,
            'line-width': mapDefaultStyle.fill.width,
          },
          layout: {},
        })
      })
      it('Return the specified default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoLineStringColumn],
          {
            default: {
              fill: {
                color: '#000',
                width: 10,
              },
              stroke: {
                color: '#111',
              },
            },
          },
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Linestring,
          id: `myResourceId-${GEO_STYLE.Linestring.id}-${COLUMN_TYPE.GEOMETRY_LINESTRING}`,
          paint: {
            'line-opacity': mapDefaultStyle.opacity,
            'line-color': '#000',
            'line-width': 10,
          },
          layout: {},
        })
      })
    })
  })
})
