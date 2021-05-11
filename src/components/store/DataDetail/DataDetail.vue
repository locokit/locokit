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
          v-if="getComponentEditorDetailForColumnType(column) === 'lck-autocomplete'"
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
          v-else-if="getComponentEditorDetailForColumnType(column) === 'lck-multi-autocomplete'"
          :id="column.id"
          field="label"
          :suggestions="autocompleteSuggestions"
          v-model="multipleAutocompleteInput[column.id]"
          @search="onComplete(column, $event)"
          @item-select="onMultipleAutocompleteEdit(row.id, column.id)"
          @item-unselect="onMultipleAutocompleteEdit(row.id, column.id)"
        />
        <p-dropdown
          v-else-if="getComponentEditorDetailForColumnType(column) === 'p-dropdown'"
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
          v-else-if="getComponentEditorDetailForColumnType(column) === 'lck-multiselect'"
          :id="column.id"
          :options="columnsEnhanced[column.id].dropdownOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('components.datatable.placeholder')"
          v-model="row.data[column.id]"
          @input="onEdit(row.id, column.id, $event)"
        />
        <p-calendar
          v-else-if="getComponentEditorDetailForColumnType(column) === 'p-calendar'"
          :id="column.id"
          :dateFormat="$t('date.dateFormatPrime')"
          v-model="row.data[column.id]"
          @input="onDateEdit(row.id, column.id, $event)"
          appendTo="body"
        />
        <p-input-number
          v-else-if="getComponentEditorDetailForColumnType(column) === 'p-input-float'"
          v-model="row.data[column.id]"
          @blur="onEdit(row.id, column.id, row.data[column.id])"
          mode="decimal"
          :minFractionDigits="2"
        />

        <div v-else-if="getComponentEditorDetailForColumnType(column) === 'lck-map'" >
          <lck-map
            v-if="row.data[column.id]"
            mode="Dialog"
            :id="'map-edit-detail-' + column.id"
            :resources="getLckGeoResources(column, row.data[column.id])"
          />
          <span v-else>{{ $t('components.mapview.noData') }}</span>
        </div>
        <p-checkbox
          v-else-if="getComponentEditorDetailForColumnType(column) === 'p-checkbox'"
          v-model="row.data[column.id]"
          :id="column.id"
          :binary="true"
          @input="onEdit(row.id, column.id, row.data[column.id])"
        />
        <component
          v-else
          :is="getComponentEditorDetailForColumnType(column)"
          :id="column.id"
          v-model="row.data[column.id]"
          @blur="onEdit(row.id, column.id, row.data[column.id])"
        />
        <span
          class="saving-state"
          :class="getCellStateNotificationClass(row.id, column.id, cellState)"
        />
      </div>

      <div
        v-else
        class="p-fluid p-inputtext p-component non-editable-field"
      >
        <lck-map
          v-if="getComponentDisplayDetailForColumnType(column) === 'lck-map' && row.data[column.id]"
          mode="Dialog"
          :id="'map-display-detail-' + column.id"
          :resources="getLckGeoResources(column, getColumnDisplayValue(column, row.data[column.id]))"
          :options="{
            interactive: false
          }"
        />
        <p-checkbox
          v-else-if="getComponentDisplayDetailForColumnType(column) === 'p-checkbox'"
          :value="row.data[column.id]"
          :disabled="true"
        />
        <lck-badge
          v-else-if="getComponentDisplayDetailForColumnType(column) === 'lck-badge'"
          v-bind="getColumnDisplayValue(column, row.data[column.id])"
        />

        <span v-else>
          {{ getColumnDisplayValue(column, row.data[column.id]) }}
        </span>
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
import GeoJSON, { GeoJSONFeatureCollection } from 'ol/format/GeoJSON'
import Feature from 'ol/Feature'

import Dropdown from 'primevue/dropdown'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'

import {
  COLUMN_TYPE
} from '@locokit/lck-glossary'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import MultiAutoComplete from '@/components/ui/MultiAutoComplete/MultiAutoComplete.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import InputURL from '@/components/ui/InputURL/InputURL.vue'
import Map from '@/components/ui/Map/Map.vue'
import Badge from '@/components/ui/Badge/Badge.vue'

import {
  getColumnTypeId,
  getComponentEditorDetailForColumnType,
  getComponentDisplayDetailForColumnType,
  isEditableColumn,
  getColumnDisplayValue
} from '@/services/lck-utils/columns'

import { zipArrays } from '@/services/lck-utils/arrays'
import {
  transformEWKTtoFeature,
  getStyleLayers
} from '@/services/lck-utils/map'
import {
  LckTableColumn,
  LckTableRow,
  LckTableRowDataComplex,
  LCKTableRowMultiDataComplex,
  LckTableViewColumn
} from '@/services/lck-api/definitions'
import { getCellStateNotificationClass } from '@/services/lck-utils/notification'

export default {
  name: 'LckDataDetail',
  props: {
    autocompleteSuggestions: {
      type: Array //  as { label: string; value: number }[]
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
    },
    cellState: {
      type: Object,
      default: function () {
        return {
          rowId: null,
          columnId: null,
          waiting: false,
          isValid: null
        }
      }
    }
  },
  data () {
    return {
      COLUMN_TYPE,
      autocompleteInput: {} as Record<string, string>,
      // TODO: review with @alc why this type {value: number, label: string} (and why not value could not be a string)
      multipleAutocompleteInput: {} as Record<string, { value: number; label: string }[]>
    }
  },
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-multi-autocomplete': MultiAutoComplete,
    'lck-filter-button': FilterButton,
    'lck-multiselect': MultiSelect,
    'lck-input-url': InputURL,
    'lck-map': Map,
    'lck-badge': Badge,
    'p-dialog': Vue.extend(Dialog),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-calendar': Vue.extend(Calendar),
    'p-toolbar': Vue.extend(Toolbar),
    'p-button': Vue.extend(Button),
    'p-checkbox': Vue.extend(Checkbox)
  },
  computed: {
    editableColumns (): LckTableViewColumn[] {
      if (!this.definition.columns) return []
      return this.definition.columns.filter(column => this.isEditableColumn(this.crudMode, column))
    },
    columnsEnhanced (): Record<
        string,
        {
          column_type_id: COLUMN_TYPE;
          dropdownOptions?: {value: string; label: string}[];
        }
        > {
      if (!this.definition.columns) return {}
      const result: Record<
        string,
        {
          column_type_id: COLUMN_TYPE;
          dropdownOptions?: {value: string; label: string}[];
        }
      > = {}
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
    getCellStateNotificationClass,
    isEditableColumn,
    transformEWKTtoFeature,
    getColumnDisplayValue,
    isBooleanColumn (column: LckTableColumn) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.BOOLEAN:
          return true
        default:
          return false
      }
    },
    getComponentEditorDetailForColumnType (column: LckTableColumn) {
      return getComponentEditorDetailForColumnType(getColumnTypeId(column))
    },
    getComponentDisplayDetailForColumnType (column: LckTableColumn) {
      return getComponentDisplayDetailForColumnType(getColumnTypeId(column))
    },
    onComplete (
      { column_type_id: columnTypeId, settings }: LckTableViewColumn,
      { query }: { query: string }
    ) {
      this.$emit(
        'update-suggestions', {
          columnTypeId,
          settings
        }, { query })
    },
    async onAutocompleteEdit (rowId: string, columnId: string, event: { value: { value: string } } | null = null) {
      await this.onEdit(rowId, columnId, event ? event.value.value : null)
    },
    async onMultipleAutocompleteEdit (rowId: string, columnId: string) {
      await this.onEdit(
        rowId,
        columnId,
        this.multipleAutocompleteInput[columnId].map((item: { value: number }) => item.value)
      )
    },
    async onDateEdit (rowId: string, columnId: string, value: Date | null) {
      await this.onEdit(
        rowId,
        columnId,
        value ? formatISO(value, { representation: 'date' }) : null
      )
    },
    async onEdit (rowId: string, columnId: string, value: string | string[] | number[] | null) {
      this.$emit('update-row', {
        rowId,
        columnId,
        newValue: value
      })
    },
    getLckGeoResources (column: LckTableColumn, data: string) {
      const layers = getStyleLayers([column])
      function createGeoJsonFeaturesCollection (data: string): GeoJSONFeatureCollection {
      // This is necessary when column's type is Multi...
        const features: Feature[] = []
        if (data) {
          features.push(transformEWKTtoFeature(data))
        }
        // Transform OL Feature in Geojson
        const geojsonFormat = new GeoJSON()
        return geojsonFormat.writeFeaturesObject(features)
      }

      const features = createGeoJsonFeaturesCollection(data)
      return [
        {
          id: `features-collection-source-id-${column.id}`,
          layers,
          ...features
        }
      ]
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
              // Allow to ignore looked up column
              if (this.columnsEnhanced[columnId]) {
                const currentColumnDefinition = this.columnsEnhanced[columnId]
                switch (currentColumnDefinition.column_type_id) {
                  case COLUMN_TYPE.USER:
                  case COLUMN_TYPE.GROUP:
                  case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                    this.$set(
                      this.autocompleteInput,
                      columnId,
                      (newRef.data[columnId] as LckTableRowDataComplex)?.value || null)
                    break
                  case COLUMN_TYPE.MULTI_USER:
                    this.$set(
                      this.multipleAutocompleteInput,
                      columnId,
                      zipArrays(
                        (newRef.data[columnId] as LCKTableRowMultiDataComplex)?.reference as [],
                        (newRef.data[columnId] as LCKTableRowMultiDataComplex)?.value as [],
                        'value',
                        'label'
                      )
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

<style scoped>

/deep/ .p-checkbox .p-checkbox-box {
  border-color: var(--primary-color-lighten);
}

/deep/ .p-checkbox .p-checkbox-box.p-highlight {
  border-color: var(--primary-color-lighten);
  background: var(--primary-color-lighten);
}

/deep/ .p-checkbox .p-checkbox-box .p-checkbox-icon {
  color: var(--primary-color-darken) !important;
  font-weight: bold;
}

/deep/ .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover {
  border-color: var(--primary-color-darken);
  background: var(--primary-color-darken);
}

/deep/ .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover .p-checkbox-icon {
  color: var(--primary-color-lighten) !important;
}

.non-editable-field {
  border: unset;
  background-color: transparent;
  padding-left: unset;
}
.form-field-editable {
  position: relative;
  .saving-state {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    padding: 0.5rem;
    pointer-events: none;
    &.saving,
    &.saved {
      &:before {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        width: 100%;
        height: 2px;
        content: "";
      }
    }

    &.saved {
      padding-right: 20px;

      &.error {
        color: red;

        &:before {
          background-color: red;
        }

        &:after {
          position: absolute;
          top: 1px;
          right: 2px;
          bottom: 2px;
          display: inline-flex;
          float: right;
          width: 16px;
          padding: 0 5px;
          content: '';
          color: red;
          background-color: rgba(256, 256, 256, 0.8);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 485.811 485.811' enable-background='new 0 0 512 512'%3E%3Cpath d='M476.099 353.968l-170.2-294.8c-27.8-48.7-98.1-48.7-125.8 0l-170.3 294.8c-27.8 48.7 6.8 109.2 62.9 109.2h339.9c56.1 0 91.3-61.1 63.5-109.2zm-233.2 43.8c-14.8 0-27.1-12.3-27.1-27.1s12.3-27.1 27.1-27.1 27.1 12.3 26.5 27.8c.7 14.1-12.3 26.4-26.5 26.4zm24.7-175.2c-1.2 21-2.5 41.9-3.7 62.9-.6 6.8-.6 13-.6 19.7-.6 11.1-9.3 19.7-20.4 19.7s-19.7-8-20.4-19.1c-1.8-32.7-3.7-64.8-5.5-97.5-.6-8.6-1.2-17.3-1.9-25.9 0-14.2 8-25.9 21-29.6 13-3.1 25.9 3.1 31.5 15.4 1.9 4.3 2.5 8.6 2.5 13.6-.6 13.7-1.9 27.3-2.5 40.8z' fill='%23f73232' data-original='%23000000' xmlns='http://www.w3.org/2000/svg'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 16px;
        }
      }

      &.valid {
        &:before {
          background-color: green;
        }
      }
    }

    &.saving {
      overflow: hidden;
      cursor: wait;
      color: #666666;

      &:after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        width: 100%;
        height: 4px;
        content: '';
        animation: saving 4.2s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        background-color: #cccccc;
        will-change: left, right;
      }
    }
  }
}
</style>
