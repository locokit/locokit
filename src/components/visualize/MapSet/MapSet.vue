<template>
  <div class="h-full p-d-flex p-flex-column">
    <div style="text-align:center">
      <p-button
        v-if="addAllowed"
        :label="addButtonTitle"
        icon="pi pi-plus-circle"
        class="p-m-2"
        @click="onClickAddButton"
      />
    </div>

    <lck-map
      v-if="this.hasRightConfiguration && resources"
      :defaultSelectedFeatureBySource="selectedFeatureBySource"
      :id="`block-map-view-${id}`"
      :resources="resources"
      style="min-height: 50vh"
      @select-feature="onSelectFeature"
      v-on="$listeners"
    />
    <span v-else>{{ $t('components.mapview.noGeoData') }}</span>

    <lck-dialog-form
      v-if="displayNewDialog"
      :visible.sync="displayNewDialog"
      :header="addDialogHeader"
      :submitting="submitting.inProgress"
      @close="displayNewDialog = false"
      @input="handleSubmitCreateRow"
    >
      <lck-data-detail
        :crudMode="false"
        :definition="filteredDefinitionColumns"
        :row="newRow"
        mode="creation"
        :autocompleteSuggestions="$attrs['autocompleteSuggestions']"
        :secondarySources="$attrs['secondarySources']"
        :workspaceId="workspaceId"
        @get-secondary-sources="$listeners['get-secondary-sources']"
        @remove-attachment="onRemoveAttachment"
        @update-suggestions="$listeners['update-suggestions']"
        @update-row="onUpdateRow"
        @upload-files="onUploadFiles"
      />
    </lck-dialog-form>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { COLUMN_TYPE, MapSettings } from '@locokit/lck-glossary'

import { EmittedBlockEvent, LckTableRow, LckTableRowData, LckTableRowDataComplex, LckTableView } from '@/services/lck-api/definitions'
import {
  getLckGeoResources,
  LckGeoResource,
} from '@/services/lck-utils/map/transformWithOL'

import CommunicatingBlock from '@/components/visualize/Block/CommunicatingBlock'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import eventHub from '@/services/lck-event-hub/eventHub'
import { GeoJSONFeature } from 'ol/format/GeoJSON'

import { MapboxGeoJSONFeature } from 'mapbox-gl'
import Button from 'primevue/button'
import { READ_ONLY_COLUMNS_TYPES } from '@/services/lck-utils/columns'

export default Vue.extend({
  name: 'MapSet',
  components: {
    'lck-map': () => import(/* webpackChunkName: "lck-map-with-mapbox" */'@/components/ui/ColumnType/Geometry/Map.vue'),
    'lck-data-detail': DataDetail,
    'lck-dialog-form': DialogForm,
    'p-button': Vue.extend(Button),
  },
  mixins: [CommunicatingBlock],
  props: {
    id: {
      type: String,
    },
    definition: {
      type: Object as PropType<Record<string, LckTableView>>,
    },
    content: {
      type: Object as PropType<Record<string, LckTableRow[] | null>>,
    },
    settings: {
      type: Object as PropType<MapSettings>,
    },
    submitting: {
      type: Object, // Submitting type : { inProgress: boolean, errors?: Errors[] }
      default: () => ({ inProgress: false }),
    },
    workspaceId: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      displayNewDialog: false,
      newRow: {} as Partial<LckTableRow>,
      selectedFeatureBySource: {} as Record<string, {
        feature: GeoJSONFeature;
        centerToFeature?: boolean;
        zoomLevel?: number;
      } | null>,
    }
  },
  computed: {
    addAllowed (): boolean {
      return this.settings.addAllowed === true
    },
    addButtonTitle (): string {
      return this.settings.addButtonTitle || this.$t('form.add') as string
    },
    addDialogHeader (): string {
      return this.settings.addButtonTitle || this.$t('components.datatable.addNewRow') as string
    },
    mapSourcesIds (): string[] {
      return this.settings.sources.map(source => source.id)
    },
    hasRightConfiguration (): boolean {
      return this.mapSourcesIds.length > 0 && this.mapSourcesIds.every((sourceId: string) =>
        this.definition[sourceId] && this.content[sourceId],
      )
    },
    resources (): LckGeoResource[] {
      if (!this.hasRightConfiguration) return []
      return getLckGeoResources(
        this.definition,
        this.content as Record<string, LckTableRow[]>,
        this.settings,
        {
          noReference: this.$t('components.mapview.noReference'),
          noData: this.$t('components.mapview.noRowData'),
          dateFormat: this.$t('date.dateFormat'),
          datetimeFormat: this.$t('date.datetimeFormat'),
        },
      )
    },
    filteredDefinitionColumns (): Partial<LckTableView> {
      if (!this.settings.addSourceId) return { columns: [] }
      const currentDefinition = this.definition[this.settings.addSourceId]
      return {
        columns: currentDefinition?.columns?.filter((column) =>
          !READ_ONLY_COLUMNS_TYPES.has(column.column_type_id)
        ) || [],
      }
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
    onSelectBlockEvent (columnId: string | undefined, eventData: EmittedBlockEvent, triggerBlockId: string, catchEventIndex: number) {
      // Catch an event coming from another block : must receive a row reference to select the related feature
      if (columnId) {
        const reference: LckTableRowData | undefined = (eventData.originalValue as LckTableRowDataComplex)?.reference || eventData.originalValue
        if (!reference) return this.onResetBlockEvent(columnId, triggerBlockId)
        const geoResources = this.resources.filter(r => r.caughtEvents?.includes(triggerBlockId))
        geoResources.forEach(geoResource => {
          const feature = geoResource.features.find(feature => feature.id === `${reference}:${columnId}`)
          this.$set(this.selectedFeatureBySource, geoResource.id, {
            feature,
            centerToFeature: this.settings.caughtEvents?.[triggerBlockId][catchEventIndex].centerToFeature,
            zoomLevel: this.settings.caughtEvents?.[triggerBlockId][catchEventIndex].zoomLevel,
          })
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
    async onUpdateRow ({ columnId, newValue }: { columnId: string; newValue: unknown}) {
      this.$set(this.newRow.data as LckTableRow['data'], columnId, newValue)
    },
    onClickAddButton () {
      this.newRow = {
        data: {},
      }
      // eslint-disable-next-line no-unused-expressions
      this.filteredDefinitionColumns.columns?.forEach(c => {
        if (
          c.column_type_id === COLUMN_TYPE.SINGLE_SELECT &&
          c.settings?.default
        ) {
          this.$set(this.newRow.data as LckTableRow['data'], c.id, c.settings.default)
        }
      })
      this.displayNewDialog = true
    },
    handleSubmitCreateRow () {
      this.$emit('create-row', this.newRow)
    },
    onUploadFiles (event: object) {
      this.$emit('upload-files', {
        ...event,
        newRow: this.newRow,
      })
    },
    onRemoveAttachment (event: object) {
      this.$emit('remove-attachment', {
        ...event,
        newRow: this.newRow,
      })
    },
  },
})
</script>
