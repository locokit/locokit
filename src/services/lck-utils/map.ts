import WKT from 'ol/format/WKT'
import Feature from 'ol/Feature'
import GeoJSON, {
  GeoJSONFeature,
  GeoJSONFeatureCollection
} from 'ol/format/GeoJSON'
import {
  CircleLayer,
  CircleLayout,
  CirclePaint,
  Expression,
  FillLayer,
  FillLayout,
  FillPaint,
  LineLayer,
  LineLayout,
  LinePaint,
  LngLatBounds,
  LngLatLike
} from 'mapbox-gl'

import { TranslateResult } from 'vue-i18n'

import {
  BlockTriggerEvent,
  BLOCK_TYPE,
  COLUMN_GEO_TYPE,
  COLUMN_TYPE,
  MapSettings,
  MapSourceSettings
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
import { getArrayDepth } from '@/services/lck-utils/arrays'
import GeometryType from 'ol/geom/GeometryType'

const lckGeoColor: Expression = [
  'case',
  ['boolean', ['feature-state', 'selectable'], false],
  '#ab0a0a',
  '#ea0e0e'
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
    'line-width': 15,
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

export const GEO_STYLE = {
  Point: LCK_GEO_STYLE_POINT,
  Linestring: LCK_GEO_STYLE_LINESTRING,
  Polygon: LCK_GEO_STYLE_POLYGON
}

export type LckImplementedLayers = CircleLayer | FillLayer | LineLayer

interface LckPopupI18nOptions {
  noReference: string | TranslateResult;
  noData: string | TranslateResult;
  dateFormat: string | TranslateResult;
}

export interface LckGeoResource {
  id: string;
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  layers: LckImplementedLayers[];
  displayPopup: boolean;
  pageDetailId?: string;
  editableGeometryTypes: Set<GeometryType>;
  selectable: boolean;
  triggerEvents: BlockTriggerEvent<'click'>[];
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

export type LckImplementedPaintProperty = keyof (CirclePaint | FillPaint | LinePaint)
export type LckImplementedLayoutProperty = keyof (CircleLayout | FillLayout | LineLayout)

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
}

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

export const transformFeatureToWKT = (geoJSONFeature: GeoJSONFeature) => {
  // Transform geoJSON to OL Feature
  const geoJSONformat = new GeoJSON()
  const feature = geoJSONformat.readFeature(geoJSONFeature)

  const featureGeometry = feature.getGeometry()

  // Transform OL Feature to WKT
  if (featureGeometry) {
    const wktFormat = new WKT()
    return `SRID=4326;${wktFormat.writeGeometry(featureGeometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })}`
  }
  return null
}

export function getStyleLayers (geoColumns: LckTableColumn[]): LckImplementedLayers[] {
  const geoTypes = new Set()
  const layers: LckImplementedLayers[] = []

  geoColumns.forEach(geoColumn => geoTypes.add(getColumnTypeId(geoColumn)))
  geoTypes.forEach(geoType => {
    switch (geoType) {
      case COLUMN_TYPE.GEOMETRY_POINT:
        layers.push(GEO_STYLE.Point)
        break
      case COLUMN_TYPE.GEOMETRY_LINESTRING:
        layers.push(GEO_STYLE.Linestring)
        break
      case COLUMN_TYPE.GEOMETRY_POLYGON:
        layers.push(GEO_STYLE.Polygon)
        break
      default:
        console.error('Column type unknown')
    }
  })
  return layers
}

/**
 * Get geo columns
 *  Two possible scenarios:
 *   - if the source field is a valid geo column, only data of this column will be display
 *   - otherwise all data of geo columns
 * @param columns
 * @param sourceSettings
 */
export function getOnlyGeoColumn (
  columns: LckTableViewColumn[],
  sourceSettings: MapSourceSettings
): LckTableViewColumn[] {
  if (sourceSettings.field) {
    const sourceGeoColumn = columns.find(column => column.id === sourceSettings.field && isGEOColumn(column.column_type_id))
    if (sourceGeoColumn) return [sourceGeoColumn]
  }
  return columns.filter(column => isGEOColumn(getColumnTypeId(column)))
}

export function makeGeoJsonFeaturesCollection (
  rows: LckTableRow[],
  geoColumns: LckTableViewColumn[],
  definitionColumns: LckTableViewColumn[],
  sources: MapSourceSettings[],
  i18nOptions: LckPopupI18nOptions
): { features: GeoJSONFeatureCollection; editableGeometryTypes: Set<GeometryType> } {
  const features: Feature[] = []

  const getEWKTFromGeoColumn = (geoColumn: LckTableColumn, data: Record<string, LckTableRowData>): string => {
    switch (geoColumn.column_type_id) {
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
        return (data[geoColumn.id] as { value: string })?.value
      default:
        return data[geoColumn.id] as string
    }
  }

  const editableGeometryTypes: Set<GeometryType> = new Set()

  rows.forEach(row => {
    geoColumns.forEach(geoColumn => {
      const data = getEWKTFromGeoColumn(geoColumn, row.data)
      if (data) {
        const feature = transformEWKTtoFeature(data)
        if (Array.isArray(sources)) {
          sources.forEach(source => {
            const featureProperties: Record<string, LckTableRowData | PopupContent[] > = {
              id: `${row.id}:${geoColumn.id}`,
              columnId: geoColumn.id,
              rowId: row.id
            }
            /**
             * Add page detail information if needed
             */
            if (source.pageDetailId) {
              featureProperties.title = row.text || i18nOptions.noReference.toString()
            }
            /**
             * Manage popup information
             */
            if (source.popup && source.popupSettings) {
              featureProperties.title = row.data[source.popupSettings.title]
              if (source.popupSettings?.contentFields?.length > 0) {
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
            /**
             * Indicate that this geometry type is editable
             */
            if (source.editable) {
              const featureGeoType = feature.getGeometry()?.getType()
              if (featureGeoType) editableGeometryTypes.add(featureGeoType)
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
  const geoJSONFeatures = geojsonFormat.writeFeaturesObject(features)
  return {
    features: geoJSONFeatures,
    editableGeometryTypes
  }
}

export function getLckGeoResources (
  tableViews: Record<string, LckTableView>,
  data: Record<string, LckTableRow[]>,
  settings: MapSettings,
  i18nOptions: LckPopupI18nOptions
): LckGeoResource[] {
  const lckGeoResources: LckGeoResource[] = []
  settings.sources.forEach((source, index) => {
    const columns = tableViews[source.id]?.columns || []
    // Get the specified column of the source and check that it is a geographic one
    const geoColumn = getOnlyGeoColumn(columns, source)

    if (geoColumn.length > 0) {
      const { features, editableGeometryTypes } = makeGeoJsonFeaturesCollection(
        data[source.id],
        geoColumn,
        columns,
        [source],
        i18nOptions
      )
      const layers: LckImplementedLayers[] = getStyleLayers(geoColumn)

      const displayPopup = !!(source.pageDetailId || source.popup)

      lckGeoResources.push({
        id: `features-collection-source-${index}`,
        layers,
        type: features.type,
        features: features.features,
        displayPopup,
        pageDetailId: source.pageDetailId,
        editableGeometryTypes,
        selectable: !!(source.selectable || source.triggerEvents.some(event => event.trigger === 'click')),
        triggerEvents: source.triggerEvents || []
      })
    }
  })
  return lckGeoResources
}

export function computeBoundingBox (resources: LckGeoResource[]): LngLatBounds {
  const coordinates: LngLatLike[] = []
  /**
   * Collect all coordinates from all features of all resources
   */
  resources.forEach((resource: LckGeoResource) => {
    resource.features.forEach(feature => {
      if (feature.geometry.type !== 'GeometryCollection') {
        // Get at least an Array of array hence the 2
        const featureCoord = feature.geometry.coordinates.flat(getArrayDepth(feature.geometry.coordinates) - 2)
        if (feature.geometry.type === 'Point') {
          coordinates.push(featureCoord as [number, number])
        } else {
          coordinates.push(...(featureCoord as [number, number][]))
        }
      }
    })
  })

  /**
   * if we only have one coordinates, for a bbox, we need two, minimum
   * so we add another coordinates, with the first one
   */
  if (coordinates.length === 1) coordinates.push(coordinates[0])

  /**
   * Now we can compute bounds of all coordinates...
   */
  return coordinates.reduce((bounds, coordinate) => {
    return bounds.extend(coordinate)
  }, new LngLatBounds(coordinates[0], coordinates[1]))
}
