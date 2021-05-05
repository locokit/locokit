import {
  CircleLayout,
  CirclePaint,
  FillLayout,
  FillPaint,
  LineLayout,
  LinePaint,
  LngLatBounds,
  LngLatLike
} from 'mapbox-gl'

import { getArrayDepth } from '@/services/lck-utils/arrays'
import { LckGeoResource } from '@/services/lck-utils/map/transformWithOL'

export type LckImplementedPaintProperty = keyof (CirclePaint | FillPaint | LinePaint)
export type LckImplementedLayoutProperty = keyof (CircleLayout | FillLayout | LineLayout)

export const computeBoundingBox = (resources: LckGeoResource[]): LngLatBounds => {
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
