import {
  GEO_STYLE,
} from '@/services/lck-utils/map/transformWithOL'
import { COLUMN_TYPE } from '@locokit/lck-glossary/src'
import GeometryType from 'ol/geom/GeometryType'

// Mock variables
export const mockResources = [
  {
    id: 'resource_1',
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: GeometryType.POINT,
          coordinates: [10, 20],
        },
        id: 'f1',
        properties: {
          title: 'First feature',
          rowId: 'row1',
          columnId: 'column1',
          content: JSON.stringify([
            {
              field: {
                label: 'First field',
                value: 10,
              },
            },
          ]),
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: GeometryType.POINT,
          coordinates: [15, 30],
        },
        id: 'f2',
        properties: {},
      },
      {
        type: 'Feature',
        geometry: {
          type: GeometryType.POINT,
          coordinates: [10, 20],
        },
        id: 'f3',
        properties: {
          title: 'Third feature',
          rowId: 'row2',
          columnId: 'column1',
          content: JSON.stringify([
            {
              field: {
                label: 'First field',
                value: 100,
              },
            },
          ]),
        },
      },
    ],
    layers: [GEO_STYLE.Point],
    popupMode: null,
    editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_POINT]),
    selectable: false,
  },
  {
    id: 'resource_2',
    type: 'FeatureCollection',
    excludeFromBounds: true,
    features: [
      {
        type: 'Feature',
        geometry: {
          type: GeometryType.POINT,
          coordinates: [0, 5],
        },
        id: 'f1bis',
        properties: {
          title: 'First feature bis',
          rowId: 'row1bis',
          columnId: 'column1',
          content: JSON.stringify([
            {
              field: {
                label: 'First field',
                value: 10,
              },
            },
          ]),
        },
      },
    ],
    layers: [GEO_STYLE.Point],
    popupMode: null,
    editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_POLYGON]),
    selectable: false,
  },
  {
    id: 'resource_3',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: 'click',
    editableGeometryTypes: new Set(),
    selectable: false,
  },
  {
    id: 'resource_4',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: null,
    editableGeometryTypes: new Set(),
    selectable: true,
  },
  {
    id: 'resource_5',
    type: 'FeatureCollection',
    features: [],
    layers: [GEO_STYLE.Point],
    popupMode: 'hover',
    editableGeometryTypes: new Set(),
    selectable: false,
  },
]

export const forbiddenResource = {
  id: 'resource_6',
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: GeometryType.POINT,
        coordinates: [10, 20],
      },
      id: 'f1',
      properties: {
        rowId: 'row1',
        columnId: 'column1',
      },
    },
  ],
  layers: [GEO_STYLE.Polygon],
  popupMode: 'hover',
  editableGeometryTypes: new Set(),
  selectable: false,
  forbiddenAreaRadius: 10,
}

export const mockFirstFeature = mockResources[0].features[0]
export const mockSecondFeature = mockResources[0].features[1]
export const mockThirdFeature = mockResources[0].features[2]
export const mockOrphanFeature = {
  type: 'Feature',
  geometry: {
    type: GeometryType.POINT,
    coordinates: [10, 20],
  },
  features: [],
  id: 'f4',
  properties: {
    title: 'Orphan feature',
    rowId: 'row1',
    columnId: 'column1',
    content: JSON.stringify([
      {
        field: {
          label: 'First field',
          value: 1200,
        },
      },
    ]),
  },
}
