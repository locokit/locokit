import WKT from 'ol/format/WKT'
import center from '@turf/center'
import { AllGeoJSON } from '@turf/helpers'
import { GeoJSONFeatureCollection } from 'ol/format/GeoJSON'
import { COLUMN_GEO_TYPE } from '@locokit/lck-glossary'

export const GEO_STYLE = {
  Point: {
    id: 'features-type-circle-layer-id',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#ea0e0e',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFFFFF'
    }
  },
  Linestring: {
    id: 'features-type-line-layer-id',
    type: 'line',
    paint: { 'line-width': 15, 'line-color': '#ea0e0e' }
  },
  Polygon: {
    id: 'features-type-fill-layer-id',
    type: 'fill',
    paint: { 'fill-color': '#ea0e0e' }
  }
}

export function isGEOColumn (ColumnTypeId: number) {
  return Object.values(COLUMN_GEO_TYPE).includes(ColumnTypeId)
}

export function transformEWKTtoFeature (ewkt: string) {
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

export function computeCenterFeatures (geojson: GeoJSONFeatureCollection) {
  return center(geojson as AllGeoJSON)
}

export default { GEO_STYLE, isGEOColumn, transformEWKTtoFeature, computeCenterFeatures }
