import MapView from './MapView'

const optionsWithoutBackgroundTiles = {
  style: {
    version: 8,
    sources: {},
    glyphs: '/fonts/{fontstack}/{range}.pbf',
    layers: []
  }
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
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256
      }
    },
    glyphs: '/fonts/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'tiles-background',
        type: 'raster',
        source: 'tiles-background',
        minzoom: 0,
        maxzoom: 17
      }
    ]
  }
}

const resourcesExamples = {
  pointAndText: {
    id: 'features-type-point-source-id',
    features: [
      {
        type: 'feature',
        geometry: {
          type: 'Point',
          coordinates: [2, 46]
        },
        properties: {}
      }
    ],
    layers: [
      {
        id: 'features-type-circle-layer-id',
        type: 'circle',
        paint: { 'circle-radius': 15, 'circle-color': '#53ACB4' }
      },
      {
        id: 'features-type-symbol-layer-id',
        type: 'symbol',
        paint: { 'text-color': '#FFFFFF' },
        layout: { 'text-field': '1', 'text-font': ['Open Sans Regular'] }
      }
    ]
  },
  lineString: {
    id: 'features-type-linestring-source-id',
    features: [
      {
        type: 'feature',
        geometry: {
          type: 'LineString',
          coordinates: [[-20, 46], [-40, 48]]
        },
        properties: {}
      }
    ],
    layers: [
      {
        id: 'features-type-line-layer-id',
        type: 'line',
        paint: { 'line-width': 15, 'line-color': '#53ACB4' }
      }
    ]
  },
  polygon: {
    id: 'features-type-polygon-source-id',
    features: [
      {
        type: 'feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[-40, 40], [-50, 48], [-50, 34], [-40, 40]]]
        },
        properties: {}
      }
    ],
    layers: [
      {
        id: 'features-type-fill-layer-id',
        type: 'fill',
        paint: { 'fill-color': '#53ACB4' }
      }
    ]
  }
}

export default {
  title: 'components/visualize/MapView',
  component: MapView,
  argTypes: {
    timeoutBeforeScreenshot: {
      table: {
        disable: true
      }
    }
  }
}

export const withPointLayerStory = (args, { argTypes }) => {
  return {
    components: { MapView },
    props: Object.keys(argTypes),
    template: '<MapView :options="JSON.parse(options)" :resources="resources" />'
  }
}

withPointLayerStory.storyName = 'with Point layer'
withPointLayerStory.args = {
  resources: [
    {
      ...resourcesExamples.pointAndText,
      layers: [resourcesExamples.pointAndText.layers[0]]
    }
  ]
}
withPointLayerStory.argTypes = {
  options: { control: { type: 'select', options: [JSON.stringify(optionsWithoutBackgroundTiles), JSON.stringify(optionsWithBackgroundTiles)] }, defaultValue: JSON.stringify(optionsWithoutBackgroundTiles) }
}
withPointLayerStory.parameters = {
  storyshots: false
}

export const withPointAndTextLayersStory = (args, { argTypes }) => {
  return {
    components: { MapView },
    props: Object.keys(argTypes),
    template: '<MapView :options="JSON.parse(options)" :resources="resources" />'
  }
}

withPointAndTextLayersStory.storyName = 'with Point and Text layers'
withPointAndTextLayersStory.args = {
  resources: [
    resourcesExamples.pointAndText
  ]
}
withPointAndTextLayersStory.argTypes = {
  options: { control: { type: 'select', options: [JSON.stringify(optionsWithoutBackgroundTiles), JSON.stringify(optionsWithBackgroundTiles)] }, defaultValue: JSON.stringify(optionsWithoutBackgroundTiles) }
}
withPointAndTextLayersStory.parameters = {
  storyshots: false
}

export const withLineStringLayerStory = (args, { argTypes }) => {
  return {
    components: { MapView },
    props: Object.keys(argTypes),
    template: '<MapView :options="JSON.parse(options)" :resources="resources" />'
  }
}

withLineStringLayerStory.storyName = 'with LineString layer'
withLineStringLayerStory.args = {
  resources: [
    resourcesExamples.lineString
  ]
}
withLineStringLayerStory.argTypes = {
  options: { control: { type: 'select', options: [JSON.stringify(optionsWithoutBackgroundTiles), JSON.stringify(optionsWithBackgroundTiles)] }, defaultValue: JSON.stringify(optionsWithoutBackgroundTiles) }
}
withLineStringLayerStory.parameters = {
  storyshots: false
}

export const withPolygonLayerStory = (args, { argTypes }) => {
  return {
    components: { MapView },
    props: Object.keys(argTypes),
    template: '<MapView :options="JSON.parse(options)" :resources="resources" />'
  }
}

withPolygonLayerStory.storyName = 'with Polygon layer'
withPolygonLayerStory.args = {
  resources: [
    resourcesExamples.polygon
  ]
}
withPolygonLayerStory.argTypes = {
  options: { control: { type: 'select', options: [JSON.stringify(optionsWithoutBackgroundTiles), JSON.stringify(optionsWithBackgroundTiles)] }, defaultValue: JSON.stringify(optionsWithoutBackgroundTiles) }
}
withPolygonLayerStory.parameters = {
  storyshots: false
}

export const withMultipleSourcesAndLayersStory = (args, { argTypes }) => {
  return {
    components: { MapView },
    props: Object.keys(argTypes),
    template: '<MapView :options="JSON.parse(options)" :resources="resources" />'
  }
}

withMultipleSourcesAndLayersStory.storyName = 'with multiple sources and layers'
withMultipleSourcesAndLayersStory.args = {
  resources: Object.values(resourcesExamples)
}
withMultipleSourcesAndLayersStory.argTypes = {
  options: { control: { type: 'select', options: [JSON.stringify(optionsWithoutBackgroundTiles), JSON.stringify(optionsWithBackgroundTiles)] }, defaultValue: JSON.stringify(optionsWithoutBackgroundTiles) }
}
withMultipleSourcesAndLayersStory.parameters = {
  storyshots: false
}

export const withCustomOptionsStory = (args, { argTypes }) => {
  return {
    components: { MapView },
    props: Object.keys(argTypes),
    template: '<MapView :options="JSON.parse(options)" :resources="resources" />'
  }
}

withCustomOptionsStory.storyName = 'with custom options'
withCustomOptionsStory.args = {
  resources: []
}
withCustomOptionsStory.argTypes = {
  options: { control: { type: 'select', options: [JSON.stringify({ ...optionsWithoutBackgroundTiles, center: [2, 46], zoom: 8 }), JSON.stringify({ ...optionsWithBackgroundTiles, center: [-20, 46], zoom: 8 })] }, defaultValue: JSON.stringify({ ...optionsWithoutBackgroundTiles, center: [2, 46], zoom: 8 }) }
}
withCustomOptionsStory.parameters = {
  storyshots: false
}
