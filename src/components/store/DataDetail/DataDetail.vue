<template>
  <div
    class="p-fluid"
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
      v-for="column in definition.columns.filter(c => ( c.displayed === null || c.displayed === undefined || c.displayed === true) )"
      :key="column.id"
    >
      <div v-if="editableColumns.indexOf(column) > -1" style="position: relative;">
        <div class="p-d-flex">
          <p-checkbox
            v-if="getComponentEditorDetailForColumnType(column) === 'p-checkbox'"
            v-model="row.data[column.id]"
            :id="column.id"
            :binary="true"
            @input="onEdit(row.id, column.id, row.data[column.id])"
          />

          <label
            class="lck-color-primary"
            :for="column.id"
          >
            {{ column.text }}
          </label>
          <span
            v-if="column.required"
            class="column-required"
          >
            *
          </span>
        </div>

        <div
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
            v-model="row.data[column.id]"
            :dateFormat="$t('date.dateFormatPrime')"
            @hide="onDateEdit(row.id, column.id, row.data[column.id])"
            appendTo="body"
          />
          <p-calendar
            v-else-if="getComponentEditorDetailForColumnType(column) === 'p-calendar-time'"
            v-model="row.data[column.id]"
            :dateFormat="$t('date.dateFormatPrime')"
            @hide="onDateEdit(row.id, column.id, row.data[column.id])"
            :showTime="true"
            appendTo="body"
          />
          <p-input-number
            v-else-if="getComponentEditorDetailForColumnType(column) === 'p-input-float'"
            v-model="row.data[column.id]"
            @blur="onEdit(row.id, column.id, row.data[column.id])"
            mode="decimal"
            :minFractionDigits="2"
          />
          <lck-map
            v-else-if="getComponentEditorDetailForColumnType(column) === 'lck-map' && canDisplayColumn(column)"
            :id="'map-edit-detail-' + column.id"
            mode="Dialog"
            :options="column.settings && column.settings.map_center ? {
              ...column.settings.map_center
            } : {}"
            :resources="getLckGeoResources(column)"
            :singleEditMode="true"
            @remove-features="onEdit(row.id, column.id, null)"
            @update-features="onGeoDataEdit(row.id, column.id, $event)"
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
            v-else-if="getComponentEditorDetailForColumnType(column) !== 'p-checkbox'"
            :is="getComponentEditorDetailForColumnType(column)"
            :id="column.id"
            v-model="row.data[column.id]"
            @blur="onEdit(row.id, column.id, row.data[column.id])"
            :rows="7"
          />
        </div>
        <span
          class="cell-state"
          :class="getCellStateNotificationClass(row.id, column.id, cellState)"
        />
      </div>

      <div
        v-else-if="mode !== 'creation'"
        class="p-fluid p-inputtext p-component non-editable-field"
      >
        <div class="p-d-flex">
          <p-checkbox
            v-if="getComponentDisplayDetailForColumnType(column) === 'p-checkbox'"
            :modelValue="getColumnDisplayValue(column, row.data[column.id])"
            :binary="true"
            :disabled="true"
          />
          <label
            class="lck-color-primary"
            :for="column.id"
          >
            {{ column.text }}
          </label>
          <span
            v-if="column.required"
            class="column-required"
          >
            *
          </span>
        </div>

        <lck-map
          v-if="getComponentDisplayDetailForColumnType(column) === 'lck-map' && row.data[column.id] && canDisplayColumn(column)"
          mode="Dialog"
          :id="'map-display-detail-' + column.id"
          :resources="getLckGeoResources(column)"
          :options="{
            interactive: false
          }"
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
        <span v-else-if="getComponentDisplayDetailForColumnType(column) !== 'p-checkbox'">
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
import Vue, { PropType } from 'vue'

import { Feature as GeoJSONFeature } from 'geojson'

import {
  COLUMN_TYPE, MapSourceSettings,
} from '@locokit/lck-glossary'

import {
  getColumnTypeId,
  getComponentEditorDetailForColumnType,
  getComponentDisplayDetailForColumnType,
  isEditableColumn,
  getColumnDisplayValue,
} from '@/services/lck-utils/columns'

import { zipArrays } from '@/services/lck-utils/arrays'
import {
  transformEWKTtoFeature,
  LckGeoResource,
  transformFeatureToWKT,
  getLckGeoResources,
} from '@/services/lck-utils/map/transformWithOL'
import {
  LckAttachment,
  LckTableColumn,
  LckTableRow,
  LckTableRowData,
  LckTableRowDataComplex,
  LCKTableRowMultiDataComplex,
  LckTableView,
  LckTableViewColumn,
  SelectValue,
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
    'lck-url-input': URLInput,
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
    'p-checkbox': Vue.extend(Checkbox),
  },
  props: {
    autocompleteSuggestions: {
      type: Array, //  as { label: string; value: number }[]
    },
    row: {
      type: Object,
      required: false,
    },
    definition: {
      type: Object as PropType<LckTableView>,
      required: false,
      // eslint-disable-next-line @typescript-eslint/camelcase
      default: () => ({ columns: [], text: '', table_id: '', id: '' }),
    },
    crudMode: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    cellState: {
      type: Object,
      default: function () {
        return {
          rowId: null,
          columnId: null,
          waiting: false,
          isValid: null,
        }
      },
    },
    /**
     * We need the workspace id for displaying images from attachments
     */
    workspaceId: {
      type: String,
      required: true,
    },
    /**
     * DataDetail mode : creation, read
     */
    mode: {
      type: String,
      required: false,
      default: 'read',
    },
    secondarySources: {
      type: Object as () => Record<string, {
        definition: LckTableView;
        content: LckTableRow[];
      }>,
      default: () => ({}),
    },
  },
  data () {
    return {
      COLUMN_TYPE,
      autocompleteInput: {} as Record<string, string>,
      // TODO: review with @alc why this type {value: number, label: string} (and why not value could not be a string)
      multipleAutocompleteInput: {} as Record<string, { value: number; label: string }[]>,
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
          dropdownOptions?: {value: string; label: string; color: string ; backgroundColor: string; position: number}[];
        }
      > = {}
      this.definition.columns.forEach(currentColumn => {
        result[currentColumn.id] = {
          // eslint-disable-next-line @typescript-eslint/camelcase
          column_type_id: currentColumn.column_type_id,
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
              backgroundColor: values[key].backgroundColor,
              position: values[key].position || 0,
            })).sort((firstValue, secondValue) => firstValue.position - secondValue.position)
          }
        }
      })
      return result
    },
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
      { query }: { query: string },
    ) {
      this.$emit(
        'update-suggestions', {
          columnTypeId,
          settings,
        }, { query })
    },
    async onAutocompleteEdit (rowId: string, columnId: string, event: { value: { value: string } } | null = null) {
      await this.onEdit(rowId, columnId, event ? event.value.value : null)
    },
    async onMultipleAutocompleteEdit (rowId: string, columnId: string) {
      await this.onEdit(
        rowId,
        columnId,
        this.multipleAutocompleteInput[columnId].map((item: { value: number }) => item.value),
      )
    },
    async onDateEdit (rowId: string, columnId: string, value: Date | null) {
      await this.onEdit(
        rowId,
        columnId,
        value,
      )
    },
    async onGeoDataEdit (rowId: string, columnId: string, features: GeoJSONFeature[]) {
      await this.onEdit(
        rowId,
        columnId,
        transformFeatureToWKT(features[0]),
      )
    },
    async onEdit (rowId: string, columnId: string, value: string | string[] | number[] | Date | null) {
      this.$emit('update-row', {
        rowId,
        columnId,
        newValue: value,
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
          .map((a: LckAttachment) => a.id),
      })
    },
    canDisplayColumn (column: LckTableViewColumn) {
      if (this.row) {
        if (column.settings.map_sources) {
          return column.settings.map_sources.every(source => this.secondarySources[source.id] != null)
        }
        return true
      }
      return false
    },
    getLckGeoResources (column: LckTableViewColumn): LckGeoResource[] | null {
      const columnSourceId = `${this.definition.id}-${column.id}`

      if (!this.definition || !this.row) {
        return null
      }

      // Initialize the geo sources definition with the current definition
      const definitionsToLoad: Record<string, LckTableView> = {
        [columnSourceId]: {
          ...this.definition,
          columns: [column],
        },
      }
      // Initialize the geo sources content with the current row
      const contentsToLoad: Record<string, LckTableRow[]> = {
        [columnSourceId]: [
          this.row,
        ],
      }
      // Initialize the geo sources settings with the current column
      const geoSourcesSettings: MapSourceSettings[] = [
        {
          id: columnSourceId,
          field: column.id,
          style: {
            default: {
              fill: {
                color: '#00F',
              },
            },
          },
        },
      ]
      // Additional resources to load if specified
      if (column.settings.map_sources && this.secondarySources) {
        for (const mapSourceSettings of column.settings.map_sources) {
          const { definition, content } = this.secondarySources[mapSourceSettings.id] || {}
          if (definition && content) {
            definitionsToLoad[mapSourceSettings.id] = definition
            geoSourcesSettings.push(mapSourceSettings)
            contentsToLoad[mapSourceSettings.id] = this.definition.table_id === definition.table_id
              ? content.filter(r => r.id !== this.row.id)
              : content
          } else {
            return null
          }
        }
      }

      return getLckGeoResources(
        definitionsToLoad,
        contentsToLoad,
        { sources: geoSourcesSettings },
        {
          noReference: this.$t('components.mapview.noReference'),
          noData: this.$t('components.mapview.noRowData'),
          dateFormat: this.$t('date.dateFormat'),
          datetimeFormat: this.$t('date.datetimeFormat'),
        },
      )
    },
    getSelectedValueDetails (columnId: string, value: string) {
      return this.columnsEnhanced[columnId].dropdownOptions?.find(element => element.value === value)
    },
  },
  watch: {
    'row.data': {
      handler (newData: Record<string, LckTableRowData>, oldData: Record<string, LckTableRowData>|undefined) {
        if (newData !== oldData) {
          // Reset autocomplete options
          this.autocompleteInput = {}
          this.multipleAutocompleteInput = {}
          /**
           * we go through every data prop,
           * and init the autocompleteInput if needed
          */
          if (newData) {
            Object.keys(newData).forEach((columnId) => {
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
                      (newData[columnId] as LckTableRowDataComplex)?.value || null)
                    break
                  case COLUMN_TYPE.MULTI_USER:
                    this.$set(
                      this.multipleAutocompleteInput,
                      columnId,
                      zipArrays(
                        (newData[columnId] as LCKTableRowMultiDataComplex)?.reference as [],
                        (newData[columnId] as LCKTableRowMultiDataComplex)?.value as [],
                        'value',
                        'label',
                      ),
                    )
                    break
                }
              }
            })
          }
        }
      },
      immediate: true,
    },
  },
}
</script>

<style scoped>
::v-deep .p-checkbox {
  margin: 0 0.5rem 0.5rem 0;
}

::v-deep .p-checkbox .p-checkbox-box {
  border-color: var(--primary-color-lighten);
}

::v-deep .p-checkbox .p-checkbox-box.p-highlight {
  border-color: var(--primary-color-lighten);
  background: var(--primary-color-lighten);
}

::v-deep .p-checkbox .p-checkbox-box .p-checkbox-icon {
  color: var(--primary-color-darken) !important;
  font-weight: bold;
}

::v-deep .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover {
  border-color: var(--primary-color-darken);
  background: var(--primary-color-darken);
}

::v-deep .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover .p-checkbox-icon {
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

.column-required {
  font-size: 1.6rem;
  color: var(--color-error);
}

</style>
