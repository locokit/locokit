import { COLUMN_TYPE } from '@locokit/lck-glossary/src'
import { action } from '@storybook/addon-actions'
import GeometryType from 'ol/geom/GeometryType'
import Map from './Map'
import { mockResources } from './__mocks__/data'

const optionsWithoutBackgroundTiles = {
  style: {
    version: 8,
    sources: {},
    glyphs: '/fonts/{fontstack}/{range}.pbf',
    layers: [],
  },
}

const optionsWithBackgroundTiles = {
  style: {
    version: 8,
    sources: {
      'tiles-background': {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
      },
    },
    glyphs: '/fonts/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'tiles-background',
        type: 'raster',
        source: 'tiles-background',
        minzoom: 0,
        maxzoom: 17,
      },
    ],
  },
}

const defaultArgTypes = {
  options: {
    control: {
      type: 'select',
      options: [
        JSON.stringify(optionsWithoutBackgroundTiles),
        JSON.stringify(optionsWithBackgroundTiles),
      ],
    },
    defaultValue: JSON.stringify(optionsWithBackgroundTiles),
  },
}

const resourcesExamples = {
  pointAndText: {
    id: 'features-type-point-source-id',
    features: [
      {
        type: 'feature',
        geometry: {
          type: 'Point',
          coordinates: [2, 46],
        },
        properties: {},
      },
    ],
    layers: [
      {
        id: 'features-type-circle-layer-id',
        type: 'circle',
        paint: { 'circle-radius': 15, 'circle-color': '#53ACB4' },
      },
      {
        id: 'features-type-symbol-layer-id',
        type: 'symbol',
        paint: { 'text-color': '#FFFFFF' },
        layout: { 'text-field': '1', 'text-font': ['Open Sans Regular'] },
      },
    ],
  },
  lineString: {
    id: 'features-type-linestring-source-id',
    features: [
      {
        type: 'feature',
        geometry: {
          type: 'LineString',
          coordinates: [[-20, 46], [-40, 48]],
        },
        properties: {},
      },
    ],
    layers: [
      {
        id: 'features-type-line-layer-id',
        type: 'line',
        paint: { 'line-width': 15, 'line-color': '#53ACB4' },
      },
    ],
  },
  polygon: {
    id: 'features-type-polygon-source-id',
    features: [
      {
        type: 'feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[-40, 40], [-50, 48], [-50, 34], [-40, 40]]],
        },
        properties: {},
      },
    ],
    layers: [
      {
        id: 'features-type-fill-layer-id',
        type: 'fill',
        paint: { 'fill-color': '#53ACB4' },
      },
    ],
  },
}

export default {
  title: 'components/ui/ColumnType/Map',
  component: Map,
  argTypes: {
    timeoutBeforeScreenshot: {
      table: {
        disable: true,
      },
    },
  },
}

export const withPointLayerStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    template: '<Map :options="JSON.parse(options)" :resources="resources" />',
  }
}

withPointLayerStory.storyName = 'with Point layer'
withPointLayerStory.args = {
  resources: [
    {
      ...resourcesExamples.pointAndText,
      layers: [resourcesExamples.pointAndText.layers[0]],
    },
  ],
}
withPointLayerStory.argTypes = defaultArgTypes
withPointLayerStory.parameters = {
  storyshots: false,
}

export const withPointAndTextLayersStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    template: '<Map :options="JSON.parse(options)" :resources="resources" />',
  }
}

withPointAndTextLayersStory.storyName = 'with Point and Text layers'
withPointAndTextLayersStory.args = {
  resources: [
    resourcesExamples.pointAndText,
  ],
}
withPointAndTextLayersStory.argTypes = defaultArgTypes
withPointAndTextLayersStory.parameters = {
  storyshots: false,
}

export const withLineStringLayerStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    template: '<Map :options="JSON.parse(options)" :resources="resources" />',
  }
}

withLineStringLayerStory.storyName = 'with LineString layer'
withLineStringLayerStory.args = {
  resources: [
    resourcesExamples.lineString,
  ],
}
withLineStringLayerStory.argTypes = defaultArgTypes
withLineStringLayerStory.parameters = {
  storyshots: false,
}

export const withPolygonLayerStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    template: '<Map :options="JSON.parse(options)" :resources="resources" />',
  }
}

withPolygonLayerStory.storyName = 'with Polygon layer'
withPolygonLayerStory.args = {
  resources: [
    resourcesExamples.polygon,
  ],
}
withPolygonLayerStory.argTypes = defaultArgTypes
withPolygonLayerStory.parameters = {
  storyshots: false,
}

export const withMultipleSourcesAndLayersStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    template: '<Map :options="JSON.parse(options)" :resources="resources" />',
  }
}

withMultipleSourcesAndLayersStory.storyName = 'with multiple sources and layers'
withMultipleSourcesAndLayersStory.args = {
  resources: Object.values(resourcesExamples),
}
withMultipleSourcesAndLayersStory.argTypes = defaultArgTypes
withMultipleSourcesAndLayersStory.parameters = {
  storyshots: false,
}

export const withCustomOptionsStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    template: '<Map :options="JSON.parse(options)" :resources="resources" />',
  }
}

withCustomOptionsStory.storyName = 'with custom options'
withCustomOptionsStory.args = {
  resources: [],
}
withCustomOptionsStory.argTypes = {
  options: {
    control: {
      type: 'select',
      options: [
        JSON.stringify({
          ...optionsWithoutBackgroundTiles,
          center: [2, 46],
          zoom: 8,
        }),
        JSON.stringify({
          ...optionsWithBackgroundTiles,
          center: [-20, 46],
          zoom: 8,
        }),
      ],
    },
    defaultValue: JSON.stringify({ ...optionsWithBackgroundTiles, center: [2, 46], zoom: 8 }),
  },
}
withCustomOptionsStory.parameters = {
  storyshots: false,
}

// EDITABLE POINT
export const withEditablePointLayerStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    methods: {
      update: action('update'),
      remove: action('remove'),
      select: action('select'),
    },
    template: `
    <Map
      :options="JSON.parse(options)"
      :resources="resources"
      :singleEditMode="true"
      @update-features="this.update"
      @remove-features="this.remove"
      @select-feature="this.select"
    />
    `,
  }
}

withEditablePointLayerStory.storyName = 'with editable GEOMETRY_POINT'
withEditablePointLayerStory.args = {
  resources: [
    {
      id: 'features-type-point-source-id',
      editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_POINT]),
      selectable: true,
      features: [
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.POINT,
            coordinates: [-40, 40],
          },
          properties: {},
        },
      ],
      layers: [
        {
          id: 'features-type-fill-layer-id',
          type: 'fill',
          paint: { 'fill-color': 'transparent' },
        },
      ],
    },
  ],
}
withEditablePointLayerStory.argTypes = defaultArgTypes
withEditablePointLayerStory.parameters = {
  storyshots: false,
}

// EDITABLE LINESTRING
export const withEditableLinestringLayerStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    methods: {
      update: action('update'),
      remove: action('remove'),
      select: action('select'),
    },
    template: `
    <Map
      :options="JSON.parse(options)"
      :resources="resources"
      :singleEditMode="true"
      @update-features="this.update"
      @remove-features="this.remove"
      @select-feature="this.select"
    />
    `,
  }
}

withEditableLinestringLayerStory.storyName = 'with editable GEOMETRY_LINESTRING'
withEditableLinestringLayerStory.args = {
  resources: [
    {
      id: 'features-type-point-source-id',
      editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_LINESTRING]),
      selectable: true,
      features: [],
      layers: [
        {
          id: 'features-type-fill-layer-id',
          type: 'fill',
          paint: { 'fill-color': 'transparent' },
        },
      ],
    },
  ],
}
withEditableLinestringLayerStory.argTypes = defaultArgTypes
withEditableLinestringLayerStory.parameters = {
  storyshots: false,
}

// EDITABLE LINESTRING
export const withEditablePolygonLayerStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    methods: {
      update: action('update'),
      remove: action('remove'),
      select: action('select'),
    },
    template: `
    <Map
      :options="JSON.parse(options)"
      :resources="resources"
      :singleEditMode="true"
      @update-features="this.update"
      @remove-features="this.remove"
      @select-feature="this.select"
    />
    `,
  }
}

withEditablePolygonLayerStory.storyName = 'with editable GEOMETRY_POLYGON'
withEditablePolygonLayerStory.args = {
  resources: [
    {
      id: 'features-type-point-source-id',
      editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_POLYGON]),
      selectable: true,
      features: [],
      layers: [
        {
          id: 'features-type-fill-layer-id',
          type: 'fill',
          paint: { 'fill-color': 'transparent' },
        },
      ],
    },
  ],
}
withEditablePolygonLayerStory.argTypes = defaultArgTypes
withEditablePolygonLayerStory.parameters = {
  storyshots: false,
}

// EDITABLE MULTIPOINT
export const withEditableMultiPointLayerStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    methods: {
      update: action('update'),
      remove: action('remove'),
      select: action('select'),
    },
    template: `
    <Map
      :options="JSON.parse(options)"
      :resources="resources"
      :singleEditMode="true"
      @update-features="this.update"
      @remove-features="this.remove"
      @select-feature="this.select"
    />
    `,
  }
}

withEditableMultiPointLayerStory.storyName = 'with editable GEOMETRY_MULTIPOINT'
withEditableMultiPointLayerStory.args = {
  resources: [
    {
      id: 'features-type-point-source-id',
      editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_MULTIPOINT]),
      selectable: true,
      features: [
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POINT,
            coordinates: [[-20, 20], [-40, 40]],
          },
          properties: {},
        },
      ],
      layers: [
        {
          id: 'features-type-fill-layer-id',
          type: 'fill',
          paint: { 'fill-color': 'transparent' },
        },
      ],
    },
  ],
}
withEditableMultiPointLayerStory.argTypes = defaultArgTypes
withEditableMultiPointLayerStory.parameters = {
  storyshots: false,
}

// EDITABLE MULTYPOLYGON
export const withEditableMultiPolygonLayerStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    methods: {
      update: action('update'),
      remove: action('remove'),
      select: action('select'),
    },
    template: `
    <Map
      :options="JSON.parse(options)"
      :resources="resources"
      :singleEditMode="true"
      @update-features="this.update"
      @remove-features="this.remove"
      @select-feature="this.select"
    />
    `,
  }
}

withEditableMultiPolygonLayerStory.storyName = 'with editable GEOMETRY_MULTIPOLYGON'
withEditableMultiPolygonLayerStory.args = {
  resources: [
    {
      id: 'features-type-point-source-id',
      editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_MULTIPOLYGON]),
      selectable: true,
      features: [
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POLYGON,
            coordinates: [[[[-40, 40], [-50, 48], [-50, 34], [-40, 40]]]],
          },
          properties: {},
        },
      ],
      layers: [
        {
          id: 'features-type-fill-layer-id',
          type: 'fill',
          paint: { 'fill-color': 'transparent' },
        },
      ],
    },
  ],
}
withEditableMultiPolygonLayerStory.argTypes = defaultArgTypes
withEditableMultiPolygonLayerStory.parameters = {
  storyshots: false,
}

// EMPTY EDITABLE
export const withEditableEmptyStory = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    methods: {
      update: action('update'),
      remove: action('remove'),
      select: action('select'),
    },
    template: `
    <Map
      :options="JSON.parse(options)"
      :resources="resources"
      :singleEditMode="true"
      @update-features="this.update"
      @remove-features="this.remove"
      @select-feature="this.select"
    />
    `,
  }
}

withEditableEmptyStory.storyName = 'with editable empty set'
withEditableEmptyStory.args = {
  resources: [mockResources[4]],
}
withEditableEmptyStory.argTypes = defaultArgTypes
withEditableEmptyStory.parameters = {
  storyshots: false,
}

// MULTIPLE RESOURCES
// TODO: this case is not correctly render
// because controls status is set globally and should not allowed multiple points
export const withMultipleResources = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    methods: {
      update: action('update'),
      remove: action('remove'),
      select: action('select'),
    },
    template: `
    <Map
      :options="JSON.parse(options)"
      :resources="resources"
      :singleEditMode="true"
      @update-features="this.update"
      @remove-features="this.remove"
      @select-feature="this.select"
    />
    `,
  }
}

withMultipleResources.storyName = 'with multiple resources'
withMultipleResources.args = {
  resources: [
    {
      id: 'features-type-point-source-id',
      editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_POINT]),
      selectable: true,
      features: [
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.POINT,
            coordinates: [-40, 40],
          },
          properties: {},
        },
      ],
      layers: [
        {
          id: 'features-type-fill-layer-id',
          type: 'fill',
          paint: { 'fill-color': 'transparent' },
        },
      ],
    },
    {
      id: 'multipolygon',
      editableGeometryTypes: new Set([COLUMN_TYPE.GEOMETRY_MULTIPOLYGON]),
      selectable: true,
      popupMode: 'hover',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POLYGON,
            coordinates: [[[[-40, 40], [-50, 48], [-50, 34], [-40, 40]]]],
          },
          properties: {
            title: 'Polygon',
          },
        },
      ],
      layers: [
        {
          id: 'multipolygon',
          type: 'fill',
          paint: { 'fill-color': 'transparent' },
        },
      ],
    },
  ],
}
withMultipleResources.argTypes = defaultArgTypes
withMultipleResources.parameters = {
  storyshots: false,
}

// MULTIPLE SINGLE POINTS
export const withMultiplePointResources = (args, { argTypes }) => {
  return {
    components: { Map },
    props: Object.keys(argTypes),
    methods: {
      update: action('update'),
      remove: action('remove'),
      select: action('select'),
    },
    template: `
    <Map
      :options="JSON.parse(options)"
      :resources="resources"
      :singleEditMode="true"
      @update-features="this.update"
      @remove-features="this.remove"
      @select-feature="this.select"
    />
    `,
  }
}

withMultiplePointResources.storyName = 'with multiple GEOMETRY_POINT'
withMultiplePointResources.args = {
  resources: [mockResources[5]],
}
withMultiplePointResources.argTypes = defaultArgTypes
withMultiplePointResources.parameters = {
  storyshots: false,
}
