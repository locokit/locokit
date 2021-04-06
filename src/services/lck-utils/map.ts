import WKT from 'ol/format/WKT'
import { COLUMN_GEO_TYPE, COLUMN_TYPE, MapSettings } from '@locokit/lck-glossary'
import { CircleLayer, CircleLayout, CirclePaint, FillLayer, FillLayout, FillPaint, LineLayer, LineLayout, LinePaint } from 'mapbox-gl'
import { LckTableColumn, LckTableRow, LckTableRowData, LckTableViewColumn } from '../lck-api/definitions'
import { getColumnTypeId, getDataFromTableViewColumn } from './columns'
import GeoJSON, { GeoJSONFeature, GeoJSONFeatureCollection } from 'ol/format/GeoJSON'
import Feature from 'ol/Feature'
import { TranslateResult } from 'vue-i18n'

const LCK_GEO_STYLE_POINT: CircleLayer = {
  id: 'layer-type-circle',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#ea0e0e',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#FFFFFF'
  }
}
const LCK_GEO_STYLE_LINESTRING: LineLayer = {
  id: 'layer-type-line',
  type: 'line',
  paint: {
    'line-width': 15,
    'line-color': '#ea0e0e'
  }
}
const LCK_GEO_STYLE_POLYGON: FillLayer = {
  id: 'layer-type-fill',
  type: 'fill',
  paint: {
    'fill-color': '#ea0e0e'
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
}

export type LckImplementedPaintProperty = keyof (CirclePaint | FillPaint | LinePaint)
export type LckImplementedLayoutProperty = keyof (CircleLayout | FillLayout | LineLayout)

export const isGEOColumn = (columnTypeId: number) => {
  return Object.values(COLUMN_GEO_TYPE).includes(columnTypeId)
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
 * Return only the GEOMETRY columns from a LckTableViewColumn[]
 */
export function getOnlyGeoColumn (
  columns: LckTableViewColumn[]
): LckTableViewColumn[] {
  return columns.filter(column => isGEOColumn(getColumnTypeId(column)))
}

export function makeGeoJsonFeaturesCollection (
  rows: LckTableRow[],
  geoColumns: LckTableViewColumn[],
  definitionColumns: LckTableViewColumn[],
  settings: MapSettings,
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
        /**
         * Add page detail information if needed
         */
        if (settings.pageDetailId) {
          feature.setProperties({
            rowId: row.id,
            title: row.text || i18nOptions.noReference
          })
        }
        /**
         * Manage popup information
         */
        if (settings?.sources) {
          settings.sources.forEach(source => {
            if (source.popup) {
              console.log('popup', row.data)
              feature.setProperties({
                title: row.data[source.popupSettings.title]
              })
              if (source.popupSettings?.contentFields?.length > 0) {
                const allContent: {
                  class?: string;
                  field: {
                    label: string;
                    value: string|number;
                    color?: string;
                    backgroundColor?: string;
                  };
                }[] = []
                source.popupSettings.contentFields.forEach(contentField => {
                  // Get column's title
                  const matchingColumnField = definitionColumns.find(({ id }) => id === contentField.field)
                  console.log(contentField, matchingColumnField)
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
                feature.setProperties({
                  content: allContent
                })
              }
            }
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

export function getLckGeoResources (
  columns: LckTableViewColumn[],
  data: LckTableRow[],
  settings: MapSettings,
  i18nOptions: LckPopupI18nOptions
): LckGeoResource[] {
  const geoColumns: LckTableViewColumn[] = getOnlyGeoColumn(columns)
  const features: GeoJSONFeatureCollection = makeGeoJsonFeaturesCollection(
    data,
    geoColumns,
    columns,
    settings,
    i18nOptions
  )
  const layers: LckImplementedLayers[] = getStyleLayers(geoColumns)

  return [{
    id: 'features-collection-source',
    layers,
    type: features.type,
    features: features.features
  }]
}
