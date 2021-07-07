import WKT from 'ol/format/WKT'
import Feature from 'ol/Feature'
import GeoJSON, {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
} from 'ol/format/GeoJSON'
import GeometryType from 'ol/geom/GeometryType'
import Geometry from 'ol/geom/Geometry'

import {
  CircleLayer,
  Expression,
  FillLayer,
  LineLayer,
  SymbolLayer,
} from 'mapbox-gl'
import cloneDeep from 'lodash.clonedeep'

import { TranslateResult } from 'vue-i18n'

import {
  BLOCK_TYPE,
  COLUMN_GEO_TYPE,
  COLUMN_TYPE,
  MapFeatureStyle,
  MapSettings,
  MapSourceSettings,
  MapSourceStyle,
  MapSourceTriggerEvents,
} from '@locokit/lck-glossary'

import {
  LckTableColumn,
  LckTableRow,
  LckTableRowData,
  LckTableView,
  LckTableViewColumn,
  MapPopupMode,
  SelectValue,
} from '@/services/lck-api/definitions'
import {
  getColumnDisplayValue,
  getColumnTypeId,
  getDataFromTableViewColumn,
} from '@/services/lck-utils/columns'
import { objectFromArray } from '../arrays'

const LCK_GEO_STYLE_POINT: CircleLayer = {
  id: 'layer-type-circle',
  type: 'circle',
}
const LCK_GEO_STYLE_MARKER: SymbolLayer = {
  id: 'layer-type-symbol',
  type: 'symbol',
}
const LCK_GEO_STYLE_LINESTRING: LineLayer = {
  id: 'layer-type-line',
  type: 'line',
}
const LCK_GEO_STYLE_POLYGON: FillLayer = {
  id: 'layer-type-fill',
  type: 'fill',
}

export type LckImplementedLayers = (CircleLayer | FillLayer | LineLayer | SymbolLayer) & { imagesToLoad?: Set<string> }

export const GEO_STYLE = {
  Point: LCK_GEO_STYLE_POINT,
  Marker: LCK_GEO_STYLE_MARKER,
  Linestring: LCK_GEO_STYLE_LINESTRING,
  Polygon: LCK_GEO_STYLE_POLYGON,
}

export interface LckGeoResource {
  id: string;
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  layers: LckImplementedLayers[];
  editableGeometryTypes: Set<GeometryType>;
  popupMode: MapPopupMode;
  triggerEvents?: MapSourceTriggerEvents;
  caughtEvents?: string[];
  pageDetailId?: string;
  selectable?: boolean;
}

export interface PopupContent {
  class?: string | null;
  field: {
    label: string | null;
    value: string | number | boolean | null;
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
  originalData?: Record<string, LckTableRowData>;
  displayedData?: Record<string, string | number | undefined | SelectValue >;
}

export type LckFeaturePropertiesWithData = LckFeatureProperties & Record<string, LckTableRowData>

/**
 * Convert spatial geometry EWKT
 * Transform EWKT into OL Feature
 */
export const transformEWKTtoFeature = (ewkt: string): Feature<Geometry> => {
  // Split EWKT to get reference coordinate system and geometry object
  const formattedData = ewkt.split(';', 2)
  const srid = formattedData[0].substring(5)
  const wkt = formattedData[1]

  // Transform WKT in OL Feature
  const format = new WKT()
  return format.readFeature(wkt, {
    dataProjection: `EPSG:${srid}`,
    featureProjection: 'EPSG:4326',
  })
}

/**
 * Convert a Geojson OL feature into ewkt
 */
export const transformFeatureToWKT = (geoJSONFeature: GeoJSONFeature, srid = '4326'): string | null => {
  // Transform geoJSON to OL Feature
  const geoJSONformat = new GeoJSON()
  const feature = geoJSONformat.readFeature(geoJSONFeature)

  // Transform OL Feature to WKT
  const wktFormat = new WKT()
  return `SRID=${srid};${wktFormat.writeFeature(feature, {
    dataProjection: `EPSG:${srid}`,
    featureProjection: 'EPSG:4326',
  })}`
}

export interface MapEditableStyleProperties {
  fill: {
    color: Expression | string;
    width: Expression | number;
  };
  stroke: {
    color: Expression | string;
    width: Expression | number;
  };
  icon: {
    url: Expression | string;
    size: Expression | number;
  };
  opacity: Expression;
}

export const mapDefaultStyle: MapEditableStyleProperties = {
  fill: {
    width: 10,
    color: '#EA0E0E',
  },
  stroke: {
    width: 2,
    color: '#FFFFFF',
  },
  icon: {
    url: '/img/marker-icon.png',
    size: 1,
  },
  opacity: [
    'case',
    ['boolean', ['feature-state', 'selectable'], false],
    1, // Feature opacity on selection
    0.5, // Default feature opacity
  ],
}

/**
 * Add style for a specific spatial geometry present in layer
 *
 * @param sourceId
 * @param geoColumns
 * @param sourceStyle
 *
 * @return {LckImplementedLayers[]}
 */
export function getStyleLayers (sourceId: string, geoColumns: LckTableColumn[], sourceStyle?: MapSourceStyle): LckImplementedLayers[] {
  const geoTypes: Set<COLUMN_TYPE> = new Set()
  const layers: LckImplementedLayers[] = []
  let displayMarkers = false

  geoColumns.forEach(geoColumn => geoTypes.add(getColumnTypeId(geoColumn)))

  // Used images as markers
  const imagesToLoad: Set<string> = new Set()

  // Default style settings
  const { fill = {}, stroke = {}, icon = '' }: MapFeatureStyle = sourceStyle?.default || {}

  const defaultStyle: MapEditableStyleProperties = {
    fill: {
      color: fill.color || mapDefaultStyle.fill.color,
      width: fill.width || mapDefaultStyle.fill.width,
    },
    stroke: {
      color: stroke.color || mapDefaultStyle.stroke.color,
      width: stroke.width || mapDefaultStyle.stroke.width,
    },
    icon: {
      url: icon || mapDefaultStyle.icon.url,
      size: fill.width || mapDefaultStyle.icon.size,
    },
    opacity: mapDefaultStyle.opacity,
  }

  if (sourceStyle?.default?.icon) displayMarkers = true

  imagesToLoad.add(defaultStyle.icon.url as string)

  const computedStyle: MapEditableStyleProperties = cloneDeep(defaultStyle)

  // Change features styles depending of the values of the specified fields
  if (sourceStyle?.dataDriven) {
    computedStyle.icon.url = ['case']
    computedStyle.fill.color = ['case']
    computedStyle.fill.width = ['case']
    computedStyle.stroke.color = ['case']
    computedStyle.stroke.width = ['case']

    for (const { values, style } of sourceStyle.dataDriven) {
      const condition: unknown[] = ['all']
      values.forEach(({ field, value }) => {
        condition.push(['==', ['get', field], value])
      })
      if (style.fill) {
        if (style.fill.color) computedStyle.fill.color.push(condition, style.fill.color)
        if (style.fill.width != null) computedStyle.fill.width.push(condition, style.fill.width)
      }
      if (style.stroke) {
        if (style.stroke.color) computedStyle.stroke.color.push(condition, style.stroke.color)
        if (style.stroke.width != null) computedStyle.stroke.width.push(condition, style.stroke.width)
      }
      if (style.icon) {
        computedStyle.icon.url.push(condition, style.icon)
        imagesToLoad.add(style.icon)
      }
    }

    // The icon size is similar to the fill width except for the default value
    computedStyle.icon.size = Array.from(computedStyle.fill.width) as Expression

    // Add default values
    computedStyle.fill.color.push(defaultStyle.fill.color)
    computedStyle.fill.width.push(defaultStyle.fill.width)
    computedStyle.stroke.color.push(defaultStyle.stroke.color)
    computedStyle.stroke.width.push(defaultStyle.stroke.width)
    computedStyle.icon.url.push(defaultStyle.icon.url)
    computedStyle.icon.size.push(defaultStyle.icon.size)

    // We must have at least 4 values by Mapbox expression
    if (computedStyle.fill.color.length < 4) computedStyle.fill.color = defaultStyle.fill.color
    if (computedStyle.fill.width.length < 4) {
      computedStyle.fill.width = defaultStyle.fill.width
      computedStyle.icon.size = defaultStyle.icon.size
    }
    if (computedStyle.stroke.color.length < 4) computedStyle.stroke.color = defaultStyle.stroke.color
    if (computedStyle.stroke.width.length < 4) computedStyle.stroke.width = defaultStyle.stroke.width
    if (computedStyle.icon.url.length < 4) {
      computedStyle.icon.url = defaultStyle.icon.url
    } else {
      displayMarkers = true
    }
  }

  // Get right style depending of the geometry type
  let geoStyle: (LckImplementedLayers | null)

  geoTypes.forEach(geoType => {
    geoStyle = null
    switch (geoType) {
      case COLUMN_TYPE.GEOMETRY_POINT:
      case COLUMN_TYPE.GEOMETRY_MULTIPOINT:
        if (displayMarkers) {
          geoStyle = GEO_STYLE.Marker
          geoStyle.paint = {
            'icon-color': computedStyle.fill.color,
            'icon-opacity': computedStyle.opacity,
          }
          geoStyle.layout = {
            'icon-image': computedStyle.icon.url,
            'icon-size': computedStyle.icon.size,
            'icon-allow-overlap': true,
          }
          geoStyle.imagesToLoad = imagesToLoad
        } else {
          geoStyle = GEO_STYLE.Point
          geoStyle.paint = {
            ...GEO_STYLE.Point.paint,
            'circle-opacity': computedStyle.opacity,
            'circle-color': computedStyle.fill.color,
            'circle-radius': computedStyle.fill.width,
            'circle-stroke-color': computedStyle.stroke.color,
            'circle-stroke-width': computedStyle.stroke.width,
          }
        }
        break
      case COLUMN_TYPE.GEOMETRY_LINESTRING:
      case COLUMN_TYPE.GEOMETRY_MULTILINESTRING:
        geoStyle = GEO_STYLE.Linestring
        geoStyle.paint = {
          ...GEO_STYLE.Linestring.paint,
          'line-opacity': computedStyle.opacity,
          'line-color': computedStyle.fill.color,
          'line-width': computedStyle.fill.width,
        }
        break
      case COLUMN_TYPE.GEOMETRY_POLYGON:
      case COLUMN_TYPE.GEOMETRY_MULTIPOLYGON:
        geoStyle = GEO_STYLE.Polygon
        geoStyle.paint = {
          ...GEO_STYLE.Polygon.paint,
          'fill-opacity': computedStyle.opacity,
          'fill-color': computedStyle.fill.color,
          'fill-outline-color': computedStyle.stroke.color,
        }
        break
      default:
        // eslint-disable no-console
        console.error('Column type unknown')
    }
    if (geoStyle) {
      layers.push({
        ...geoStyle,
        id: `${sourceId}-${geoStyle.id}-${geoType}`,
      })
    }
  })
  return layers
}

export const isGEOColumn = (columnTypeId: number) => {
  return Object.values(COLUMN_GEO_TYPE).includes(columnTypeId)
}

export const isGeoBlock = (blockType: BLOCK_TYPE) => {
  return [BLOCK_TYPE.MAP_SET, BLOCK_TYPE.MAP_FIELD].includes(blockType)
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
  sourceSettings: MapSourceSettings,
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
 * @param styleColumns
 *
 * @return {GeoJSONFeatureCollection}
 */
export function makeGeoJsonFeaturesCollection (
  rows: LckTableRow[],
  geoColumns: LckTableViewColumn[],
  definitionColumns: Record<string, LckTableViewColumn>,
  source: MapSourceSettings,
  i18nOptions: LckPopupI18nOptions,
  styleColumns?: string[],
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

  let hasSelectRowEvent = false
  const fieldsToSelectOnEvent: string[] = []

  if (Array.isArray(source.triggerEvents)) {
    source.triggerEvents.forEach(event => {
      if (event.type === 'selectRow') {
        hasSelectRowEvent = true
      } else if (event.type === 'selectField' && event.field) {
        fieldsToSelectOnEvent.push(event.field)
      }
    })
  }

  rows.forEach(row => {
    geoColumns.forEach(geoColumn => {
      const data = getEWKTFromGeoColumn(geoColumn, row.data)
      if (data) {
        const feature = transformEWKTtoFeature(data)
        if (source) {
          const featureProperties: LckFeaturePropertiesWithData = {
            id: `${row.id}:${geoColumn.id}`,
            columnId: geoColumn.id,
            rowId: row.id,
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
                const matchingColumnField = definitionColumns[contentField.field]
                if (matchingColumnField) {
                  // Get data from row
                  const data = getDataFromTableViewColumn(
                    matchingColumnField,
                    row.data[contentField.field],
                    i18nOptions,
                  )
                  allContent.push({
                    ...contentField,
                    field: data,
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

          // Add information for events
          if (hasSelectRowEvent || fieldsToSelectOnEvent.length > 0) {
            featureProperties.originalData = {}
            featureProperties.displayedData = {}
            if (hasSelectRowEvent) {
              // Add the text value to have text related to the row
              featureProperties.originalData.text = row.text
              featureProperties.displayedData.text = row.text
            }
            if (fieldsToSelectOnEvent.length > 0) {
              // Add the desired fields
              fieldsToSelectOnEvent.forEach(field => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                featureProperties.originalData![field] = row.data[field]
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                featureProperties.displayedData![field] = getColumnDisplayValue(
                  definitionColumns[field],
                  row.data[field],
                  true,
                )
              })
            }
          }
          // Add the fields chosen to customize the layer
          if (styleColumns) {
            styleColumns.forEach(styleColumn => {
              featureProperties[styleColumn] = row.data[styleColumn]
            })
          }
          feature.setProperties(featureProperties)
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
 */
export function getEditableGeometryTypes (columns: LckTableViewColumn[]): Set<GeometryType> {
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
  i18nOptions: LckPopupI18nOptions,
): LckGeoResource[] {
  const lckGeoResources: LckGeoResource[] = []
  settings.sources.forEach((source, index) => {
    const resourceId = `features-collection-source-${index}`

    const columns = tableViews[source.id]?.columns || []
    // Get the specified columns of the source and check that they are geographic ones
    const geoColumns = getOnlyGeoColumns(columns, source)
    const columnsObject = objectFromArray<LckTableViewColumn>(columns, 'id')

    if (geoColumns.length > 0) {
      const features = makeGeoJsonFeaturesCollection(
        data[source.id],
        geoColumns,
        columnsObject,
        source,
        i18nOptions,
        source.style?.fields,
      )

      const editableGeometryTypes = getEditableGeometryTypes(geoColumns)

      const layers = getStyleLayers(resourceId, geoColumns, source.style)

      const selectable =
        source.selectable || (
          Array.isArray(source.triggerEvents) &&
          source.triggerEvents.some(event => event.type === 'selectField' || event.type === 'selectRow')
        )

      const popupMode: MapPopupMode = source.popup
        ? source.popupSettings?.onHover ? 'hover' : 'click'
        : null

      lckGeoResources.push({
        id: resourceId,
        layers,
        type: features.type,
        features: features.features,
        popupMode,
        pageDetailId: source.popupSettings?.pageDetailId,
        editableGeometryTypes,
        triggerEvents: source.triggerEvents,
        caughtEvents: source.caughtEvents,
        selectable,
      })
    }
  })
  return lckGeoResources
}

export interface LckPopupI18nOptions {
  noReference: string | TranslateResult;
  noData: string | TranslateResult;
  dateFormat: string | TranslateResult;
  datetimeFormat: string | TranslateResult;
}
