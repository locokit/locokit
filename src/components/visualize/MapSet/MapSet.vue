<template>
  <lck-map
    v-if="this.hasRightConfiguration && resources"
    :defaultSelectedFeatureBySource="selectedFeatureBySource"
    :hasPopup="hasPopup"
    :id="`block-map-view-${id}`"
    :resources="resources"
    style="min-height: 50vh"
    @select-feature="onSelectFeature"
    v-on="$listeners"
  />
  <span v-else>{{ $t('components.mapview.noGeoData') }}</span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { MapSettings } from '@locokit/lck-glossary'

import { EmittedBlockEvent, LckTableRow, LckTableRowData, LckTableRowDataComplex, LckTableView } from '@/services/lck-api/definitions'
import {
  getLckGeoResources,
  LckGeoResource,
} from '@/services/lck-utils/map/transformWithOL'

import CommunicatingBlock from '../Block/CommunicatingBlock'
import { MapboxGeoJSONFeature } from 'mapbox-gl'
import eventHub from '@/services/lck-event-hub/eventHub'

// Dynamic import
const Map = () => import(/* webpackChunkName: "lck-map-with-mapbox" */'@/components/ui/ColumnType/Geometry/Map.vue')

export default Vue.extend({
  name: 'MapSet',
  components: {
    'lck-map': Map,
  },
  mixins: [CommunicatingBlock],
  data () {
    return {
      selectedFeatureBySource: {
      } as Record<string, string>,
    }
  },
  props: {
    id: {
      type: String,
    },
    definition: {
      type: Object as PropType<Record<string, LckTableView>>,
    },
    content: {
      type: Object as PropType<Record<string, LckTableRow[]>>,
    },
    settings: {
      type: Object as PropType<MapSettings>,
    },
  },
  computed: {
    hasRightConfiguration () {
      return this.definition && this.content && this.settings
    },
    resources (): LckGeoResource[] {
      if (!this.hasRightConfiguration) return []
      return getLckGeoResources(
        this.definition,
        this.content,
        this.settings,
        {
          noReference: this.$t('components.mapview.noReference'),
          noData: this.$t('components.mapview.noRowData'),
          dateFormat: this.$t('date.dateFormat'),
        },
      )
    },
    hasPopup (): boolean {
      return (
        this.resources.some(resource => resource.popupMode)
      )
    },
  },
  methods: {
    onSelectFeature (selectedFeature: MapboxGeoJSONFeature) {
      // Find the selected resource
      const selectedResource = this.resources.find(resource => resource.id === selectedFeature.source)
      if (selectedFeature.properties && selectedResource?.triggerEvents) {
        const { rowId, originalData, displayedData } = selectedFeature.properties
        // Parse JSON properties
        const parsedOriginalData = JSON.parse(originalData)
        const parsedDisplayedData = JSON.parse(displayedData)
        // Emits specified events
        selectedResource.triggerEvents.forEach(event => {
          if (event.type === 'selectRow') {
            // Relation between tables field
            eventHub.$emit(event.name, {
              originalValue: {
                reference: rowId,
                value: parsedOriginalData.text,
              },
              displayedValue: parsedDisplayedData.text,
            } as EmittedBlockEvent)
          } else if (event.type === 'selectField' && event.field) {
            // Single field
            eventHub.$emit(event.name, {
              originalValue: parsedOriginalData[event.field],
              displayedValue: parsedDisplayedData[event.field],
            } as EmittedBlockEvent)
          }
        })
      }
    },
    onSelectBlockEvent (columnId: string | undefined, eventData: EmittedBlockEvent, triggerBlockId: string) {
      // Catch an event coming from another block : must receive a row reference to select the related feature
      if (columnId) {
        const reference: LckTableRowData | undefined = (eventData.originalValue as LckTableRowDataComplex)?.reference || eventData.originalValue
        if (!reference) return this.onResetBlockEvent(columnId, triggerBlockId)
        const geoResources = this.resources.filter(r => r.caughtEvents?.includes(triggerBlockId))
        geoResources.forEach(geoResource => {
          this.$set(this.selectedFeatureBySource, geoResource.id, `${reference}:${columnId}`)
        })
      }
    },
    onResetBlockEvent (_: string | undefined, triggerBlockId: string) {
      // Catch an event coming from another block : unselect some features
      const geoResources = this.resources.filter(r => r.caughtEvents?.includes(triggerBlockId))
      geoResources.forEach(geoResource => {
        this.$set(this.selectedFeatureBySource, geoResource.id, null)
      })
    },
  },
})
</script>
