import WKT from 'ol/format/WKT'
import center from '@turf/center'
import { AllGeoJSON } from '@turf/helpers'
import { GeoJSONFeatureCollection } from 'ol/format/GeoJSON'

export const GEO_STYLE = {
  Point: {
    id: 'features-type-circle-layer-id',
    type: 'circle',
    paint: { 'circle-radius': 12, 'circle-color': '#576868' }
  },
  Linestring: {
    id: 'features-type-line-layer-id',
    type: 'line',
    paint: { 'line-width': 15, 'line-color': '#576868' }
  },
  Polygon: {
    id: 'features-type-fill-layer-id',
    type: 'fill',
    paint: { 'fill-color': '#576868' }
  }
}

export function transformEWKTtoFeature (ewkt: string) {
  // Split EWKT to get reference coordinate system and geometry object
  const formatedData = ewkt.split(';', 2)
  const srid = formatedData[0].substring(5)
  const wkt = formatedData[1]

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

export default { GEO_STYLE, transformEWKTtoFeature, computeCenterFeatures }
