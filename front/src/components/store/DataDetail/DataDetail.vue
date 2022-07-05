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
      v-for="column in definition.columns.filter(isColumnDisplayed)"
      :key="column.id"
    >
      <validation-provider
        v-if="editableColumns.indexOf(column) > -1"
        style="position: relative;"
        :vid="column.id"
        :rules="rulesExtended(column)"
        :name="column.text"
        :ref="`vp_${row.id}_${column.id}`"
        v-slot="{
          errors,
          classes,
          validate,
        }"
      >
        <div
          class="p-d-flex"
          style="position: relative;"
        >
          <p-checkbox
            v-if="getComponentEditorDetailForColumnType(column) === 'p-checkbox'"
            v-model="row.data[column.id]"
            :id="column.id"
            :binary="true"
            @input="onEdit(row.id, column.id, row.data[column.id])"
          />

          <label
            class="lck-color-primary"
            :class="[classes, { 'label-field-required': column.validation && column.validation.required }]"
            :for="column.id"
          >
            {{ column.text }}
          </label>
          <span
            v-if="getComponentEditorDetailForColumnType(column) === 'p-checkbox'"
            class="cell-state"
            :class="getCellStateNotificationClass(row.id, column.id, cellState)"
          />

        </div>

        <div
          class="form-field-editable"
          :class="classes"
        >
          <lck-autocomplete
            v-if="getComponentEditorDetailForColumnType(column) === 'lck-autocomplete'"
            :id="column.id"
            :placeholder="$t('components.datatable.placeholder')"
            field="label"
            :forceSelection="false"
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
            @hide="onEdit(row.id, column.id, row.data[column.id])"
            appendTo="body"
          />
          <p-calendar
            v-else-if="getComponentEditorDetailForColumnType(column) === 'p-calendar-time'"
            v-model="row.data[column.id]"
            :dateFormat="$t('date.dateFormatPrime')"
            @hide="onEdit(row.id, column.id, row.data[column.id])"
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
          <template v-else-if="getComponentEditorDetailForColumnType(column) === 'lck-map'">
            <lck-map
              v-if="availableColumnsIds.has(column.id)"
              :id="'map-edit-detail-' + column.id"
              mode="Dialog"
              :options="column.settings && column.settings.map_center ? {
                ...column.settings.map_center
              } : {}"
              :resources="getLckGeoResources(column)"
              :singleEditMode="true"
              @remove-features="onEdit(row.id, column.id, null)"
              @update-features="onGeoDataEdit(row.id, column, $event)"
              @hook:mounted="silentValidation(row.id, column.id)"
            />
          </template>
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
            @updated-attachments="validate($event)"
            @hook:mounted="silentValidation(row.id, column.id)"
          />

          <component
            v-else-if="getComponentEditorDetailForColumnType(column) !== 'p-checkbox'"
            :is="getComponentEditorDetailForColumnType(column)"
            :id="column.id"
            v-model="row.data[column.id]"
            @blur="onEdit(row.id, column.id, row.data[column.id])"
            :rows="7"
          />
          <span
            v-if="getComponentEditorDetailForColumnType(column) !== 'p-checkbox'"
            class="cell-state"
            :class="getCellStateNotificationClass(row.id, column.id, cellState)"
          />
        </div>
        <span :class="classes">{{ errors[0] }}</span>
      </validation-provider>

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
            :class="{ 'lck-color-primary': true, 'label-field-required': column.required }"
            :for="column.id"
          >
            {{ column.text }}
          </label>
        </div>
        <template v-if="getComponentDisplayDetailForColumnType(column) === 'lck-map' && row.data[column.id]">
          <lck-map
            v-if="availableColumnsIds.has(column.id)"
            mode="Dialog"
            :id="'map-display-detail-' + blockId + column.id"
            :resources="getLckGeoResources(column)"
            :options="{
              interactive: false
            }"
          />
        </template>
        <lck-badge
          v-else-if="getComponentDisplayDetailForColumnType(column) === 'lck-badge'"
          v-bind="getColumnDisplayValue(column, row.data[column.id])"
        />
        <lck-multi-badges
          v-else-if="getComponentDisplayDetailForColumnType(column) === 'lck-multi-badges'"
          :options="getColumnDisplayValue(column, row.data[column.id])"
        />
        <lck-file-input
          v-else-if="getComponentDisplayDetailForColumnType(column) === 'lck-file-input'"
          :attachments="row.data[column.id]"
          :workspaceId="workspaceId"
          :displayLabels="false"
          :disabled="true"
          @download="$emit('download-attachment', $event)"
        />
        <span
          v-else-if="getComponentDisplayDetailForColumnType(column) === 'lck-url'"
          class="lck-url"
        >
          <a
            :href="getColumnDisplayValue(column, row.data[column.id])"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{{ getColumnDisplayValue(column, row.data[column.id]) }}</span>
            <i
              class="pi pi-external-link"
              :title="$t('components.URLInput.openTheLink')"
              :aria-label="$t('components.URLInput.openTheLink')"
            />
          </a>
        </span>
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
/* eslint-disable no-unused-expressions */
import Vue, { PropOptions, PropType } from 'vue'

import { Feature as GeoJSONFeature } from 'geojson'
import { ValidationProvider } from 'vee-validate'

import {
  COLUMN_TYPE, MapSourceSettings,
} from '@locokit/lck-glossary'

import {
  getColumnTypeId,
  getComponentEditorDetailForColumnType,
  getComponentDisplayDetailForColumnType,
  isEditableColumn,
  getColumnDisplayValue,
  getColumnValidationRules,
} from '@/services/lck-utils/columns'

import { zipArrays } from '@/services/lck-utils/arrays'
import {
  transformEWKTtoFeature,
  LckGeoResource,
  transformFeatureToWKT,
  getLckGeoResources,
} from '@/services/lck-utils/map/transformWithOL'
import {
  LckTableColumn,
  LckTableRow,
  LckTableRowData,
  LckTableRowDataComplex,
  LCKTableRowMultiDataComplex,
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
import Checkbox from 'primevue/checkbox'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import MultiAutoComplete from '@/components/ui/MultiAutoComplete/MultiAutoComplete.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import URLInput from '@/components/ui/ColumnType/URL/Input.vue'
import Badge from '@/components/ui/Badge/Badge.vue'
import LckMultiBadges from '@/components/ui/MultiBadges/MultiBadges.vue'
import FileInput from '@/components/ui/ColumnType/File/Input.vue'
import InputNumber from '@/components/ui/ColumnType/Number/InputNumber.vue'

const Map = () => import(/* webpackChunkName: "lck-map-with-mapbox" */'@/components/ui/ColumnType/Geometry/Map.vue')

export default Vue.extend({
  name: 'LckDataDetail',
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-multi-autocomplete': MultiAutoComplete,
    'lck-filter-button': FilterButton,
    'lck-multiselect': MultiSelect,
    'lck-url-input': URLInput,
    'lck-map': Map,
    'lck-badge': Badge,
    'lck-multi-badges': LckMultiBadges,
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
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    blockId: {
      type: String,
      default: '',
    },
    autocompleteSuggestions: {
      type: Array, //  as { label: string; value: number }[]
    },
    row: {
      type: Object,
      required: false,
    },
    definition: {
      type: Object,
      required: false,
      default: () => ({ columns: [] }),
    } as Vue.PropOptions<{ columns: LckTableViewColumn[]; table_id?: string }>,
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
    /*
     * Additional sources displayed in addition to the editable data in geographic inputs
     */
    secondarySources: {
      type: Object as PropType<Record<string, { definition: { columns: LckTableViewColumn[]; table_id?: string }; content: LckTableRow[] }>>,
      default: () => ({}),
    },
    /*
     * Fields ids which have been programmatically updated from another field value
     */
    fieldsToValidate: {
      type: Object,
      default: () => ({}),
    } as PropOptions<Record<string, LckTableRowData>>,
  },
  data () {
    return {
      COLUMN_TYPE,
      autocompleteInput: {} as Record<string, string>,
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
    availableColumnsIds (): Set<string> {
      const availableColumnsIds: Set<string> = new Set()
      if (!this.definition.columns || !this.row?.data) return availableColumnsIds
      for (const column of this.definition.columns) {
        // The additional resources must be loaded
        if (
          !column.settings?.map_sources ||
          column.settings.map_sources.every(source => this.secondarySources?.[source.id] != null)
        ) {
          availableColumnsIds.add(column.id)
        }
      }
      return availableColumnsIds
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
      { column_type_id: columnTypeId, settings, foreign_filter: filter }: LckTableViewColumn,
      { query }: { query: string },
    ) {
      this.$emit(
        'update-suggestions', {
          columnTypeId,
          settings,
          filter,
        }, { query })
    },
    async onAutocompleteEdit (rowId: string, columnId: string, event: { value: { value: string } } | null = null) {
      // We pass as function parameters, the reference that we want to save (event.value.value) and
      // the value retrieved by the input field (event.value) to check its validity (must be an object).
      if (event) await this.onEdit(rowId, columnId, event.value.value, event.value)
      else await this.onEdit(rowId, columnId, null)
    },
    async onMultipleAutocompleteEdit (rowId: string, columnId: string) {
      await this.onEdit(
        rowId,
        columnId,
        this.multipleAutocompleteInput[columnId].map((item: { value: number }) => item.value),
      )
    },
    async onGeoDataEdit (rowId: string, column: LckTableViewColumn, features: GeoJSONFeature[]) {
      await this.onEdit(
        rowId,
        column.id,
        transformFeatureToWKT(features[0], column.column_type_id),
      )
    },
    /**
     * Validate the field without updating the flags specifying that it has been manipulated
     * @param rowId the id of the current row to check
     * @param columnId the id of the column to check
     * @param value the value that we want to check
     */
    async silentValidation (rowId: string, columnId: string) {
      const veeValidateField = this.$refs[`vp_${rowId}_${columnId}`]
      const provider = (Array.isArray(veeValidateField)
        ? veeValidateField[0]
        : veeValidateField
      ) as InstanceType<typeof ValidationProvider>
      if (provider) {
        provider.validateSilent().then((validation) => {
          provider.setFlags({
            valid: validation.valid,
            invalid: !validation.valid,
          })
        })
      }
    },
    /**
     * Emit an 'update-row' event with the value to save if it is valid.
     * @param rowId the id of the current row to update
     * @param columnId the id of the column to update
     * @param value the value that we want to save
     * @param originalValue the value that we want to check (if not specified, the value to be saved is checked)
     */
    async onEdit (rowId: string, columnId: string, value: string | string[] | number[] | Date | null, originalValue?: unknown) {
      const ref = `vp_${rowId}_${columnId}`
      let provider = this.$refs[ref]
      if (Array.isArray(provider)) {
        provider = provider[0]
      }
      const valueToCheck = originalValue !== undefined ? originalValue : value;
      (provider as InstanceType<typeof ValidationProvider>).validate(valueToCheck).then((validation) => {
        if (validation.valid) {
          this.$emit('update-row', {
            rowId,
            columnId,
            newValue: value,
          })
        }
      })
    },
    /**
     * Remove an attachment for the column's attachments
     */
    async onRemoveAttachment (rowId: string, columnId: string, attachmentId: number) {
      this.$emit('remove-attachment', {
        rowId,
        columnId,
        attachmentId,
      })
    },
    getLckGeoResources (column: LckTableViewColumn): LckGeoResource[] {
      const columnSourceId = `current-${column.id}`

      // Initialize the geo sources definition with the current definition
      const definitionsToLoad: Record<string, { columns: LckTableViewColumn[]; table_id?: string }> = {
        [columnSourceId]: {
          columns: [{
            ...column,
            editable: isEditableColumn(this.crudMode, column),
          }],
        },
      }
      // Initialize the geo sources content with the current row
      const contentsToLoad: Record<string, LckTableRow[]> = {
        [columnSourceId]: [
          this.row,
        ],
      }
      // Initialize the geo sources settings of the current column
      const currentGeoSourceSettings: MapSourceSettings = {
        id: columnSourceId,
        field: column.id,
        style: {
          default: {
            fill: {
              color: '#01426B',
            },
          },
        },
      }
      const geoSourcesSettings: (MapSourceSettings & { excludeFromBounds?: boolean })[] = []

      // Load additional resources if specified
      if (column.settings?.map_sources && this.secondarySources) {
        for (const mapSourceSettings of column.settings.map_sources) {
          const { definition, content } = this.secondarySources[mapSourceSettings.id] || {}
          if (definition && content) {
            // Add the definition in read only mode
            definitionsToLoad[mapSourceSettings.id] = definition
            for (const column of (definitionsToLoad[mapSourceSettings.id].columns || [])) {
              column.editable = false
            }
            // Add the content
            contentsToLoad[mapSourceSettings.id] = this.definition.table_id === definition.table_id
              ? content.filter(r => r.id !== this.row.id)
              : content
            // Add the geo sources settings
            mapSourceSettings.excludeFromBounds = true
            geoSourcesSettings.push(mapSourceSettings)
          }
        }
      }

      // Add the current column source at the end to display it over the other sources
      geoSourcesSettings.push(currentGeoSourceSettings)

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
    rulesExtended (column: LckTableColumn) {
      return getColumnValidationRules(column)
    },
    /**
     * Check if a column / field is displayed
     * * check its displayed property
     * * check also conditions to display this field
     */
    isColumnDisplayed (column: LckTableViewColumn) {
      let isDisplayed = column.displayed === null || column.displayed === undefined || column.displayed === true
      // return early to avoid useless computation
      if (!isDisplayed) return isDisplayed
      // eslint-disable-next-line @typescript-eslint/camelcase
      column.display_conditions?.forEach(({ field_id, operator, value }) => {
        if (this.columnsEnhanced[field_id]) {
          let fieldValue: string | number | string[] | number[] = this.row.data[field_id]
          switch (this.columnsEnhanced[field_id].column_type_id) {
            case COLUMN_TYPE.USER:
            case COLUMN_TYPE.GROUP:
            case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
              fieldValue = this.row.data[field_id]?.reference
              break
            /*
            case COLUMN_TYPE.BOOLEAN:
            case COLUMN_TYPE.STRING:
            case COLUMN_TYPE.NUMBER:
            case COLUMN_TYPE.FLOAT:
            case COLUMN_TYPE.DATE:
            case COLUMN_TYPE.SINGLE_SELECT:
            case COLUMN_TYPE.TEXT:
            case COLUMN_TYPE.URL:
            */
            default:
              break
          }
          switch (operator) {
            case '$eq':
              if (fieldValue !== value) isDisplayed = false
              break
            case '$ne':
              if (fieldValue === value) isDisplayed = false
              break
            case '$in':
              if (!(value as string[] | number[]).includes(fieldValue as never)) isDisplayed = false
              break
          }
        } else {
          isDisplayed = false
        }
      })
      return isDisplayed
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
                      newData[columnId]
                        ? {
                          value: (newData[columnId] as LckTableRowDataComplex)?.reference,
                          label: (newData[columnId] as LckTableRowDataComplex)?.value,
                        }
                        : null,
                    )
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
    definition: {
      handler (newDefinition: { columns: LckTableViewColumn[]; table_id?: string }) {
        if (newDefinition.columns?.length) {
          // Get the list of the secondary sources to load
          const uniqueTableViewsToLoadIds: Set<string> = new Set()
          newDefinition.columns.forEach(column => {
            if (column.settings?.map_sources) {
              for (const { id } of column.settings.map_sources) {
                uniqueTableViewsToLoadIds.add(id)
              }
            }
          })
          if (uniqueTableViewsToLoadIds.size) {
            this.$emit('get-secondary-sources', Array.from(uniqueTableViewsToLoadIds))
          }
        }
      },
      immediate: true,
    },
    fieldsToValidate (newFieldsToValidate: Record<string, LckTableRowData>) {
      // Loop on fields with default values interaction which are programmatically updated to validate them
      for (const fieldId in newFieldsToValidate) {
        const ref = `vp_${this.row.id}_${fieldId}`
        let provider = this.$refs[ref]
        if (provider) {
          if (Array.isArray(provider)) {
            provider = provider[0]
          }
          (provider as InstanceType<typeof ValidationProvider>).validate(newFieldsToValidate[fieldId])
        }
      }
    },
  },
})
</script>

<style scoped>
::v-deep .p-checkbox {
  margin: 0 0.5rem 0.5rem 0;
}

::v-deep .p-checkbox .p-checkbox-box {
  border-color: var(--primary-color-light);
}

::v-deep .p-checkbox .p-checkbox-box.p-highlight {
  border-color: var(--primary-color-light);
  background: var(--primary-color-light);
}

::v-deep .p-checkbox .p-checkbox-box .p-checkbox-icon {
  color: var(--primary-color-dark) !important;
  font-weight: var(--font-weight-bold);
}

::v-deep .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover {
  border-color: var(--primary-color-dark);
  background: var(--primary-color-dark);
}

::v-deep .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover .p-checkbox-icon {
  color: var(--primary-color-light) !important;
}

</style>

<style scoped>
@media print {
  .p-field {
    break-inside: avoid;
  }

  /* To remove element cross and chevron */
  ::v-deep .p-dropdown i {
    display: none;
  }
  ::v-deep .p-dropdown div {
    display: none;
  }
  ::v-deep .multiselect-custom .p-multiselect-trigger {
    display: none;
  }

  /* To remove placeholder */
  ::v-deep .p-multiselect .p-multiselect-label.p-placeholder {
    color: transparent;
  }
  ::v-deep .p-dropdown .p-dropdown-label.p-placeholder {
    color: transparent;
  }
}
</style>

<style lang="scss" scoped>

.form-field-editable {
  position: relative;

  &.failed {
    border-color: var(--color-error);
  }
}

.non-editable-field {
  border: unset;
  background-color: transparent;
  padding-left: unset;

  .lck-url {
    > a {
      display: flex;
      width: 100%;

      > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

textarea {
  resize: none;
}
</style>
