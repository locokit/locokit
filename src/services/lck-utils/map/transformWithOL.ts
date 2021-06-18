import WKT from 'ol/format/WKT'
import Feature from 'ol/Feature'
import GeoJSON, {
  GeoJSONFeature,
  GeoJSONFeatureCollection
} from 'ol/format/GeoJSON'
import GeometryType from 'ol/geom/GeometryType'

import {
  CircleLayer,
  Expression,
  FillLayer,
  LineLayer
} from 'mapbox-gl'

import { TranslateResult } from 'vue-i18n'

import {
  BLOCK_TYPE,
  COLUMN_GEO_TYPE,
  COLUMN_TYPE,
  MapSettings,
  MapSourceSettings,
  MapSourceTriggerEvent
} from '@locokit/lck-glossary'

import {
  LckTableColumn,
  LckTableRow,
  LckTableRowData,
  LckTableView,
  LckTableViewColumn
} from '@/services/lck-api/definitions'
import {
  getColumnTypeId,
  getDataFromTableViewColumn
} from '@/services/lck-utils/columns'

const lckGeoColor: Expression = [
  'case',
  ['boolean', ['feature-state', 'selectable'], false],
  // Feature color on selection
  'rgb(158,25,25)',
  // Default feature color
  'rgba(234,14,14,0.6)'
]

const LCK_GEO_STYLE_POINT: CircleLayer = {
  id: 'layer-type-circle',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': lckGeoColor,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#FFFFFF'
  }
}
const LCK_GEO_STYLE_LINESTRING: LineLayer = {
  id: 'layer-type-line',
  type: 'line',
  paint: {
    'line-width': 10,
    'line-color': lckGeoColor
  }
}
const LCK_GEO_STYLE_POLYGON: FillLayer = {
  id: 'layer-type-fill',
  type: 'fill',
  paint: {
    'fill-color': lckGeoColor,
    'fill-outline-color': 'rgba(0,0,0,0)'
  }
}

export type LckImplementedLayers = CircleLayer | FillLayer | LineLayer

export const GEO_STYLE = {
  Point: LCK_GEO_STYLE_POINT,
  Linestring: LCK_GEO_STYLE_LINESTRING,
  Polygon: LCK_GEO_STYLE_POLYGON
}

export interface LckGeoResource {
  id: string;
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  layers: LckImplementedLayers[];
  editableGeometryTypes: Set<GeometryType>;
  triggerEvents?: Set<MapSourceTriggerEvent>;
  displayPopup?: boolean;
  pageDetailId?: string;
  selectable?: boolean;
}

export interface PopupContent {
  class?: string | null;
  field: {
    label: string | null;
    value: string | number | null;
    color?: string | null;
    backgroundColor?: string | null;
  };
}

export interface LckFeatureProperties {
  id: string;
  columnId: string;
  rowId: string;
  title?: LckTableRowData;
  content?: PopupContent[];
  sourceId?: string;
  text?: string;
}

/**
 * Convert spatial geometry EWKT
 * Transform EWKT into OL Feature
 *
 * @param ewkt
 *
 * @return {Feature<Geometry>}
 */
export const transformEWKTtoFeature = (ewkt: string) => {
  // Split EWKT to get reference coordinate system and geometry object
  const formattedData = ewkt.split(';', 2)
  const srid = formattedData[0].substring(5)
  const wkt = formattedData[1]

  // Transform WKT in OL Feature
  const format = new WKT()
  return format.readFeature(wkt, {
    dataProjection: `EPSG:${srid}`,
    featureProjection: 'EPSG:4326'
  })
}

/**
 * Convert a Geojson OL feature into ewkt
 *
 * @param geoJSONFeature feature
 *
 * @return {string | null}
 */
export const transformFeatureToWKT = (geoJSONFeature: GeoJSONFeature, srid = '4326') => {
  // Transform geoJSON to OL Feature
  const geoJSONformat = new GeoJSON()
  const feature = geoJSONformat.readFeature(geoJSONFeature)

  // Transform OL Feature to WKT
  const wktFormat = new WKT()
  return `SRID=${srid};${wktFormat.writeFeature(feature, {
    dataProjection: `EPSG:${srid}`,
    featureProjection: 'EPSG:4326'
  })}`
}

/**
 * Add style for a specific spatial geometry present in layer
 *
 * @param sourceId
 * @param geoColumns
 *
 * @return {LckImplementedLayers[]}
 */
export function getStyleLayers (sourceId: string, geoColumns: LckTableColumn[]): LckImplementedLayers[] {
  const geoTypes = new Set()
  const layers: LckImplementedLayers[] = []

  geoColumns.forEach(geoColumn => geoTypes.add(getColumnTypeId(geoColumn)))
  let geoStyle: (LckImplementedLayers | null)
  geoTypes.forEach(geoType => {
    geoStyle = null
    switch (geoType) {
      case COLUMN_TYPE.GEOMETRY_POINT:
        geoStyle = GEO_STYLE.Point
        break
      case COLUMN_TYPE.GEOMETRY_LINESTRING:
        geoStyle = GEO_STYLE.Linestring
        break
      case COLUMN_TYPE.GEOMETRY_POLYGON:
        geoStyle = GEO_STYLE.Polygon
        break
      default:
        // eslint-disable no-console
        console.error('Column type unknown')
    }
    if (geoStyle) {
      layers.push({
        ...geoStyle,
        id: `${sourceId}-${geoStyle.id}`
      })
    }
  })
  return layers
}

export const isGEOColumn = (columnTypeId: number) => {
  return Object.values(COLUMN_GEO_TYPE).includes(columnTypeId)
}

export const isGeoBlock = (blockType: BLOCK_TYPE) => {
  return [BLOCK_TYPE.MAPVIEW, BLOCK_TYPE.MAPDETAILVIEW].includes(blockType)
}

export const geometryTypeFromColumnType = (columnTypeId: COLUMN_TYPE) => {
  switch (columnTypeId) {
    case COLUMN_TYPE.GEOMETRY_POINT:
      return GeometryType.POINT
    case COLUMN_TYPE.GEOMETRY_LINESTRING:
      return GeometryType.LINE_STRING
    case COLUMN_TYPE.GEOMETRY_POLYGON:
      return GeometryType.POLYGON
  }
  return null
}

/**
 * Get geo columns
 *  Two possible scenarios:
 *   - if the source field is a valid geo column, only data of this column will be display
 *   - otherwise all data of geo columns
 * @param columns
 * @param sourceSettings
 *
 * @return {LckTableViewColumn[]}
 */
export function getOnlyGeoColumns (
  columns: LckTableViewColumn[],
  sourceSettings: MapSourceSettings
): LckTableViewColumn[] {
  if (sourceSettings.field) {
    const sourceGeoColumn = columns.find(column => column.id === sourceSettings.field && isGEOColumn(column.column_type_id))
    return sourceGeoColumn ? [sourceGeoColumn] : []
  }
  return columns.filter(column => isGEOColumn(getColumnTypeId(column)))
}

/**
 * Create a geojson for mapbox
 * According to the config, it allows popup's display with wanted data
 *
 * @param rows
 * @param geoColumns
 * @param definitionColumns
 * @param settings
 * @param i18nOptions
 *
 * @return {GeoJSONFeatureCollection}
 */
export function makeGeoJsonFeaturesCollection (
  rows: LckTableRow[],
  geoColumns: LckTableViewColumn[],
  definitionColumns: LckTableViewColumn[],
  sources: MapSourceSettings[],
  i18nOptions: LckPopupI18nOptions
): GeoJSONFeatureCollection {
  const features: Feature[] = []

  const getEWKTFromGeoColumn = (geoColumn: LckTableColumn, data: Record<string, LckTableRowData>): string => {
    switch (geoColumn.column_type_id) {
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
        return (data[geoColumn.id] as { value: string })?.value
      default:
        return data[geoColumn.id] as string
    }
  }

  rows.forEach(row => {
    geoColumns.forEach(geoColumn => {
      const data = getEWKTFromGeoColumn(geoColumn, row.data)
      if (data) {
        const feature = transformEWKTtoFeature(data)
        if (Array.isArray(sources)) {
          sources.forEach(source => {
            const featureProperties: LckFeatureProperties = {
              id: `${row.id}:${geoColumn.id}`,
              columnId: geoColumn.id,
              rowId: row.id
            }
            /**
             * Manage popup information
             */
            if (source.popup && source.popupSettings) {
              // Define the title
              if (source.popupSettings.title) {
                // From the specified value
                featureProperties.title = row.data[source.popupSettings.title] || ''
              } else if (source.popupSettings.pageDetailId) {
                // From the row reference if the page detail is specified
                featureProperties.title = row.text || i18nOptions.noReference.toString()
              }
              if (Array.isArray(source.popupSettings.contentFields)) {
                const allContent: PopupContent[] = []
                source.popupSettings.contentFields.forEach(contentField => {
                  // Get column's title
                  const matchingColumnField = definitionColumns.find(({ id }) => id === contentField.field)
                  if (matchingColumnField) {
                    // Get data from row
                    const data = getDataFromTableViewColumn(
                      matchingColumnField,
                      row.data[contentField.field],
                      i18nOptions
                    )
                    allContent.push({
                      ...contentField,
                      field: data
                    })
                  }
                })
                // Set data in Feature properties
                featureProperties.content = allContent
              }
            }
            // Add the source id to the feature
            if (geoColumn.editable) {
              featureProperties.sourceId = source.id
            }

            // Add the text value to have text related to the row
            if (source.triggerEvents?.includes('click')) {
              featureProperties.text = row.text || i18nOptions.noReference.toString()
            }

            feature.setProperties(featureProperties)
          })
        }
        features.push(feature)
      }
    })
  })

  // Transform OL Feature in Geojson
  const geojsonFormat = new GeoJSON()
  return geojsonFormat.writeFeaturesObject(features)
}

/**
 * Get the OL geometry types that can be editable from an array of columns
 * @param columns
 * @returns { Set<GeometryType> }
 */
export function getEditableGeometryTypes (columns: LckTableViewColumn[]) {
  const editableGeometryTypes: Set<GeometryType> = new Set()
  columns.forEach(column => {
    if (column.editable) {
      const geometryType = geometryTypeFromColumnType(column.column_type_id)
      if (geometryType) editableGeometryTypes.add(geometryType)
    }
  })
  return editableGeometryTypes
}

/**
 * Set style on features
 *
 * @param columns
 * @param data
 * @param settings
 * @param i18nOptions
 *
 * @return {{features: Array<Feature<Geometry, GeoJsonProperties>>, layers: LckImplementedLayers[], id: string, type: "FeatureCollection"}[]}
 */
export function getLckGeoResources (
  tableViews: Record<string, LckTableView>,
  data: Record<string, LckTableRow[]>,
  settings: MapSettings,
  i18nOptions: LckPopupI18nOptions
): LckGeoResource[] {
  const lckGeoResources: LckGeoResource[] = []
  settings.sources.forEach((source, index) => {
    const resourceId = `features-collection-source-${index}`

    const columns = tableViews[source.id]?.columns || []
    // Get the specified columns of the source and check that they are geographic ones
    const geoColumns = getOnlyGeoColumns(columns, source)

    if (geoColumns.length > 0) {
      const features = makeGeoJsonFeaturesCollection(
        data[source.id],
        geoColumns,
        columns,
        [source],
        i18nOptions
      )

      const editableGeometryTypes = getEditableGeometryTypes(geoColumns)

      const layers: LckImplementedLayers[] = getStyleLayers(resourceId, geoColumns)
      const triggerEvents = new Set(source.triggerEvents || []) as Set<MapSourceTriggerEvent>

      lckGeoResources.push({
        id: resourceId,
        layers,
        type: features.type,
        features: features.features,
        displayPopup: !!source.popup,
        pageDetailId: source.popupSettings?.pageDetailId,
        editableGeometryTypes,
        selectable: !!(source.selectable || triggerEvents.has('click')),
        triggerEvents
      })
    }
  })
  return lckGeoResources
}

export interface LckPopupI18nOptions {
  noReference: string | TranslateResult;
  noData: string | TranslateResult;
  dateFormat: string | TranslateResult;
}
