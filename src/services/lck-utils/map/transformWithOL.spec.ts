/* eslint-disable @typescript-eslint/camelcase */
import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'
import { GeoJSONFeature } from 'ol/format/GeoJSON'
import GeometryType from 'ol/geom/GeometryType'

import { LckTableRow, LckTableView, LckTableViewColumn, SORT_COLUMN } from '@/services/lck-api/definitions'

import { geometryTypeFromColumnType, GEO_STYLE, getEditableGeometryTypes, getLckGeoResources, getOnlyGeoColumns, getStyleLayers, isGeoBlock, LckPopupI18nOptions, makeGeoJsonFeaturesCollection, mapDefaultStyle, MapEditableStyleProperties, transformFeatureToWKT } from './transformWithOL'

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
const defaultParamsTableViewColumn = {
  table_id: geoTableView.table_id,
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
  column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
  ...defaultParamsTableViewColumn
}

const geoPolygonColumn: LckTableViewColumn = {
  text: 'Geographic area',
  id: 'e065323c-1151-447f-be0f-6d2728117b39',
  settings: {},
  column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
  ...defaultParamsTableViewColumn,
  editable: true
}

const geoLineStringColumn: LckTableViewColumn = {
  text: 'Line string',
  id: 'e065323c-1151-447f-be0f-6d2728117b38',
  settings: {},
  column_type_id: COLUMN_TYPE.GEOMETRY_LINESTRING,
  ...defaultParamsTableViewColumn
}

const stringColumn: LckTableViewColumn = {
  text: 'Name',
  id: 'e065323c-1151-447f-be0f-6d2728117b38',
  settings: {},
  column_type_id: COLUMN_TYPE.STRING,
  ...defaultParamsTableViewColumn
}

const singleSelectColumn: LckTableViewColumn = {
  text: 'Selection',
  id: 'e065323c-1151-447f-be0f-6d2728117b37',
  settings: {
    values: {
      1: {
        backgroundColor: '#ddd',
        color: '#aaa',
        label: 'First option',
        value: '1'
      },
      2: {
        backgroundColor: '#eee',
        color: '#bbb',
        label: 'Second option',
        value: '2'
      },
      3: {
        backgroundColor: '#fff',
        color: '#ccc',
        label: 'Third option',
        value: '3'
      }
    }
  },
  column_type_id: COLUMN_TYPE.SINGLE_SELECT,
  ...defaultParamsTableViewColumn
}

const booleanColumn: LckTableViewColumn = {
  text: 'Checkbox',
  id: 'e065323c-1151-447f-be0f-6d2728117b36',
  settings: {},
  column_type_id: COLUMN_TYPE.BOOLEAN,
  ...defaultParamsTableViewColumn
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

const allColumnsObject: Record<string, LckTableViewColumn> = {
  [stringColumn.id]: stringColumn,
  [geoPointColumn.id]: geoPointColumn,
  [geoPolygonColumn.id]: geoPolygonColumn
}

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
      expect(isGeoBlock(BLOCK_TYPE.MAP_SET)).toBe(true)
    })
    it('Returns true if the current block type is a map detail view', () => {
      expect(isGeoBlock(BLOCK_TYPE.MAP_FIELD)).toBe(true)
    })
    it('Returns false if the current block type is a table view', () => {
      expect(isGeoBlock(BLOCK_TYPE.TABLE_SET)).toBe(false)
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

  describe('getOnlyGeoColumns', () => {
    it('Returns all the geographic columns of the table view if no column id is specified in the map source settings', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf'
      }
      const geoColumns = getOnlyGeoColumns(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([geoPointColumn, geoPolygonColumn])
    })
    it('Returns an empty array if no column id is specified in the map source settings and there is no geographic column', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf'
      }
      const geoColumns = getOnlyGeoColumns([stringColumn], mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
    it('Returns an array containing one geographic column if a column id is specified in the map source settings', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: 'e065323c-1151-447f-be0f-6d2728117b40'
      }
      const geoColumns = getOnlyGeoColumns(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([geoPointColumn])
    })
    it('Returns an empty array if the specified column id does not exist in the table view', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: 'e065323c-1151-447f-be0f-6d2728117b00'
      }
      const geoColumns = getOnlyGeoColumns(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
    it('Returns an empty array if the specified column id is not a geographic column', () => {
      const mapSourceSettings = {
        id: '263c21e6-5339-4748-903f-8c77e21314cf',
        field: 'e065323c-1151-447f-be0f-6d2728117b38'
      }
      const geoColumns = getOnlyGeoColumns(allColumns, mapSourceSettings)
      expect(geoColumns).toEqual([])
    })
  })
  describe('makeGeoJsonFeaturesCollection', () => {
    const mapSourceSettings = {
      id: '263c21e6-5339-4748-903f-8c77e21314cf'
    }
    it('Returns an empty features array if there is no row', () => {
      const features = makeGeoJsonFeaturesCollection(
        [],
        geoColumns,
        allColumnsObject,
        mapSourceSettings,
        i18nOptions
      )
      expect(features.type).toBe('FeatureCollection')
      expect(features.features).toHaveLength(0)
    })
    it('Returns an empty features array and an empty editable geometry types set if there is no geographic columns', () => {
      const features = makeGeoJsonFeaturesCollection(
        [],
        geoColumns,
        allColumnsObject,
        mapSourceSettings,
        i18nOptions
      )
      expect(features.features).toHaveLength(0)
    })
    it('Do not add a feature if the row data is empty', () => {
      const features = makeGeoJsonFeaturesCollection(
        [emptyRow],
        geoColumns,
        allColumnsObject,
        mapSourceSettings,
        i18nOptions
      )
      expect(features.features).toHaveLength(0)
    })
    it('If the sources are specified, add the id, columnId and rowId properties to each feature', () => {
      const features = makeGeoJsonFeaturesCollection(
        [firstRow],
        geoColumns,
        allColumnsObject,
        mapSourceSettings,
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
            pageDetailId
          }
        },
        i18nOptions
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
            contentFields: []
          }
        },
        i18nOptions
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
                class: 'my-custom-css-class'
              }
            ]
          }
        },
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
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
                class: 'my-custom-css-class'
              }
            ]
          }
        },
        i18nOptions
      )
      expect(features.features).toHaveLength(2)
      expect(features.features[0].properties?.content).toHaveLength(0)
    })
  })
  describe('getEditableGeometryTypes', () => {
    it('Return the OL geometry types related to the geographic editable columns', () => {
      const editableGeometryTypes = getEditableGeometryTypes(allColumns)
      expect(editableGeometryTypes.size).toBe(1)
      expect(editableGeometryTypes.has(GeometryType.POLYGON))
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
            id: geoTableView.id
          }]
        },
        i18nOptions
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].id).toBe('features-collection-source-0')
      expect(resources[0].type).toBe('FeatureCollection')
      expect(resources[0].features).toHaveLength(4)
      expect(resources[0].popupMode).toBeNull()
      expect(resources[0].pageDetailId).toBeFalsy()
      expect(resources[0].editableGeometryTypes.size).toBe(1)
      expect(resources[0].editableGeometryTypes.has(GeometryType.POLYGON)).toBe(true)
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
            id: geoTableView.id,
            selectable: true
          }]
        },
        i18nOptions
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
            popup: true
          }]
        },
        i18nOptions
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
              onHover: true
            }
          }]
        },
        i18nOptions
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
              pageDetailId
            }
          }]
        },
        i18nOptions
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
                  width: 10
                },
                fill: {
                  color: '#FFF',
                  width: 2
                }
              }
            }
          }]
        },
        i18nOptions
      )
      expect(resources).toHaveLength(1)
      expect(resources[0].layers[0]).toEqual({
        ...GEO_STYLE.Point,
        id: `features-collection-source-0-${GEO_STYLE.Point.id}`,
        paint: {
          'circle-color': '#FFF',
          'circle-stroke-color': '#000',
          'circle-stroke-width': 10,
          'circle-radius': 2,
          'circle-opacity': mapDefaultStyle.opacity
        }
      })
    })
  })
  describe('getStyleLayers', () => {
    describe('Geometry point', () => {
      it('Return the correct default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn]
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': mapDefaultStyle.fill.color,
            'circle-stroke-color': mapDefaultStyle.stroke.color,
            'circle-stroke-width': mapDefaultStyle.stroke.width,
            'circle-radius': mapDefaultStyle.fill.width
          }
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
                width: 2
              },
              stroke: {
                color: '#111',
                width: 10
              }
            }
          }
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': '#000',
            'circle-stroke-color': '#111',
            'circle-stroke-width': 10,
            'circle-radius': 2
          }
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
                width: 2
              },
              stroke: {
                color: '#111',
                width: 10
              }
            }
          }
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Marker,
          id: `myResourceId-${GEO_STYLE.Marker.id}`,
          paint: {
            'icon-opacity': mapDefaultStyle.opacity,
            'icon-color': '#000'
          },
          layout: {
            'icon-image': 'myUrlIcon',
            'icon-size': 2
          },
          imagesToLoad: new Set(['myUrlIcon'])
        })
      })
      it('Return the style based on a single select column', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            field: singleSelectColumn.id
          },
          singleSelectColumn
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': [
              'match',
              ['get', 'styleField'],
              '1',
              '#ddd',
              '2',
              '#eee',
              '3',
              '#fff',
              mapDefaultStyle.fill.color
            ],
            'circle-stroke-color': [
              'match',
              ['get', 'styleField'],
              '1',
              '#ddd',
              '2',
              '#eee',
              '3',
              '#fff',
              mapDefaultStyle.stroke.color
            ],
            'circle-radius': mapDefaultStyle.fill.width,
            'circle-stroke-width': mapDefaultStyle.stroke.width
          }
        })
      })
      it('Return the style based on a single select column with some overrided settings', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            field: singleSelectColumn.id,
            dataDriven: [
              {
                value: '1',
                style: {
                  stroke: {
                    color: '#111',
                    width: 5
                  }
                }
              },
              {
                value: '2',
                style: {
                  fill: {
                    color: '#222',
                    width: 3
                  }
                }
              },
              {
                value: '3',
                style: {
                  stroke: {
                    color: '#333',
                    width: 10
                  }
                }
              }
            ]
          },
          singleSelectColumn
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': [
              'match',
              ['get', 'styleField'],
              '1',
              '#ddd',
              '2',
              '#222',
              '3',
              '#fff',
              mapDefaultStyle.fill.color
            ],
            'circle-stroke-color': [
              'match',
              ['get', 'styleField'],
              '1',
              '#111',
              '2',
              '#eee',
              '3',
              '#333',
              mapDefaultStyle.stroke.color
            ],
            'circle-stroke-width': [
              'match',
              ['get', 'styleField'],
              '1',
              5,
              '3',
              10,
              mapDefaultStyle.stroke.width
            ],
            'circle-radius': [
              'match',
              ['get', 'styleField'],
              '2',
              3,
              mapDefaultStyle.fill.width
            ]
          }
        })
      })
      it('Return the style based on a single select column with some overrided settings with markers', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            field: singleSelectColumn.id,
            dataDriven: [
              {
                value: '1',
                style: {
                  stroke: {
                    color: '#111',
                    width: 5
                  }
                }
              },
              {
                value: '2',
                style: {
                  fill: {
                    color: '#222',
                    width: 3
                  },
                  icon: 'myNewIconUrl'
                }
              },
              {
                value: '3',
                style: {
                  stroke: {
                    color: '#333',
                    width: 10
                  }
                }
              }
            ]
          },
          singleSelectColumn
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Marker,
          id: `myResourceId-${GEO_STYLE.Marker.id}`,
          paint: {
            'icon-opacity': mapDefaultStyle.opacity,
            'icon-color': [
              'match',
              ['get', 'styleField'],
              '1',
              '#ddd',
              '2',
              '#222',
              '3',
              '#fff',
              mapDefaultStyle.fill.color
            ]
          },
          layout: {
            'icon-size': [
              'match',
              ['get', 'styleField'],
              '2',
              3,
              mapDefaultStyle.icon.size
            ],
            'icon-image': [
              'match',
              ['get', 'styleField'],
              '2',
              'myNewIconUrl',
              mapDefaultStyle.icon.url
            ]
          },
          imagesToLoad: new Set([mapDefaultStyle.icon.url, 'myNewIconUrl'])
        })
      })
      it('Return the style based on explicit style settings', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            field: booleanColumn.id,
            dataDriven: [
              {
                value: false,
                style: {
                  stroke: {
                    color: '#111',
                    width: 5
                  }
                }
              },
              {
                value: true,
                style: {
                  fill: {
                    color: '#222',
                    width: 3
                  }
                }
              }
            ]
          },
          booleanColumn
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Point,
          id: `myResourceId-${GEO_STYLE.Point.id}`,
          paint: {
            'circle-opacity': mapDefaultStyle.opacity,
            'circle-color': [
              'match',
              ['get', 'styleField'],
              true,
              '#222',
              mapDefaultStyle.fill.color
            ],
            'circle-radius': [
              'match',
              ['get', 'styleField'],
              true,
              3,
              mapDefaultStyle.fill.width
            ],
            'circle-stroke-color': [
              'match',
              ['get', 'styleField'],
              false,
              '#111',
              mapDefaultStyle.stroke.color
            ],
            'circle-stroke-width': [
              'match',
              ['get', 'styleField'],
              false,
              5,
              mapDefaultStyle.stroke.width
            ]
          }
        })
      })
      it('Return the style based on explicit style settings with markers', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPointColumn],
          {
            field: booleanColumn.id,
            dataDriven: [
              {
                value: false,
                style: {
                  icon: 'myNewIconUrl1'
                }
              },
              {
                value: true,
                style: {
                  icon: 'myNewIconUrl2'
                }
              }
            ]
          },
          booleanColumn
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toStrictEqual({
          ...GEO_STYLE.Marker,
          id: `myResourceId-${GEO_STYLE.Marker.id}`,
          paint: {
            'icon-opacity': mapDefaultStyle.opacity,
            'icon-color': mapDefaultStyle.fill.color
          },
          layout: {
            'icon-size': mapDefaultStyle.icon.size,
            'icon-image': [
              'match',
              ['get', 'styleField'],
              false,
              'myNewIconUrl1',
              true,
              'myNewIconUrl2',
              mapDefaultStyle.icon.url
            ]
          },
          imagesToLoad: new Set([
            mapDefaultStyle.icon.url,
            'myNewIconUrl1',
            'myNewIconUrl2'
          ])
        })
      })
    })
    describe('Geometry polygon', () => {
      it('Return the correct default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPolygonColumn]
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Polygon,
          id: `myResourceId-${GEO_STYLE.Polygon.id}`,
          paint: {
            'fill-opacity': mapDefaultStyle.opacity,
            'fill-color': mapDefaultStyle.fill.color,
            'fill-outline-color': mapDefaultStyle.stroke.color
          }
        })
      })
      it('Return the specified default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoPolygonColumn],
          {
            default: {
              fill: {
                color: '#000'
              },
              stroke: {
                color: '#111',
                width: 10
              }
            }
          }
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Polygon,
          id: `myResourceId-${GEO_STYLE.Polygon.id}`,
          paint: {
            'fill-opacity': mapDefaultStyle.opacity,
            'fill-color': '#000',
            'fill-outline-color': '#111'
          }
        })
      })
    })
    describe('Geometry linestring', () => {
      it('Return the correct default style', () => {
        const layers = getStyleLayers(
          'myResourceId',
          [geoLineStringColumn],
          {
            default: {}
          }
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Linestring,
          id: `myResourceId-${GEO_STYLE.Linestring.id}`,
          paint: {
            'line-opacity': mapDefaultStyle.opacity,
            'line-color': mapDefaultStyle.fill.color,
            'line-width': mapDefaultStyle.fill.width
          }
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
                width: 10
              },
              stroke: {
                color: '#111'
              }
            }
          }
        )
        expect(layers.length).toBe(1)
        expect(layers[0]).toEqual({
          ...GEO_STYLE.Linestring,
          id: `myResourceId-${GEO_STYLE.Linestring.id}`,
          paint: {
            'line-opacity': mapDefaultStyle.opacity,
            'line-color': '#000',
            'line-width': 10
          }
        })
      })
    })
  })
})
