<template>
  <div
    v-if="definition"
    class="p-d-flex p-flex-column d-flex-1 o-auto p-jc-between"
    style="min-height: 30rem"
  >
    <!--
    :scrollable="true"
    scrollHeight="500px"
    :virtualScroll="true"
    :virtualRowHeight="38"
    @virtual-scroll="onVirtualScroll"
   -->
    <div
      class="responsive-table-wrapper p-fluid d-flex-1"
    >
      <p-datatable
        class="
          p-datatable-sm
          p-datatable-gridlines
          p-d-flex
          p-flex-column
          justify-between
        "
        :class="{
          'is-reorderable': crudMode
        }"

        :style="{
          width: tableWidth
        }"

        :value="content && content.data"

        :lazy="true"
        :loading="loading"
        :cellState="cellState"

        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
        @cell-edit-init="onCellEditInit"

        :resizableColumns="true"
        columnResizeMode="expand"
        @column-resize-end="onColumnResize"

        :reorderableColumns="crudMode && !locked"
        @column-reorder="onColumnReorder"
        :minColumnReorderIndex="unorderableColumnsNumber"

        @sort="onSort"
        :sortField.sync="sortField"
        :sortOrder.sync="sortOrder"

        ref="p-datatable"

        :context-menu="crudMode"
        :context-menu-selection.sync="selectedRow"
        @row-contextmenu="onRowContextMenu"
      >
        <p-column
          v-if="
            (displayDetailButton && definition.columns && definition.columns.length > 0)
            || deleteAllowed
            || duplicateAllowed
          "
          :headerStyle="{
            width: displayDetailButton && duplicateAllowed && deleteAllowed ? '8rem' : '6rem',
            padding: '0 0.1rem',
            margin: 'unset'
          }"
          :bodyStyle="{
            width: displayDetailButton && duplicateAllowed && deleteAllowed ? '8rem' : '6rem',
            padding: '0 0.1rem',
            margin: 'unset',
            'text-align': 'center',
            'box-shadow': '1px 0 0 0 #eee',
            overflow: 'hidden'
          }"
          headerClass="sticky-column-cells"
          bodyClass="sticky-column-cells"
          columnKey="detail-column"
          :reorderableColumn="false"
        >
          <template #body="slotProps">
            <span class="button-group">
              <p-button
                v-if="displayDetailButton && definition.columns && definition.columns.length > 0"
                class="p-button-sm p-button-text p-button-rounded"
                icon="pi pi-window-maximize"
                @click="$emit('open-detail', { rowId: slotProps.data.id })"
                v-tooltip="$t('components.datatable.openDetail')"
              />
              <lck-button-confirmation
                v-if="duplicateAllowed"
                first-level-icon="pi pi-clone"
                second-level-icon="pi pi-exclamation-circle"

                first-level-class="p-button-rounded p-button-text"
                second-level-class="p-button-rounded p-button-text"

                :first-level-tooltip="$t('components.datatable.contextmenu.duplicate')"
                :second-level-tooltip="$t('components.datatable.contextmenu.duplicateConfirm')"

                @confirm="$emit('row-duplicate', slotProps.data)"
              />
              <lck-button-confirmation
                v-if="deleteAllowed"
                first-level-icon="bi bi-trash"
                second-level-icon="pi pi-exclamation-circle"

                first-level-class="p-button-rounded p-button-danger p-button-text"
                second-level-class="p-button-rounded p-button-danger p-button-text"

                :first-level-tooltip="$t('components.datatable.contextmenu.delete')"
                :second-level-tooltip="$t('components.datatable.contextmenu.deleteConfirm')"

                @confirm="$emit('row-delete', slotProps.data)"
              />
              <lck-dropdown-button
                v-if="crudMode"
                :disabled="manualProcesses.length === 0"
                buttonClass="p-button-sm p-button-text p-button-rounded"
                icon="bi bi-lightning"
                appendTo="body"
                :model="formatManualProcesses(slotProps.data.id)"
              />
            </span>
          </template>
        </p-column>
        <p-column
          v-if="actions.length === 1"
          bodyStyle="width: 8rem; padding: 0 0.1rem; margin: unset; text-align: center; box-shadow: 1px 0 0 0 #eee; overflow: hidden;"
          :headerStyle="{
            width: '8rem',
            padding: '0 0.1rem',
            margin: 'unset',
          }"
          headerClass="sticky-column-cells"
          columnKey="action-column"
          :reorderableColumn="false"
        >
          <template #header>
            <div class="th-container">
              <span class="th-text"/>
              <p-button
                v-if="crudMode"
                class="edit-column-icon p-ml-auto"
                icon="pi pi-angle-down"
                appendTo="body"
                aria-haspopup="true"
                style="position: absolute; right: 0; width: 1rem;"
                aria-controls="overlay_action_column"
                @click="onEditActionColumnClick($event, actions[0])"
              />
              <p-menu
                id="overlay_action_column"
                ref="menuAction"
                :popup="true"
                :model="[{
                  label: $t('components.datatable.actionColumn.edit'),
                  icon: 'bi bi-pencil',
                  command: () => {
                    $emit('display-column-sidebar')
                  }
                }]"
                appendTo="body"
              />
            </div>
          </template>

          <template #body="slotProps">
            <lck-cell-action
              class="lck-cell-action"
              :displayCheckIcon="displayCheckIcon"
              :action="actions[0]"
              :content="slotProps.data"
              v-on="$listeners"
            />
          </template>
        </p-column>
        <div
          v-for="column in definition.columns"
          :key="`${columnsSetPrefix}-${column.id}-${unorderableColumnsNumber}`"
        >
          <p-column
            :field="column.id"
            :headerStyle="{
              width: ( ( column.style && column.style.width ) || '150' ) + 'px',
              'white-space': 'nowrap',
              'text-overflow': 'ellipsis',
              'height': '2.5rem',
              'max-height': '2.5rem',
              'overflow': 'hidden',
            }"
            :bodyStyle="{
              width: ( ( column.style && column.style.width ) || '150' ) + 'px',
              'white-space': 'nowrap',
              'position': 'relative',
              'height': '2.5rem',
              'max-height': '2.5rem',
            }"
            :bodyClass="addClassNotEditableColumn(crudMode, column)"
            :sortable="isSortableColumn(column)"
          >
          <template #header>
            <div class="th-container">
              <span class="th-text" :data-column-id="column.id">
                <i
                  style="filter: grayscale(100%) opacity(50%);"
                  :class="getColumnClass(column)"
                />
                {{ column.text }}
              </span>
              <p-button
                v-if="crudMode"
                class="edit-column-icon p-ml-auto"
                icon="pi pi-angle-down"
                appendTo="body"
                aria-haspopup="true"
                style="position: absolute; width: 1rem;"
                :aria-controls="column.id"
                @click="onEditColumnClick($event, column)"
              />
              <p-menu
                :id="column.id"
                :ref="'menu' + column.id"
                :popup="true"
                :model="editColumnMenuItems"
                appendTo="body"
              />
            </div>
          </template>
          <template
            #editor="slotProps"
            v-if="getComponentEditorCellForColumnType(column) && isEditableColumn(crudMode, column)"
          >
            <lck-autocomplete
              v-if="getComponentEditorCellForColumnType(column) === 'lck-autocomplete'"
              :dropdown="true"
              :placeholder="$t('components.datatable.placeholder')"
              field="label"
              appendTo="body"
              v-model="autocompleteInput"
              :suggestions="autocompleteSuggestions"
              @search="onComplete(column, $event)"
              @item-select="onAutocompleteEdit(slotProps.data.id, column.id, $event)"
              @clear="onAutocompleteEdit(slotProps.data.id, column.id, null)"
              class="field-editable"
            />
            <lck-multi-autocomplete
              v-else-if="getComponentEditorCellForColumnType(column) === 'lck-multi-autocomplete'"
              field="label"
              :suggestions="autocompleteSuggestions"
              v-model="multipleAutocompleteInput"
              @search="onComplete(column, $event)"
              @item-select="onMultipleAutocompleteEdit(slotProps.data.id, column.id)"
              @item-unselect="onMultipleAutocompleteEdit(slotProps.data.id, column.id)"
              class="field-editable"
              :multiLine="false"
            />
            <p-dropdown
              v-else-if="getComponentEditorCellForColumnType(column) === 'p-dropdown'"
              :options="getAndSortOptions(columnsEnhanced, column.id)"
              optionLabel="label"
              optionValue="value"
              appendTo="body"
              :value="getDropdownValue(slotProps.data.data[column.id], column)"
              :showClear="true"
              :placeholder="$t('components.datatable.placeholder')"
              @change="onDropdownEdit(slotProps.data.id, column.id, $event)"
              class="field-editable"
            >
              <template #value="slotProps">
                <lck-badge
                  v-if="slotProps.value"
                  :label="slotProps.value.label"
                  :color="slotProps.value.color"
                  :backgroundColor="slotProps.value.backgroundColor"
                />
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
              v-else-if="getComponentEditorCellForColumnType(column) === 'lck-multiselect'"
              :options="getAndSortOptions(columnsEnhanced, column.id)"
              optionLabel="label"
              optionValue="value"
              v-model="multiSelectValues"
              ref="multiselect"
              :placeholder="$t('components.datatable.placeholder')"
              @change="onMultiSelectEdit(slotProps.data.id, column.id, $event)"
              class="field-editable"
            />
            <p-calendar
              v-else-if="getComponentEditorCellForColumnType(column) === 'p-calendar'"
              v-model="slotProps.data.data[column.id]"
              :dateFormat="$t('date.dateFormatPrime')"
              appendTo="body"
              class="field-editable"
            />
            <p-calendar
              v-else-if="getComponentEditorCellForColumnType(column) === 'p-calendar-time'"
              v-model="slotProps.data.data[column.id]"
              :dateFormat="$t('date.dateFormatPrime')"
              :showTime="true"
              appendTo="body"
              class="field-editable"
            />
            <p-input-number
              v-else-if="getComponentEditorCellForColumnType(column) === 'p-input-float'"
              v-model="slotProps.data.data[column.id]"
              mode="decimal"
              :minFractionDigits="2"
              class="field-editable"
            />
            <p-checkbox
              v-else-if="getComponentDisplayCellForColumnType(column) === 'p-checkbox'"
              v-model="slotProps.data.data[column.id]"
              :binary="true"
              @input="onCheckboxEdit(slotProps.data.id, column.id, $event)"
            />
            <component
              v-else
              :is="getComponentEditorCellForColumnType(column)"
              v-model="slotProps.data.data[column.id]"
              appendTo="body"
              class="field-editable"
            />
          </template>
          <template
            #body="slotProps"
          >
            <p-checkbox
              v-if="getComponentDisplayCellForColumnType(column) === 'p-checkbox'"
              :modelValue="getColumnDisplayValue(column, slotProps.data.data[column.id])"
              :binary="true"
              :disabled="true"
            />
            <lck-badge
              v-else-if="getComponentDisplayCellForColumnType(column) === 'lck-badge'"
              v-bind="getColumnDisplayValue(column, slotProps.data.data[column.id])"
            />
            <lck-multi-badges
              v-else-if="getComponentDisplayCellForColumnType(column) === 'lck-multi-badges'"
              :options="getColumnDisplayValue(column, slotProps.data.data[column.id])"
            />
            <lck-cell-file
              v-else-if="getComponentDisplayCellForColumnType(column) === 'lck-input-file'"
              :workspaceId="workspaceId"
              :attachments="slotProps.data.data[column.id]"
              :title="slotProps.data.text + ', ' + column.text"
              :disabled="!isEditableColumn(crudMode, column)"
              @download="$emit('download-attachment', $event)"
              @input="onInputFile(slotProps.data.id, column.id, $event)"
              @remove-attachment="onRemoveAttachment(slotProps.data.id, column.id, $event)"
            />
            <span
              v-else
            >
              {{ getColumnDisplayValue(column, slotProps.data.data[column.id]) }}
            </span>

            <span
              class="cell-state"
              :class="getCellStateNotificationClass(slotProps.data.id, column.id, cellState)"
            />
          </template>
        </p-column>
        </div>
        <template #empty>
          <p align="center">{{ $t('components.datatable.noDataToDisplay') }}</p>
        </template>
      </p-datatable>

      <p-context-menu
        :model="menuModel"
        appendTo="body"
        ref="cm"
      />
    </div>

    <lck-paginator
      v-if="content && content.total > 0"
      :rows="rowsNumber"
      :skip="content && content.skip"
      :limit="content && content.limit"
      :totalRecords="content && content.total"
      v-on="$listeners"
    />
  </div>
  <div v-else>
    {{ $t('components.datatable.noDefinitionAvailable') }}
  </div>
</template>

<script>
import Vue from 'vue'

import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Calendar from 'primevue/calendar'
import Column from 'primevue/column'
import InputSwitch from 'primevue/inputswitch'
import ContextMenu from 'primevue/contextmenu'
import SplitButton from 'primevue/splitbutton'
import Checkbox from 'primevue/checkbox'
import Menu from 'primevue/menu'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import MultiAutoComplete from '@/components/ui/MultiAutoComplete/MultiAutoComplete.vue'
import Paginator from '@/components/ui/Paginator/Paginator.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'
import LckCellFile from '@/components/ui/ColumnType/File/Cell.vue'
import LckCellAction from '@/components/ui/ColumnType/Action/ActionCell.vue'
import LckDropdownButton from '@/components/ui/DropdownButton/DropdownButton'
import URLInput from '@/components/ui/ColumnType/URL/Input.vue'
import Badge from '@/components/ui/Badge/Badge'
import LckMultiBadges from '@/components/ui/MultiBadges/MultiBadges.vue'
import LckButtonConfirmation from '@/components/ui/ButtonConfirmation/ButtonConfirmation'

import { COLUMN_TYPE } from '@locokit/lck-glossary'

import {
  getComponentDisplayCellForColumnType,
  getComponentEditorCellForColumnType,
  isEditableColumn,
  getColumnTypeId,
  getColumnDisplayValue,
  getColumnClass,
} from '@/services/lck-utils/columns'
import { getDisabledProcessTrigger } from '@/services/lck-utils/process'
import { zipArrays } from '@/services/lck-utils/arrays'
import { getCellStateNotificationClass } from '@/services/lck-utils/notification'

export default {
  name: 'LckDatatable',
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-multi-autocomplete': MultiAutoComplete,
    'lck-paginator': Paginator,
    'lck-multiselect': MultiSelect,
    'lck-dropdown-button': LckDropdownButton,
    'lck-url-input': URLInput,
    'lck-badge': Badge,
    'lck-multi-badges': LckMultiBadges,
    'lck-cell-file': LckCellFile,
    'lck-cell-action': LckCellAction,
    'lck-button-confirmation': LckButtonConfirmation,
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-split-button': Vue.extend(SplitButton),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-calendar': Vue.extend(Calendar),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-context-menu': Vue.extend(ContextMenu),
    'p-button': Vue.extend(Button),
    'p-menu': Vue.extend(Menu),
    'p-checkbox': Vue.extend(Checkbox),
  },
  props: {
    actions: {
      type: Array,
      default: () => ([]),
    },
    definition: {
      type: Object,
    },
    content: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([]),
    },
    manualProcesses: {
      type: Array,
      default: () => ([]),
    },
    rowsNumber: {
      type: Number,
      default: 20,
    },
    crudMode: {
      type: Boolean,
      default: false,
    },
    displayCheckIcon: {
      type: Boolean,
      default: false,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    displayDetailButton: {
      type: Boolean,
      default: false,
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
    columnsSetPrefix: {
      type: String,
      default: '',
    },
    workspaceId: {
      type: String,
      default: '',
    },
    duplicateAllowed: {
      type: Boolean,
      default: false,
    },
    deleteAllowed: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      COLUMN_TYPE,
      autocompleteInput: null,
      multipleAutocompleteInput: [],
      currentDateToEdit: null,
      multiSelectValues: [],
      selectedRow: null,
      selectedColumn: null,
      menuModel: [{
        label: this.$t('components.datatable.contextmenu.duplicate'),
        icon: 'pi pi-fw pi-clone',
        command: () => this.$emit('row-duplicate', this.selectedRow),
      }, {
        label: this.$t('components.datatable.contextmenu.delete'),
        icon: 'pi pi-fw pi-trash',
        command: () => this.$emit('row-delete', this.selectedRow),
      },
      ],
      sortField: null,
      sortOrder: 1,
    }
  },
  computed: {
    columnsEnhanced () {
      if (!this.definition.columns) return {}
      const result = {}
      this.definition.columns.forEach(currentColumn => {
        result[currentColumn.id] = {
          // eslint-disable-next-line @typescript-eslint/camelcase
          column_type_id: currentColumn.column_type_id,
        }
        if (
          currentColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
          currentColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
        ) {
          result[currentColumn.id].dropdownOptions = Object.keys(currentColumn.settings?.values || {}).map(k => ({
            value: k,
            label: currentColumn.settings.values[k].label,
            color: currentColumn.settings.values[k].color,
            backgroundColor: currentColumn.settings.values[k].backgroundColor,
            position: currentColumn.settings.values[k].position,
          }))
        }
      })
      return result
    },
    tableWidth () {
      if (!this.definition.columns) return '100%'
      const columnsTotalWidth = this.definition.columns.reduce((acc, c) => acc + (c.style?.width || 150), 0)
      return 'calc(6rem + ' + columnsTotalWidth + 'px)'
    },
    unorderableColumnsNumber () {
      return [this.displayDetailButton].filter(Boolean).length
    },
    editColumnMenuItems () {
      if (!this.selectedColumn) return []
      return [
        {
          label: this.$t('components.datatable.column.edit'),
          icon: 'bi bi-pencil',
          command: () => {
            this.$emit('display-column-sidebar')
          },
        },
        {
          label: this.selectedColumn.displayed ? this.$t('components.datatable.column.hide') : this.$t('components.datatable.column.display'),
          icon: this.selectedColumn.displayed ? 'pi pi-eye-slash' : 'pi pi-eye',
          command: () => {
            const editedColumn = {
              displayed: !this.selectedColumn.displayed,
            }
            // If we want to display the column, we need to transmit it
            if (editedColumn.displayed && !this.selectedColumn.transmitted) {
              editedColumn.transmitted = true
            }
            this.$emit('table-view-column-edit', editedColumn)
          },
        },
        {
          icon: 'pi pi-sort-amount-up',
          label: this.$t('components.datatable.column.ascOrder'),
          visible: this.isSortableColumn(this.selectedColumn),
          command: () => {
            this.sortField = this.selectedColumn.id
            this.sortOrder = 1
            this.onSort()
          },
        },
        {
          icon: 'pi pi-sort-amount-down',
          label: this.$t('components.datatable.column.descOrder'),
          visible: this.isSortableColumn(this.selectedColumn),
          command: () => {
            this.sortField = this.selectedColumn.id
            this.sortOrder = -1
            this.onSort()
          },
        },
      ]
    },
  },
  methods: {
    getColumnDisplayValue,
    getCellStateNotificationClass,
    isEditableColumn,
    getDisabledProcessTrigger,
    getColumnClass,
    getDropdownValue (value, column) {
      if (value && column.settings?.values[value]) {
        const columnTagInfo = column.settings.values[value]
        return { value, color: columnTagInfo?.color, backgroundColor: columnTagInfo.backgroundColor, label: columnTagInfo.label }
      }
    },
    getAndSortOptions (columnsEnhanced, columnId) {
      if (columnsEnhanced && columnsEnhanced[columnId] && columnsEnhanced[columnId]?.dropdownOptions) {
        return columnsEnhanced[columnId]?.dropdownOptions.sort((a, b) => a.position - b.position)
      }
    },
    getComponentEditorCellForColumnType (column) {
      return getComponentEditorCellForColumnType(getColumnTypeId(column))
    },
    getComponentDisplayCellForColumnType (column) {
      return getComponentDisplayCellForColumnType(getColumnTypeId(column))
    },
    addClassNotEditableColumn (crudMode, column) {
      if (!isEditableColumn(crudMode, column)) return 'no-editable-field'
    },
    formatManualProcesses (rowId) {
      if (this.manualProcesses.length > 0) {
        return [
          {
            label: this.$t('components.processPanel.title'),
            items: this.manualProcesses.map(process => {
              const isProcessDisabled = getDisabledProcessTrigger(process, rowId)
              return {
                label: process.text,
                disabled: isProcessDisabled,
                icon: isProcessDisabled ? 'bi bi-x-circle' : 'bi bi-play-circle',
                command: () => {
                  this.$emit('create-process-run', {
                    rowId,
                    processId: process.id,
                    name: process.text,
                  })
                },
              }
            }),
          },
        ]
      }
    },
    isSortableColumn (column) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.SINGLE_SELECT:
        case COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN:
          return false
        default:
          return true
      }
    },
    async onComplete ({ column_type_id: columnTypeId, settings, foreign_filter: filter }, { query }) {
      this.$emit(
        'update-suggestions',
        { columnTypeId, settings, filter },
        { query },
      )
    },
    onColumnResize (event) {
      this.$emit(
        'column-resize',
        event.element.offsetWidth,
        event.element.querySelector('[data-column-id]')?.attributes['data-column-id'].value,
      )
    },
    onColumnReorder (event) {
      this.$emit('column-reorder', {
        fromIndex: event.dragIndex - this.unorderableColumnsNumber,
        toIndex: event.dropIndex - this.unorderableColumnsNumber,
      })
    },
    onDropdownEdit (rowId, columnId, event) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event.value,
      })
    },
    onMultiSelectEdit (rowId, columnId, event) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event.value, // .map(v => v.value)
      })
    },
    onAutocompleteEdit (rowId, columnId, event = null) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event ? event?.value?.value : null,
      })
    },
    onMultipleAutocompleteEdit (rowId, columnId) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: this.multipleAutocompleteInput.map(item => item.value),
      })
    },
    onCheckboxEdit (rowId, columnId, newValue) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue,
      })
    },
    /**
     * Upload one or multiple files to the API
     */
    onInputFile (rowId, columnId, fileList = []) {
      this.$emit('upload-files', {
        rowId,
        columnId,
        fileList,
      })
    },
    onRemoveAttachment (rowId, columnId, attachmentId) {
      this.$emit('remove-attachment', {
        rowId,
        columnId,
        attachmentId,
      })
    },
    /**
     * This method have to be called only for fields that don't trigger an "update-cell" event
     *
     * So, please add your column_type if you already trigger this event in a specific handler
     */
    async onCellEditComplete (event) {
      // we init the value to the current value
      const value = event.data.data[event.field]
      const currentColumn = this.definition.columns.find(c => c.id === event.field)
      // then we update it
      switch (currentColumn.column_type_id) {
        case COLUMN_TYPE.MULTI_SELECT:
          /**
           * On this case, we'll need to preventDefault the cell-edit-complete event
           * to avoid the hiding of the MultiSelect component.
           * To do this, we need to know if the user click outside the MultiSelect component.
           * We have two DOM Element to check : the MultiSelect ref + the panel.
           */
          const currentMultiSelectElement = this.$refs.multiselect?.[0]?.$el
          const currentMultiSelectPanelElement = document.querySelector('.p-multiselect-panel.p-component')
          if (
            currentMultiSelectElement?.contains(event.originalEvent.target) ||
            currentMultiSelectPanelElement?.contains(event.originalEvent.target)
          ) event.preventDefault()
          return
        case COLUMN_TYPE.TEXT:
          // On this case, we'll need to preventDefault the cell-edit-complete event
          // to avoid the hiding of the text component when the enter key is pressed.
          if (event.type === 'enter') {
            event.preventDefault()
            return
          }
          break
        case COLUMN_TYPE.SINGLE_SELECT:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.MULTI_USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.MULTI_GROUP:
        case COLUMN_TYPE.FILE:
          /**
           * For these type of column
           * the dropdown edit is already here
           * to emit the event
           */
          return
        case COLUMN_TYPE.DATE:
        case COLUMN_TYPE.DATETIME:
          /**
           * For the date, and the Calendar component,
           * we need to check if the user has really click outside the calendar,
           * or if he's just switching between months and for a DATETIME field, if he selects a day and a time.
           * For that, we'll check in the DOM directly with the event target.
           */
          const target = event.originalEvent.target
          if (target.closest('.p-datepicker, .p-datepicker-header') !== null) {
            if (currentColumn.column_type_id === COLUMN_TYPE.DATETIME || !target.className.includes('p-highlight')) {
              event.preventDefault()
              return
            }
          }
          break
      }
      this.$emit('update-cell', {
        rowId: event.data.id,
        columnId: event.field,
        newValue: value,
      })
    },
    onCellEditInit ({ data, field }) {
      const currentColumnDefinition = this.columnsEnhanced[field]
      switch (currentColumnDefinition.column_type_id) {
        case COLUMN_TYPE.MULTI_SELECT:
          this.multiSelectValues = data.data[field]
          break
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
          this.autocompleteInput = data.data[field]?.value || null
          break
        case COLUMN_TYPE.MULTI_USER:
        case COLUMN_TYPE.MULTI_GROUP:
          this.multipleAutocompleteInput = zipArrays(data.data[field]?.reference, data.data[field]?.value, 'value', 'label')
          break
      }
    },
    onSort () {
      this.$emit('sort', {
        field: this.sortField,
        order: this.sortOrder,
      })
    },
    onRowContextMenu (event) {
      this.$refs.cm.show(event.originalEvent)
    },
    onEditColumnClick (event, column) {
      this.$emit('column-select', column)
      this.$refs['menu' + column.id][0].toggle(event)
      this.selectedColumn = column
    },
    onEditActionColumnClick (event, action) {
      this.$refs.menuAction.toggle(event)
      this.$emit('action-column-select', action)
    },
  },
  watch: {
    definition: {
      handler () {
        /**
         * Special hack for Prime DataTable,
         * when we resize columns, the table[style] keep the width,
         * even if we change the columns.
         * Here, we remove the style attribute from the table DOM Element.
         * Related to https://gitlab.makina-corpus.net/lck/lck-front/-/issues/150
         */
        const tableWithStyle = this.$refs['p-datatable']?.$el.querySelector('table[style]')
        if (tableWithStyle) {
          tableWithStyle.removeAttribute('style')
        }
      },
      deep: true,
    },
  },
}
</script>

<style scoped>

::v-deep tr.p-highlight-contextmenu td .p-checkbox  .p-checkbox-box {
  border: 2px solid #fff;
  background-color: #fff;
}
::v-deep td .p-checkbox {
  display: flex;
  margin: 0 auto;
}

::v-deep td .p-checkbox .p-checkbox-box {
  border-color: var(--primary-color-light);
}

::v-deep td .p-checkbox .p-checkbox-box.p-highlight {
  border-color: var(--primary-color-light);
  background: var(--primary-color-light);
}

::v-deep td .p-checkbox .p-checkbox-box .p-checkbox-icon {
  color: var(--primary-color-dark) !important;
  font-weight: var(--font-weight-bold);;
}

::v-deep td .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover {
  border-color: var(--primary-color-dark);
  background: var(--primary-color-dark);
}

::v-deep td .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover .p-checkbox-icon {
  color: var(--primary-color-light) !important;
}

::v-deep td .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus {
  box-shadow: 0 0 0 0.2rem var(--primary-color-light);
  border-color: var(--primary-color) !important;
}

::v-deep .p-editable-column.p-cell-editing .p-dropdown,
::v-deep .p-editable-column.p-cell-editing .p-multiselect {
  border: 1px solid var(--primary-color);
  border-radius: 0;
}

::v-deep .p-datatable-resizable > .p-datatable-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

::v-deep .p-cell-editing .p-inputtextarea {
  border: 1px solid var(--primary-color);
  border-radius: 0;
  background-color: white;
  z-index: 2;
  width: 320px;
  height: 160px;
}

::v-deep .edit-column-icon {
  color: inherit !important;
  background: transparent !important;
  border: 0;
  height: 1.5em;
}

::v-deep .p-datatable .LckCellFile .p-dialog-title {
  white-space: normal;
}

</style>

<style>

.p-datatable.p-datatable-sm .p-datatable-thead > tr > th div.th-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.p-datatable.p-datatable-sm .p-datatable-thead > tr > th div.th-container span.th-text {
  display: inline-block;
  overflow: hidden;
  width: calc(100% - 1rem);
  text-overflow: ellipsis;
  background-color: inherit;
}

.p-datatable.p-datatable-sm.p-datatable-resizable > .p-datatable-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
  overflow-x: initial;
}

.p-datatable.p-datatable-sm .p-datatable-thead > tr > th.p-resizable-column {
  min-width: 100px;
  padding-right: 5px;
}

tr.p-datatable-emptymessage {
  height: 10rem;
}

.p-datatable .p-datatable-tbody > tr.p-datatable-emptymessage > td {
  text-align: center;
}

.p-datatable.is-reorderable th:hover {
  cursor: grab;
}

.p-datatable .p-datatable-tbody > tr.p-highlight-contextmenu {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
}

.p-datatable th:hover .p-sortable-column-icon {
  cursor: pointer;
}

.responsive-table-wrapper {
  width: 100%;
  overflow-x: auto;
  /* max-height: 75vh; */
}

/**
 * we want a absolute position for editable fields,
 * only for those who are not with an overlay
 */
.field-editable:not(.p-component-overlay) {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100%;
}

.p-datatable .sticky-column-cells {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: inherit;
  background-clip: padding-box;
}

.p-datatable.is-reorderable th.sticky-column-cells:hover {
  cursor: default;
}

.p-datatable .p-datatable-reorder-indicator-up,
.p-datatable .p-datatable-reorder-indicator-down {
  z-index: 1;
}

.button-group .lck-dropdownbutton .lck-dropdownbutton-menubutton {
  padding: 0.4375rem 0.875rem;
}

.button-group .lck-dropdownbutton .lck-dropdownbutton-menubutton:after {
  display: none;
}

.lck-cell-action {
  padding: 0.2rem;
}

.lck-cell-action > .action-button > .p-button-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-height: 2.5rem;
}

</style>
