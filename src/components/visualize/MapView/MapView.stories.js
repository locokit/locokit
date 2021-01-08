import MapView from './MapView'

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
  component: MapView
}

export const withPointLayerStory = () => ({
  components: { MapView },
  data () {
    return {
      block: {
        resources: [
          {
            ...resourcesExamples.pointAndText,
            layers: [resourcesExamples.pointAndText.layers[0]]
          }
        ]
      }
    }
  },
  template: '<MapView v-bind="{...block}" />'
})

withPointLayerStory.storyName = 'with Point layer'

export const withPointAndTextLayersStory = () => ({
  components: { MapView },
  data () {
    return {
      block: {
        resources: [
          resourcesExamples.pointAndText
        ]
      }
    }
  },
  template: '<MapView v-bind="{...block}" />'
})

withPointAndTextLayersStory.storyName = 'with Point and Text layers'

export const withLineStringLayerStory = () => ({
  components: { MapView },
  data () {
    return {
      block: {
        resources: [
          resourcesExamples.lineString
        ]
      }
    }
  },
  template: '<MapView v-bind="{...block}" />'
})

withLineStringLayerStory.storyName = 'with LineString layer'

export const withPolygonLayerStory = () => ({
  components: { MapView },
  data () {
    return {
      block: {
        resources: [
          resourcesExamples.polygon
        ]
      }
    }
  },
  template: '<MapView v-bind="{...block}" />'
})

withPolygonLayerStory.storyName = 'with Polygon layer'

export const withMultipleSourcesAndLayersStory = () => ({
  components: { MapView },
  data () {
    return {
      block: {
        resources: Object.values(resourcesExamples)
      }
    }
  },
  template: '<MapView v-bind="{...block}" />'
})

withMultipleSourcesAndLayersStory.storyName = 'with multiple sources and layers'

export const withCustomOptionsStory = () => ({
  components: { MapView },
  data () {
    return {
      block: {
        options: {
          zoom: 10
        },
        resources: []
      }
    }
  },
  template: '<MapView v-bind="{...block}" />'
})

withCustomOptionsStory.storyName = 'with custom options'
