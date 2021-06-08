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
        class="lck-color-primary"
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
        >
          <template #value="slotProps">
            <lck-badge
              v-if="getSelectedValueDetails(column.id, slotProps.value)"
              :label="getSelectedValueDetails(column.id, slotProps.value).label"
              :color="getSelectedValueDetails(column.id, slotProps.value).color"
              :backgroundColor="getSelectedValueDetails(column.id, slotProps.value).backgroundColor"
            />
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <lck-badge
              :label="slotProps.option.label"
              :color="slotProps.option.color"
              :backgroundColor="slotProps.option.backgroundColor"
            />
          </template>
        </p-dropdown>
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
            mode="Dialog"
            :id="'map-edit-detail-' + column.id"
            @update-features="onGeoDataEdit(row.id, column.id, $event)"
            @remove-features="onEdit(row.id, column.id, null)"
            :resources="getLckGeoResources(column, row.data[column.id])"
          />
        </div>
        <p-checkbox
          v-else-if="getComponentEditorDetailForColumnType(column) === 'p-checkbox'"
          v-model="row.data[column.id]"
          :id="column.id"
          :binary="true"
          @input="onEdit(row.id, column.id, row.data[column.id])"
        />
        <lck-file-input
          v-else-if="getComponentEditorDetailForColumnType(column) === 'lck-file-input'"
          :attachments="row.data[column.id]"
          :workspaceId="workspaceId"
          :displayLabels="false"
          @input="$emit('upload-files', {
            rowId: row.id,
            columnId: column.id,
            fileList: $event
          })"
          @download="$emit('download-attachment', $event)"
          @remove-attachment="onRemoveAttachment(row.id, column.id, $event)"
        />

        <component
          v-else
          :is="getComponentEditorDetailForColumnType(column)"
          :id="column.id"
          v-model="row.data[column.id]"
          @blur="onEdit(row.id, column.id, row.data[column.id])"
          :rows="7"
        />
        <span
          class="cell-state"
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
          :modelValue="getColumnDisplayValue(column, row.data[column.id])"
          :binary="true"
          :disabled="true"
        />
        <lck-badge
          v-else-if="getComponentDisplayDetailForColumnType(column) === 'lck-badge'"
          v-bind="getColumnDisplayValue(column, row.data[column.id])"
        />
        <lck-file-input
          v-else-if="getComponentDisplayDetailForColumnType(column) === 'lck-file-input'"
          :attachments="row.data[column.id]"
          :workspaceId="workspaceId"
          :displayLabels="false"
          :disabled="true"
          @download="$emit('download-attachment', $event)"
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
import GeometryType from 'ol/geom/GeometryType'
import { Feature as GeoJSONFeature } from 'geojson'

import {
  COLUMN_TYPE
} from '@locokit/lck-glossary'

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
  getStyleLayers,
  LckGeoResource,
  geometryTypeFromColumnType,
  transformFeatureToWKT
} from '@/services/lck-utils/map/transformWithOL'
import {
  LckAttachment,
  LckTableColumn,
  LckTableRow,
  LckTableRowDataComplex,
  LCKTableRowMultiDataComplex,
  LckTableViewColumn,
  SelectValue
} from '@/services/lck-api/definitions'

import { getCellStateNotificationClass } from '@/services/lck-utils/notification'
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

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import MultiAutoComplete from '@/components/ui/MultiAutoComplete/MultiAutoComplete.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import URLInput from '@/components/ui/ColumnType/URL/Input.vue'
import Badge from '@/components/ui/Badge/Badge.vue'
import FileInput from '@/components/ui/ColumnType/File/Input.vue'

const Map = () => import(/* webpackChunkName: "lck-map-with-mapbox" */'@/components/ui/ColumnType/Geometry/Map.vue')

export default {
  name: 'LckDataDetail',
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-multi-autocomplete': MultiAutoComplete,
    'lck-filter-button': FilterButton,
    'lck-multiselect': MultiSelect,
    'lck-input-url': URLInput,
    'lck-map': Map,
    'lck-badge': Badge,
    'lck-file-input': FileInput,
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
    },
    /**
     * We need the workspace id for displaying images from attachments
     */
    workspaceId: {
      type: String,
      required: true
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
  computed: {
    editableColumns (): LckTableViewColumn[] {
      if (!this.definition.columns) return []
      return this.definition.columns.filter(column => this.isEditableColumn(this.crudMode, column))
    },
    columnsEnhanced (): Record<
        string,
        {
          column_type_id: COLUMN_TYPE;
          dropdownOptions?: SelectValue[];
        }
        > {
      if (!this.definition.columns) return {}
      const result: Record<
        string,
        {
          column_type_id: COLUMN_TYPE;
          dropdownOptions?: {value: string; label: string; color: string ; backgroundColor: string}[];
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
              label: values[key].label,
              color: values[key].color,
              backgroundColor: values[key].backgroundColor
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
    async onGeoDataEdit (rowId: string, columnId: string, features: GeoJSONFeature[]) {
      this.onEdit(
        rowId,
        columnId,
        transformFeatureToWKT(features[0])
      )
    },
    async onEdit (rowId: string, columnId: string, value: string | string[] | number[] | null) {
      this.$emit('update-row', {
        rowId,
        columnId,
        newValue: value
      })
    },
    /**
     * Remove an attachment for the column's attachments
     */
    async onRemoveAttachment (rowId: string, columnId: string, attachmentId: number) {
      this.$emit('update-row', {
        rowId,
        columnId,
        newValue: this.row.data[columnId]
          .filter((a: LckAttachment) => a.id !== attachmentId)
          .map((a: LckAttachment) => a.id)
      })
    },
    getLckGeoResources (column: LckTableViewColumn, data: string): LckGeoResource[] {
      const layers = getStyleLayers([column])
      const createGeoJsonFeaturesCollection = (data: string): GeoJSONFeatureCollection => {
        // This is necessary when column's type is Multi...
        const features: Feature[] = []
        if (data) {
          const currentFeature = transformEWKTtoFeature(data)
          currentFeature.setProperties({
            columnId: column.id,
            rowId: this.row.id,
            id: `${this.row.id}-${column.id}`
          })
          features.push(currentFeature)
        }
        // Transform OL Feature in Geojson
        const geojsonFormat = new GeoJSON()
        return geojsonFormat.writeFeaturesObject(features)
      }

      const features = createGeoJsonFeaturesCollection(data)

      const editableGeometryTypes: Set<GeometryType> = new Set()
      // Only display edit options if the column is editable
      if (this.editableColumns.includes(column)) {
        const geometryType = geometryTypeFromColumnType(column.column_type_id)
        if (geometryType) editableGeometryTypes.add(geometryType)
      }

      return [
        {
          id: `features-collection-source-id-${column.id}`,
          layers,
          ...features,
          editableGeometryTypes,
          displayPopup: false,
          selectable: false,
          triggerEvents: new Set()
        }
      ]
    },
    getSelectedValueDetails (columnId: string, value: string) {
      const dropdownOptions = this.columnsEnhanced[columnId].dropdownOptions
      if (dropdownOptions) return dropdownOptions.find(element => element.value === value)
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
}
</style>
