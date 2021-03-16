<template>
  <div
    class="p-fluid p-pb-6 p-pt-4"
    v-if="row"
  >
    <h3
      v-if="title"
      class="lck-block-title"
    >
      {{ title }}
    </h3>
    <div
      class="p-field"
      v-for="column in definition.columns"
      :key="column.id"
    >
      <label
        class="lck-color-subtitle"
        :for="column.id"
      >
        {{ column.text }}
      </label>

      <div
        v-if="editableColumns.indexOf(column) > -1"
        class="form-field-editable"
      >
        <lck-autocomplete
          v-if="getComponentEditableColumn(column.column_type_id) === 'lck-autocomplete'"
          :id="column.id"
          :placeholder="$t('components.datatable.placeholder')"
          field="label"
          :suggestions="autocompleteSuggestions"
          @search="onComplete(column, $event)"
          v-model="autocompleteInput[column.id]"
          @item-select="onAutocompleteEdit(row.id, column.id, $event)"
          @clear="onAutocompleteEdit(row.id, column.id, null)"
        />
        <lck-multi-autocomplete
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'lck-multi-autocomplete'"
          :id="column.id"
          field="label"
          :suggestions="autocompleteSuggestions"
          v-model="multipleAutocompleteInput[column.id]"
          @search="onComplete(column, $event)"
          @item-select="onMultipleAutocompleteEdit(row.id, column.id)"
          @item-unselect="onMultipleAutocompleteEdit(row.id, column.id)"
        />
        <p-dropdown
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-dropdown'"
          :id="column.id"
          :options="columnsEnhanced[column.id].dropdownOptions"
          optionLabel="label"
          optionValue="value"
          :showClear="true"
          :placeholder="$t('components.datatable.placeholder')"
          v-model="row.data[column.id]"
          @input="onEdit(row.id, column.id, $event)"
        />
        <lck-multiselect
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'lck-multiselect'"
          :id="column.id"
          :options="columnsEnhanced[column.id].dropdownOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('components.datatable.placeholder')"
          v-model="row.data[column.id]"
          @input="onEdit(row.id, column.id, $event)"
        />
        <p-calendar
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-calendar'"
          :id="column.id"
          :dateFormat="$t('date.dateFormatPrime')"
          v-model="row.data[column.id]"
          @input="onDateEdit(row.id, column.id, $event)"
          appendTo="body"
        />
        <p-input-number
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-input-float'"
          v-model="row.data[column.id]"
          @blur="onEdit(row.id, column.id, row.data[column.id])"
          mode="decimal"
          :minFractionDigits="2"
        />
        <div
          v-else-if="getComponentEditableColumn(column.column_type_id) === 'lck-map'"
        >
          <lck-map
            v-if="row.data[column.id]"
            class="field-map"
            forceResize
            :resources="setRessources(column, row.data[column.id])"
            :options="setOptions(row.data[column.id])"
          />
          <span v-else>{{ $t('components.mapview.noData') }}</span>
        </div>
        <component
          v-else
          :is="getComponentEditableColumn(column.column_type_id)"
          :id="column.id"
          v-model="row.data[column.id]"
          @blur="onEdit(row.id, column.id, row.data[column.id])"
        />
      </div>

      <div
        v-else
        class="p-fluid p-inputtext p-component non-editable-field"
      >
        {{ getColumnDisplayValue(column, row.data[column.id]) }}
      </div>
    </div>
  </div>
  <div v-else>
    {{ $t('components.datadetail.nodata') }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { formatISO } from 'date-fns'
import GeoJSON from 'ol/format/GeoJSON'

import Dropdown from 'primevue/dropdown'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'

import {
  COLUMN_TYPE
} from '@locokit/lck-glossary'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import MultiAutoComplete from '@/components/ui/MultiAutoComplete/MultiAutoComplete.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import InputURL from '@/components/ui/InputURL/InputURL.vue'
import Map from '@/components/ui/Map/Map.vue'

import {
  getComponentEditableColumn,
  isEditableColumn
} from '@/services/lck-utils/columns'
import { lckHelpers } from '@/services/lck-api'
import { zipArrays } from '@/services/lck-utils/arrays'
import {
  GEO_STYLE,
  transformEWKTtoFeature,
  computeCenterFeatures
} from '@/services/lck-utils/map'
import {
  LckTableColumn,
  LckTableRow,
  LckTableViewColumn
} from '@/services/lck-api/definitions'

export default {
  name: 'LckDataDetail',
  props: {
    autocompleteSuggestions: {
      type: Array
    },
    row: {
      type: Object,
      required: false
    },
    definition: {
      type: Object as () => { columns: LckTableViewColumn[] },
      required: false,
      default: () => ({ columns: [] })
    },
    crudMode: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      autocompleteInput: {} as Record<string, any>,
      multipleAutocompleteInput: {} as Record<string, any>
    }
  },
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-multi-autocomplete': MultiAutoComplete,
    'lck-filter-button': FilterButton,
    'lck-multiselect': MultiSelect,
    'lck-input-url': InputURL,
    'lck-map': Map,
    'p-dialog': Vue.extend(Dialog),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-calendar': Vue.extend(Calendar),
    'p-toolbar': Vue.extend(Toolbar),
    'p-button': Vue.extend(Button)
  },
  computed: {
    editableColumns (): LckTableViewColumn[] {
      if (!this.definition.columns) return []
      return this.definition.columns.filter(column => this.isEditableColumn(this.crudMode, column))
    },
    columnsEnhanced (): Record<string, any> {
      if (!this.definition.columns) return {}
      const result: Record<string, any> = {}
      this.definition.columns.forEach(currentColumn => {
        result[currentColumn.id] = {
          // eslint-disable-next-line @typescript-eslint/camelcase
          column_type_id: currentColumn.column_type_id
        }
        if (
          currentColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
          currentColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
        ) {
          const values = currentColumn?.settings?.values
          if (values) {
            result[currentColumn.id].dropdownOptions = Object.keys(values).map(key => ({
              value: key,
              label: values[key].label
            }))
          }
        }
      })
      return result
    }
  },
  methods: {
    getComponentEditableColumn,
    isEditableColumn,
    transformEWKTtoFeature,
    computeCenterFeatures,
    getColumnDisplayValue: lckHelpers.getColumnDisplayValue,
    onComplete (
      { column_type_id: columnTypeId, settings }: LckTableViewColumn,
      { query }: { query: string }
    ) {
      this.$emit(
        'update-suggestions', {
          columnTypeId: columnTypeId,
          settings
        }, { query })
    },
    async onAutocompleteEdit (rowId: string, columnId: string, event: { value: { value: string } } | null = null) {
      await this.onEdit(rowId, columnId, event ? event.value.value : null)
    },
    async onMultipleAutocompleteEdit (rowId: string, columnId: string) {
      await this.onEdit(rowId, columnId, this.multipleAutocompleteInput[columnId].map((item: { value: string }) => item.value))
    },
    async onDateEdit (rowId: string, columnId: string, value: Date | null) {
      await this.onEdit(
        rowId,
        columnId,
        value ? formatISO(value, { representation: 'date' }) : null
      )
    },
    async onEdit (rowId: string, columnId: string, value: string | null) {
      this.$emit('update-row', {
        rowId,
        columnId,
        newValue: value
      })
    },
    createStyleLayers ({ column_type_id: columnTypeId }: { column_type_id: number }) {
      const layers: { id: string; type: string; paint: object }[] = []

      switch (columnTypeId) {
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
      return layers
    },
    createGeoJsonFeaturesCollection (data: string) {
      // This is necessary when column's type is Multi...
      const features = []
      if (data) {
        const feature = this.transformEWKTtoFeature(data)
        features.push(feature)
      }
      // Transform OL Feature in Geojson
      const geojsonFormat = new GeoJSON()
      return geojsonFormat.writeFeaturesObject(features)
    },
    setRessources (column: LckTableColumn, data: string) {
      const layers = this.createStyleLayers(column)
      const features = this.createGeoJsonFeaturesCollection(data)
      return [
        {
          id: `features-collection-source-id-${column.id}`,
          layers: layers,
          ...features
        }
      ]
    },
    setOptions (data: string) {
      const geojson = this.createGeoJsonFeaturesCollection(data)
      const centerFeaturesCollection = this.computeCenterFeatures(geojson)

      return {
        center: centerFeaturesCollection?.geometry?.coordinates,
        zoom: 9,
        maxZoom: 16,
        minZoom: 1
      }
    }
  },
  watch: {
    row: {
      handler (newRef: LckTableRow, oldRef: LckTableRow|undefined) {
        if (newRef !== oldRef) {
          /**
           * we go through every data prop,
           * and init the autocompleteInput if needed
          */
          if (newRef.data) {
            this.autocompleteInput = {}
            this.multipleAutocompleteInput = {}
            Object.keys(newRef.data).forEach((columnId) => {
              // Allow to ignore lookup column
              if (this.columnsEnhanced[columnId]) {
                const currentColumnDefinition = this.columnsEnhanced[columnId]
                switch (currentColumnDefinition.column_type_id) {
                  case COLUMN_TYPE.USER:
                  case COLUMN_TYPE.GROUP:
                  case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                    this.$set(this.autocompleteInput, columnId, newRef.data[columnId]?.value || null)
                    break
                  case COLUMN_TYPE.MULTI_USER:
                    this.$set(
                      this.multipleAutocompleteInput,
                      columnId,
                      zipArrays(newRef.data[columnId]?.reference, newRef.data[columnId]?.value, 'value', 'label')
                    )
                    break
                }
              }
            })
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.form-field-editable > div > #map-container {
  height: 30vh;
}

.non-editable-field {
  height: 2.5rem;
  border: unset;
  background-color: transparent;
  padding-left: unset;
}
</style>
