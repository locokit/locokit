import WKT from 'ol/format/WKT'
import { COLUMN_GEO_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'
import { CircleLayer, CircleLayout, CirclePaint, FillLayer, FillLayout, FillPaint, LineLayer, LineLayout, LinePaint } from 'mapbox-gl'
import { LckTableColumn, LckTableRow, LckTableRowData, LckTableViewColumn } from '../lck-api/definitions'
import { getColumnTypeId } from './columns'
import GeoJSON, { GeoJSONFeature, GeoJSONFeatureCollection } from 'ol/format/GeoJSON'
import Feature from 'ol/Feature'

const LCK_GEO_STYLE_POINT: CircleLayer = {
  id: 'features-type-circle-layer-id',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#ea0e0e',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#FFFFFF'
  }
}
const LCK_GEO_STYLE_LINESTRING: LineLayer = {
  id: 'features-type-line-layer-id',
  type: 'line',
  paint: {
    'line-width': 15,
    'line-color': '#ea0e0e'
  }
}
const LCK_GEO_STYLE_POLYGON: FillLayer = {
  id: 'features-type-fill-layer-id',
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
  geoColumns: LckTableViewColumn[]
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
        features.push(transformEWKTtoFeature(data))
      }
    })
  })

  // Transform OL Feature in Geojson
  const geojsonFormat = new GeoJSON()
  return geojsonFormat.writeFeaturesObject(features)
}

export function getLckGeoResources (columns: LckTableViewColumn[], data: LckTableRow[]): LckGeoResource[] {
  const geoColumns: LckTableViewColumn[] = getOnlyGeoColumn(columns)
  const features: GeoJSONFeatureCollection = makeGeoJsonFeaturesCollection(data, geoColumns)
  const layers: LckImplementedLayers[] = getStyleLayers(geoColumns)

  return [{
    id: 'features-collection-source-id',
    layers,
    type: features.type,
    features: features.features
  }]
}
