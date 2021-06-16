/* eslint-disable @typescript-eslint/camelcase */
import { BLOCK_TYPE, COLUMN_TYPE, GEOMETRY_TYPE, MapSourceSettings } from '@locokit/lck-glossary'
import { GeoJSONFeature } from 'ol/format/GeoJSON'
import GeometryType from 'ol/geom/GeometryType'

import { LckTableRow, LckTableView, LckTableViewColumn, SORT_COLUMN } from '@/services/lck-api/definitions'

import { geometryTypeFromColumnType, GEO_STYLE, getLckGeoResources, getOnlyGeoColumn, isGeoBlock, LckPopupI18nOptions, makeGeoJsonFeaturesCollection, transformFeatureToWKT } from './transformWithOL'

// Visualization part
// Page
const pageDetailId = '333c21e6-5339-4748-903f-8c77e21314aa'

// Database part
// Table view
const geoTableView: LckTableView = {
  id: '263c21e6-5339-4748-903f-8c77e21314cf',
  text: 'Table view with geographic data',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
}

const stringTableView: LckTableView = {
  id: '363c21e6-5339-4748-903f-8c77e21314cg',
  text: 'Table view without geographic data',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
}

const emptyTableView: LckTableView = {
  id: '463c21e6-5339-4748-903f-8c77e21314ch',
  text: 'Table view without any data',
  table_id: '163c21e6-5339-4748-903f-8c77e21314cf'
}

// Table columns
const stringColumn: LckTableViewColumn = {
  text: 'Nom',
  id: 'e065323c-1151-447f-be0f-6d2728117b38',
  settings: {},
  table_id: geoTableView.table_id,
  column_type_id: COLUMN_TYPE.STRING,
  editable: false,
  position: 0,
  transmitted: false,
  default: '',
  displayed: true,
  required: false,
  sort: 'DESC' as SORT_COLUMN,
  table_column_id: '',
  table_view_id: geoTableView.id,
  style: {}
}

const geoPointColumn: LckTableViewColumn = {
  text: 'Point',
  id: 'e065323c-1151-447f-be0f-6d2728117b40',
  settings: {},
  table_id: geoTableView.table_id,
  column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
  editable: false,
  position: 2,
  transmitted: false,
  default: '',
  displayed: true,
  required: false,
  sort: 'DESC' as SORT_COLUMN,
  table_column_id: '',
  table_view_id: geoTableView.id,
  style: {}
}

const geoPolygonColumn: LckTableViewColumn = {
  text: 'Zone géographique',
  id: 'e065323c-1151-447f-be0f-6d2728117b39',
  settings: {},
  table_id: geoTableView.table_id,
  column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
  editable: false,
  position: 1,
  transmitted: false,
  default: '',
  displayed: true,
  required: false,
  sort: 'DESC' as SORT_COLUMN,
  table_column_id: '',
  table_view_id: geoTableView.id,
  style: {}
}

const geoColumns: LckTableViewColumn[] = [
  geoPointColumn,
  geoPolygonColumn
]

const allColumns: LckTableViewColumn[] = [
  stringColumn,
  geoPointColumn,
  geoPolygonColumn
]

geoTableView.columns = allColumns
stringTableView.columns = [stringColumn]

// Table rows
const firstRow: LckTableRow = {
  text: 'First row',
  data: {
    'e065323c-1151-447f-be0f-6d2728117b38': 'first',
    'e065323c-1151-447f-be0f-6d2728117b39': 'SRID=4326;POLYGON((1.4 45.75,2 45.6,1.9 45.3,1.4 45.75))',
    'e065323c-1151-447f-be0f-6d2728117b40': 'SRID=4326;POINT(1.4 45)'
  },
  id: '38ed19db-588d-4ca1-8ab3-c8b17d60db2d'
}
const secondRow: LckTableRow = {
  text: '',
  data: {
    'e065323c-1151-447f-be0f-6d2728117b38': 'second',
    'e065323c-1151-447f-be0f-6d2728117b39': 'SRID=4326;POLYGON((1.5 46.75,2.1 46.6,2.0 46.3,1.5 46.75))',
    'e065323c-1151-447f-be0f-6d2728117b40': 'SRID=4326;POINT(1.5 46)'
  },
  id: '38ed19db-588d-4ca1-8ab3-c8b17d60db3d'
}
const emptyRow: LckTableRow = {
  text: '',
  data: {},
  id: '38ed19db-588d-4ca1-8ab3-c8b17d60db4d'
}

const rows: LckTableRow[] = [
  firstRow,
  secondRow,
  emptyRow
]

// Others
const i18nOptions: LckPopupI18nOptions = {
  dateFormat: 'yyyy-mm-dd',
  noData: 'No data',
  noReference: 'No reference'
}

const defaultMapSourceSettings: MapSourceSettings = {
  id: '',
  editable: false,
  selectable: false,
  field: '',
  geometry: GEOMETRY_TYPE.POINT,
  pageDetailId: '',
  popup: false,
  popupSettings: {
    contentFields: [],
    title: ''
  }
}

describe('Transformations with OpenLayers', () => {
  describe('transformFeatureToWKT', () => {
    it('returns the eWKT value related to a single GeoJSON feature', () => {
      const geoJSONFeature: GeoJSONFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [10, 20]
        },
        properties: {}
      }
      expect(transformFeatureToWKT(geoJSONFeature))
        .toBe('SRID=4326;POINT(10 20)')
    })
    it('returns the eWKT value related to a single GeoJSON feature with the specified srid', () => {
      const geoJSONFeature: GeoJSONFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [10, 20]
        },
        properties: {}
      }
      expect(transformFeatureToWKT(geoJSONFeature, '3857'))
        .toMatch(/^SRID=3857;POINT\(1113194.9[0-9]* 2273030.9[0-9]*\)$/) // Regex to take into account the roundings
    })
    it('returns the eWKT value related to a GeoJSON features collection', () => {
      const geoJSONFeature: GeoJSONFeature = {
        type: 'Feature',
        geometry: {
          type: 'GeometryCollection',
          geometries: [
            {
              coordinates: [10, 20],
              type: 'Point'
            },
            {
              coordinates: [30, 40],
              type: 'Point'
            }
          ]
        },
        properties: {}
      }
      expect(transformFeatureToWKT(geoJSONFeature))
        .toBe('SRID=4326;GEOMETRYCOLLECTION(POINT(10 20),POINT(30 40))')
    })
  })

  describe('isGeoBlock', () => {
    it('Returns true if the current block type is a map view', () => {
      expect(isGeoBlock(BLOCK_TYPE.MAPVIEW)).toBe(true)
    })
    it('Returns true if the current block type is a map detail view', () => {
      expect(isGeoBlock(BLOCK_TYPE.MAPDETAILVIEW)).toBe(true)
    })
    it('Returns false if the current block type is a table view', () => {
      expect(isGeoBlock(BLOCK_TYPE.TABLE_VIEW)).toBe(false)
    })
  })

  describe('geometryTypeFromColumnType', () => {
    it('Returns the geometry type point for a geometry point column', () => {
      expect(geometryTypeFromColumnType(COLUMN_TYPE.GEOMETRY_POINT))
        .toBe(GeometryType.POINT)
    })
    it('Returns the geometry type linestring for a geometry linestring column', () => {
      expect(geometryTypeFromColumnType(COLUMN_TYPE.GEOMETRY_LINESTRING))
        .toBe(GeometryType.LINE_STRING)
    })
    it('Returns the geometry type polygon for a geometry polygon column', () => {
      expect(geometryTypeFromColumnType(COLUMN_TYPE.GEOMETRY_POLYGON))
        .toBe(GeometryType.POLYGON)
    })
    it('Returns null for a non geometry column', () => {
      expect(geometryTypeFromColumnType(COLUMN_TYPE.STRING))
        .toBeNull()
    })
  })

  describe('getOnlyGeoColumn', () => {
    it('Returns all the geographic columns of the table view if no column id is specified in the map source settings', () => {
      const mapSourceSettings = {
        ...defaultMapSourceSettings,
        id: '263c21e6-5339-4748-903f-8c77e21314cf'
      }
      const geoColumns = getOnlyGeoColumn(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([geoPointColumn, geoPolygonColumn])
    })
    it('Returns an empty array if no column id is specified in the map source settings and there is no geographic column', () => {
      const mapSourceSettings = {
        ...defaultMapSourceSettings,
        id: '263c21e6-5339-4748-903f-8c77e21314cf'
      }
      const geoColumns = getOnlyGeoColumn([stringColumn], mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
    it('Returns an array containing one geographic column if a column id is specified in the map source settings', () => {
      const mapSourceSettings = {
        ...defaultMapSourceSettings,
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: 'e065323c-1151-447f-be0f-6d2728117b40'
      }
      const geoColumns = getOnlyGeoColumn(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([geoPointColumn])
    })
    it('Returns an empty array if the specified column id does not exist in the table view', () => {
      const mapSourceSettings = {
        ...defaultMapSourceSettings,
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: 'e065323c-1151-447f-be0f-6d2728117b00'
      }
      const geoColumns = getOnlyGeoColumn(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
    it('Returns an empty array if the specified column id is not a geographic column', () => {
      const mapSourceSettings = {
        ...defaultMapSourceSettings,
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: 'e065323c-1151-447f-be0f-6d2728117b38'
      }
      const geoColumns = getOnlyGeoColumn(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
  })
  describe('makeGeoJsonFeaturesCollection', () => {
    const mapSourceSettings = {
      ...defaultMapSourceSettings,
      id: '263c21e6-5339-4748-903f-8c77e21314cf'
    }
    it('Returns an empty features array and an empty editable geometry types set if there is no row', () => {
      const { features, editableGeometryTypes } = makeGeoJsonFeaturesCollection(
        [],
        geoColumns,
        allColumns,
        [mapSourceSettings],
        i18nOptions
      )
      expect(features.type).toBe('FeatureCollection')
      expect(features.features).toHaveLength(0)
      expect(editableGeometryTypes.size).toBe(0)
    })
    it('Returns an empty features array and an empty editable geometry types set if there is no geographic columns', () => {
      const { features, editableGeometryTypes } = makeGeoJsonFeaturesCollection(
        [],
        geoColumns,
        allColumns,
        [mapSourceSettings],
        i18nOptions
      )
      expect(features.features).toHaveLength(0)
      expect(editableGeometryTypes.size).toBe(0)
    })
    it('Do not add a feature if the row data is empty', () => {
      const { features, editableGeometryTypes } = makeGeoJsonFeaturesCollection(
        [emptyRow],
        geoColumns,
        allColumns,
        [mapSourceSettings],
        i18nOptions
      )
      expect(features.features).toHaveLength(0)
      expect(editableGeometryTypes.size).toBe(0)
    })
    it('Returns the corresponding features and an empty editable geometry types set if there is no source', () => {
      const { features, editableGeometryTypes } = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumns,
        [],
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0]).toMatchObject({
        geometry: {
          coordinates: [1.4, 45],
          type: 'Point'
        },
        properties: null,
        type: 'Feature'
      })
      expect(features.features[1]).toMatchObject({
        geometry: {
          coordinates: [[[1.4, 45.75], [2, 45.6], [1.9, 45.3], [1.4, 45.75]]],
          type: 'Polygon'
        },
        properties: null,
        type: 'Feature'
      })
      expect(editableGeometryTypes.size).toBe(0)
    })
    it('Returns the corresponding features and an empty editable geometry types set if the source is undefined', () => {
      const { features, editableGeometryTypes } = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumns,
        undefined as unknown as [],
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0]).toMatchObject({
        geometry: {
          coordinates: [1.4, 45],
          type: 'Point'
        },
        properties: null,
        type: 'Feature'
      })
      expect(features.features[1]).toMatchObject({
        geometry: {
          coordinates: [[[1.4, 45.75], [2, 45.6], [1.9, 45.3], [1.4, 45.75]]],
          type: 'Polygon'
        },
        properties: null,
        type: 'Feature'
      })
      expect(editableGeometryTypes.size).toBe(0)
    })
    it('If the sources are specified, add the id, columnId and rowId properties to each feature', () => {
      const { features, editableGeometryTypes } = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumns,
        [mapSourceSettings],
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties).toMatchObject({
        rowId: firstRow.id,
        columnId: geoPointColumn.id,
        id: `${firstRow.id}:${geoPointColumn.id}`
      })
      expect(features.features[1].properties).toMatchObject({
        rowId: firstRow.id,
        columnId: geoPolygonColumn.id,
        id: `${firstRow.id}:${geoPolygonColumn.id}`
      })
      expect(editableGeometryTypes.size).toBe(0)
    })
    it('If the pageDetailId option is configured, add a title property to each feature', () => {
      const { features } = makeGeoJsonFeaturesCollection(
        [firstRow, secondRow],
        geoColumns,
        allColumns,
        [{
          ...defaultMapSourceSettings,
          id: geoTableView.id,
          pageDetailId
        }],
        i18nOptions
      )
      expect(features.features).toHaveLength(4)
      // The first row has a reference -> we use it
      expect(features.features[0].properties?.title).toBe(firstRow.text)
      // The second row has an empty reference -> we display the default message
      expect(features.features[3].properties?.title).toBe(i18nOptions.noReference)
    })
    it('If the popup title is configured as a column id, display the value of the corresponding field', () => {
      const { features } = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumns,
        [{
          ...defaultMapSourceSettings,
          id: geoTableView.id,
          popup: true,
          popupSettings: {
            title: stringColumn.id,
            contentFields: []
          }
        }],
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.title).toBe(firstRow.data[stringColumn.id])
    })
    it('If the popup title is configured and is not a column id, display its value', () => {
      const { features } = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumns,
        [{
          ...defaultMapSourceSettings,
          id: geoTableView.id,
          popup: true,
          popupSettings: {
            title: 'My popup title',
            contentFields: []
          }
        }],
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.title).toBe('My popup title')
    })
    it('If the popup content is configured with a valid column id, display the value of the corresponding field with the specified css class', () => {
      const { features } = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumns,
        [{
          ...defaultMapSourceSettings,
          id: geoTableView.id,
          popup: true,
          popupSettings: {
            title: '',
            contentFields: [
              {
                field: stringColumn.id,
                class: 'my-custom-css-class'
              }
            ]
          }
        }],
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.title).toBe('')
      expect(features.features[0].properties?.content).toHaveLength(1)
      expect(features.features[0].properties?.content[0]).toMatchObject({
        field: {
          label: stringColumn.text,
          value: firstRow.data[stringColumn.id]
        },
        class: 'my-custom-css-class'
      })
    })
    it('If the popup content is configured with an invalid column id, just pass this step', () => {
      const { features } = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumns,
        [{
          ...defaultMapSourceSettings,
          id: geoTableView.id,
          popup: true,
          popupSettings: {
            title: '',
            contentFields: [
              {
                field: 'invalid-column-id',
                class: 'my-custom-css-class'
              }
            ]
          }
        }],
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.content).toHaveLength(0)
    })
    it('If source is editable, add the geometry type to the returned set', () => {
      const { editableGeometryTypes } = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumns,
        [{
          ...defaultMapSourceSettings,
          id: geoTableView.id,
          editable: true
        }],
        i18nOptions
      )
      expect(editableGeometryTypes.size).toBe(2)
      expect(editableGeometryTypes.has(GeometryType.POINT)).toBe(true)
      expect(editableGeometryTypes.has(GeometryType.POLYGON)).toBe(true)
    })
  })
  describe('getLckGeoResources', () => {
    it('Returns an empty array if there is no source', () => {
      expect(
        getLckGeoResources(
          { [geoTableView.id]: geoTableView },
          { [geoTableView.id]: rows },
          {
            sources: []
          },
          i18nOptions
        )
      ).toEqual([])
    })
    it('Return an empty array if the table view has no column', () => {
      expect(
        getLckGeoResources(
          { [emptyTableView.id]: emptyTableView },
          { [emptyTableView.id]: [] },
          {
            sources: []
          },
          i18nOptions
        )
      ).toEqual([])
    })
    it('Return an empty array if the table view has no geographic column', () => {
      expect(
        getLckGeoResources(
          { [stringTableView.id]: stringTableView },
          { [stringTableView.id]: [] },
          {
            sources: []
          },
          i18nOptions
        )
      ).toEqual([])
    })
    it('Return an empty array if the table view id specified in the map settings is invalid', () => {
      expect(
        getLckGeoResources(
          { [stringTableView.id]: stringTableView },
          { [stringTableView.id]: [] },
          {
            sources: [{
              ...defaultMapSourceSettings,
              id: 'invalid-tableview-id'
            }]
          },
          i18nOptions
        )
      ).toEqual([])
    })
    it('Return the valid resources if only the table view id is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: rows },
        {
          sources: [{
            ...defaultMapSourceSettings,
            id: geoTableView.id
          }]
        },
        i18nOptions
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].id).toBe('features-collection-source-0')
      expect(resources[0].type).toBe('FeatureCollection')
      expect(resources[0].features).toHaveLength(4)
      expect(resources[0].displayPopup).toBe(false)
      expect(resources[0].pageDetailId).toBeFalsy()
      expect(resources[0].editableGeometryTypes.size).toBe(0)
      expect(resources[0].selectable).toBe(false)
      expect(resources[0].layers).toContainEqual({
        ...GEO_STYLE.Point,
        id: `features-collection-source-0-${GEO_STYLE.Point.id}`
      })
      expect(resources[0].layers).toContainEqual({
        ...GEO_STYLE.Polygon,
        id: `features-collection-source-0-${GEO_STYLE.Polygon.id}`
      })
    })
    it('Returns that the resource is selectable if it is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: [] },
        {
          sources: [{
            ...defaultMapSourceSettings,
            id: geoTableView.id,
            selectable: true
          }]
        },
        i18nOptions
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].selectable).toBe(true)
    })
    it('Returns that the pop up can be displayed for the resource if the page detail id is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: [] },
        {
          sources: [{
            ...defaultMapSourceSettings,
            id: geoTableView.id,
            pageDetailId
          }]
        },
        i18nOptions
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].displayPopup).toBe(true)
    })
    it('Returns that the pop up can be displayed for the resource if it is specified in the map settings', () => {
      const resources = getLckGeoResources(
        { [geoTableView.id]: geoTableView },
        { [geoTableView.id]: [] },
        {
          sources: [{
            ...defaultMapSourceSettings,
            id: geoTableView.id,
            popup: true
          }]
        },
        i18nOptions
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].displayPopup).toBe(true)
    })
  })
})
