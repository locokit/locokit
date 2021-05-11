<template>
  <div
    v-if="definition"
    class="p-d-flex p-flex-column d-flex-1 o-auto p-jc-between"
    style="min-height: 30rem;"
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

        style="width: unset !important;"

        @sort="onSort"
        :sortField.sync="sortField"
        :sortOrder.sync="sortOrder"

        ref="p-datatable"

        :context-menu="crudMode"
        :context-menu-selection.sync="selectedRow"
        @row-contextmenu="onRowContextMenu"
      >
        <p-column
          v-if="displayDetailButton && definition.columns && definition.columns.length > 0"
          headerStyle="width: 6rem; padding: 0 0.1rem; margin: unset;"
          bodyStyle="width: 6rem; padding: 0 0.1rem; margin: unset; text-align: center; box-shadow: 1px 0 0 0 #eee; overflow: hidden;"
          headerClass="sticky-column-cells"
          bodyClass="sticky-column-cells"
          columnKey="detail-column"
          :reorderableColumn="false"
        >
          <template #body="slotProps">
            <span class="button-group">
              <p-button
                class="p-button-sm p-button-text p-button-rounded"
                icon="pi pi-window-maximize"
                @click="$emit('open-detail', slotProps.data.id)"
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
        <div
          v-for="column in definition.columns"
          :key="`${columnsSetPrefix}-${column.id}-${unorderableColumnsNumber}`"
        >
          <p-column
            :field="column.id"
            :headerStyle="{
              width: ( ( column.style && column.style.width ) || '150' ) + 'px',
              overflow: 'hidden',
              'white-space': 'nowrap',
              'text-overflow': 'ellipsis',
              'height': '2.5rem'
            }"
            :bodyStyle="{
              width: ( ( column.style && column.style.width ) || '150' ) + 'px',
              'white-space': 'nowrap',
              'position': 'relative',
              'height': '2.5rem',
            }"
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
                style="position: absolute; right: 0; width: 1rem;"
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
          <template #editor="slotProps" v-if="getComponentEditorCellForColumnType(column) && isEditableColumn(crudMode, column)">
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
              :options="columnsEnhanced && columnsEnhanced[column.id] && columnsEnhanced[column.id].dropdownOptions"
              optionLabel="label"
              optionValue="value"
              appendTo="body"
              :value="slotProps.data.data[column.id]"
              :showClear="true"
              :placeholder="$t('components.datatable.placeholder')"
              @change="onDropdownEdit(slotProps.data.id, column.id, $event)"
              class="field-editable"
            >
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
              :options="columnsEnhanced && columnsEnhanced[column.id] && columnsEnhanced[column.id].dropdownOptions"
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
              v-model="currentDateToEdit"
              @show="onShowCalendar(column, slotProps.data.data[column.id])"
              :dateFormat="$t('date.dateFormatPrime')"
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
              v-model="slotProps.data.data[column.id]"
              :binary="true"
              :disabled="!isEditableColumn(crudMode, column)"
              @input="onCheckboxEdit(slotProps.data.id, column.id, $event)"
            />
            <lck-badge
              v-else-if="getComponentDisplayCellForColumnType(column) === 'lck-badge'"
              v-bind="getColumnDisplayValue(column, slotProps.data.data[column.id])"
            />
            <span
              v-else
            >
              {{ getColumnDisplayValue(column, slotProps.data.data[column.id]) }}
            </span>

            <span
              class="cell-state"
              :class="{
                'saving': (cellState.rowId === slotProps.data.id && cellState.columnId === column.id && cellState.waiting),
                'saved': (cellState.rowId === slotProps.data.id && cellState.columnId === column.id && !cellState.waiting),
                'valid': (cellState.rowId === slotProps.data.id && cellState.columnId === column.id && cellState.isValid),
                'error': (cellState.rowId === slotProps.data.id && cellState.columnId === column.id && !cellState.isValid)
              }"
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
import LckDropdownButton from '@/components/ui/DropdownButton/DropdownButton'
import InputURL from '@/components/ui/InputURL/InputURL.vue'
import Badge from '@/components/ui/Badge/Badge'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { parseISO } from 'date-fns'

import {
  getComponentDisplayCellForColumnType,
  getComponentEditorCellForColumnType,
  isEditableColumn,
  getColumnTypeId,
  getColumnDisplayValue,
  getColumnClass
} from '@/services/lck-utils/columns'
import { getDisabledProcessTrigger } from '@/services/lck-utils/process'
import { formatDateISO } from '@/services/lck-utils/date'
import { zipArrays } from '@/services/lck-utils/arrays'

export default {
  name: 'LckDatatable',
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-multi-autocomplete': MultiAutoComplete,
    'lck-paginator': Paginator,
    'lck-multiselect': MultiSelect,
    'lck-dropdown-button': LckDropdownButton,
    'lck-input-url': InputURL,
    'lck-badge': Badge,
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
    'p-checkbox': Vue.extend(Checkbox)
  },
  props: {
    definition: {
      type: Object
    },
    content: {
      type: Object
    },
    loading: {
      type: Boolean,
      default: false
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([])
    },
    manualProcesses: {
      type: Array,
      default: () => ([])
    },
    rowsNumber: {
      type: Number,
      default: 20
    },
    crudMode: {
      type: Boolean,
      default: false
    },
    locked: {
      type: Boolean,
      default: false
    },
    displayDetailButton: {
      type: Boolean,
      default: false
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
    columnsSetPrefix: {
      type: String,
      default: ''
    }
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
        icon: 'pi pi-fw pi-search',
        command: () => this.$emit('row-duplicate', this.selectedRow)
      }, {
        label: this.$t('components.datatable.contextmenu.delete'),
        icon: 'pi pi-fw pi-times',
        command: () => this.$emit('row-delete', this.selectedRow)
      }
      ],
      sortField: null,
      sortOrder: 1
    }
  },
  computed: {
    columnsEnhanced () {
      if (!this.definition.columns) return {}
      const result = {}
      this.definition.columns.forEach(currentColumn => {
        result[currentColumn.id] = {
          // eslint-disable-next-line @typescript-eslint/camelcase
          column_type_id: currentColumn.column_type_id
        }
        if (
          currentColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
          currentColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
        ) {
          result[currentColumn.id].dropdownOptions = Object.keys(currentColumn.settings?.values || {}).map(k => ({
            value: k,
            label: currentColumn.settings.values[k].label,
            color: currentColumn.settings.values[k].color,
            backgroundColor: currentColumn.settings.values[k].backgroundColor
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
          icon: 'pi pi-pencil',
          command: () => {
            this.$emit('display-column-sidebar')
          }
        },
        {
          label: this.selectedColumn.displayed ? this.$t('components.datatable.column.hide') : this.$t('components.datatable.column.display'),
          icon: this.selectedColumn.displayed ? 'pi pi-eye-slash' : 'pi pi-eye',
          command: () => {
            this.$emit('table-view-column-edit', {
              displayed: !this.selectedColumn.displayed
            })
          }
        },
        {
          icon: 'pi pi-sort-amount-up',
          label: this.$t('components.datatable.column.ascOrder'),
          visible: this.isSortableColumn(this.selectedColumn),
          command: () => {
            this.sortField = this.selectedColumn.id
            this.sortOrder = 1
            this.onSort()
          }
        },
        {
          icon: 'pi pi-sort-amount-down',
          label: this.$t('components.datatable.column.descOrder'),
          visible: this.isSortableColumn(this.selectedColumn),
          command: () => {
            this.sortField = this.selectedColumn.id
            this.sortOrder = -1
            this.onSort()
          }
        }
      ]
    }
  },
  methods: {
    getComponentEditorCellForColumnType (column) {
      return getComponentEditorCellForColumnType(getColumnTypeId(column))
    },
    getComponentDisplayCellForColumnType (column) {
      return getComponentDisplayCellForColumnType(getColumnTypeId(column))
    },
    getColumnDisplayValue,
    isEditableColumn,
    getDisabledProcessTrigger,
    getColumnClass,
    formatManualProcesses (rowId) {
      if (this.manualProcesses.length > 0) {
        return [
          {
            label: this.$t('components.processPanel.title'),
            items: this.manualProcesses.map(process => {
              return {
                label: process.text,
                disabled: getDisabledProcessTrigger(process, rowId),
                icon: 'pi pi-play',
                command: () => {
                  this.$emit('create-process-run', {
                    rowId,
                    processId: process.id,
                    name: process.text
                  })
                }
              }
            })
          }
        ]
      }
    },
    isSortableColumn (column) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.SINGLE_SELECT:
          return false
        default:
          return true
      }
    },
    isSingleSelect (column) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.SINGLE_SELECT:
          return false
        default:
          return true
      }
    },
    onShowCalendar ({ column_type_id: columnTypeId }, value) {
      /**
       * TODO: the event "show" is trigerred right after a calendar is closed... strange.
       * so, from time to time, the currentDateToEdit is scratched with the previous date edited...
       */
      switch (columnTypeId) {
        case COLUMN_TYPE.DATE:
          this.currentDateToEdit = null
          try {
            if (value) {
              this.currentDateToEdit = parseISO(value)
            }
          } catch (error) {
            // eslint-disable no-console
            console.error(error)
          }
          break
      }
    },
    async onComplete ({ column_type_id: columnTypeId, settings }, { query }) {
      this.$emit(
        'update-suggestions',
        { columnTypeId, settings },
        { query }
      )
    },
    onColumnResize (event) {
      this.$emit(
        'column-resize',
        event.element.offsetWidth,
        event.element.querySelector('[data-column-id]')?.attributes['data-column-id'].value
      )
    },
    onColumnReorder (event) {
      this.$emit('column-reorder', {
        fromIndex: event.dragIndex - this.unorderableColumnsNumber,
        toIndex: event.dropIndex - this.unorderableColumnsNumber
      })
    },
    onDropdownEdit (rowId, columnId, event) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event.value
      })
    },
    onMultiSelectEdit (rowId, columnId, event) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event.value // .map(v => v.value)
      })
    },
    onAutocompleteEdit (rowId, columnId, event = null) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event ? event?.value?.value : null
      })
    },
    onMultipleAutocompleteEdit (rowId, columnId) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: this.multipleAutocompleteInput.map(item => item.value)
      })
    },
    onCheckboxEdit (rowId, columnId, newValue) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue
      })
    },
    /**
     * This method have to be called only for fields that don't trigger an "update-cell" event
     *
     * So, please add your column_type if you already trigger this event in a specific handler
     */
    async onCellEditComplete (event) {
      // we init the value to the current value
      let value = event.data.data[event.field]
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
        case COLUMN_TYPE.SINGLE_SELECT:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.MULTI_USER:
        case COLUMN_TYPE.GROUP:
          /**
           * For these type of column
           * the dropdown edit is already here
           * to emit the event
           */
          return
        case COLUMN_TYPE.DATE:
          /**
           * For the date, and the Calendar component,
           * we need to check if the user has really click outside the calendar,
           * or if he's just switching between months.
           * For that, we'll check in the DOM directly with the event target.
           */
          if (event.originalEvent.target.className.indexOf('p-datepicker') > -1) {
            event.preventDefault()
            return
          }
          /**
           * in case of a Date, value is stored in the currentDateToEdit data
           * we format it in the date representation,
           * we just want to store the date
           */
          if (this.currentDateToEdit instanceof Date) {
            value = formatDateISO(this.currentDateToEdit)
          } else if (this.currentDateToEdit === '') {
            value = null
          } else {
            return
          }
          break
      }
      this.$emit('update-cell', {
        rowId: event.data.id,
        columnId: event.field,
        newValue: value
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
          this.multipleAutocompleteInput = zipArrays(data.data[field]?.reference, data.data[field]?.value, 'value', 'label')
          break
      }
    },
    onSort () {
      this.$emit('sort', {
        field: this.sortField,
        order: this.sortOrder
      })
    },
    onRowContextMenu (event) {
      this.$refs.cm.show(event.originalEvent)
    },
    onEditColumnClick (event, column) {
      this.$emit('column-select', column)
      this.$refs['menu' + column.id][0].toggle(event)
      this.selectedColumn = column
    }
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
      deep: true
    }
  }
}
</script>

<style scoped>

/deep/ tr.p-highlight-contextmenu td .p-checkbox  .p-checkbox-box {
  border: 2px solid #fff;
  background-color: #fff;
}
/deep/ td .p-checkbox {
  display: flex;
  margin: 0 auto;
}

/deep/ td .p-checkbox .p-checkbox-box {
  border-color: var(--primary-color-lighten);
}

/deep/ td .p-checkbox .p-checkbox-box.p-highlight {
  border-color: var(--primary-color-lighten);
  background: var(--primary-color-lighten);
}

/deep/ td .p-checkbox .p-checkbox-box .p-checkbox-icon {
  color: var(--primary-color-darken) !important;
  font-weight: bold;
}

/deep/ td .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover {
  border-color: var(--primary-color-darken);
  background: var(--primary-color-darken);
}

/deep/ td .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover .p-checkbox-icon {
  color: var(--primary-color-lighten) !important;
}

/deep/ .p-editable-column.p-cell-editing .p-dropdown,
/deep/ .p-editable-column.p-cell-editing .p-multiselect {
  border: 1px solid var(--primary-color);
  border-radius: 0;
}

/deep/ .p-datatable-resizable > .p-datatable-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

/deep/ .p-cell-editing .p-inputtextarea {
  border: 1px solid var(--primary-color);
  border-radius: 0;
  background-color: white;
  z-index: 2;
  width: 320px;
  height: 160px;
}

/deep/ .edit-column-icon {
  color: inherit !important;
  background: transparent !important;
  border: 0;
  height: 1.5em;
}

</style>

<style>

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
  background-color: var(--primary-color-lighten)
}

.p-datatable th:hover .p-sortable-column-icon {
  cursor: pointer;
}

.responsive-table-wrapper {
  width: 100%;
  overflow-x: auto;
  max-height: 75vh;
}

.field-editable {
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

</style>
