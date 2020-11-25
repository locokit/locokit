<template>
  <div
    v-if="definition"
    class="p-d-flex p-flex-column d-flex-1 o-auto p-jc-between"
  >
    <!--
    :scrollable="true"
    scrollHeight="500px"
    :virtualScroll="true"
    :virtualRowHeight="38"
    @virtual-scroll="onVirtualScroll"
   -->
    <div
      class="responsive-table-wrapper p-fluid d-flex-1 p-d-flex"
    >
      <p-datatable
        v-if="definition.columns && definition.columns.length > 0"
        class="
          p-datatable-sm
          p-datatable-gridlines
          p-d-flex
          p-flex-column
          justify-between
        "

        :style="{
          'flex-basis': '0',
          position: 'sticky',
          left: 0,
          'z-index': 1
        }"

        :value="content && content.data"

        :lazy="true"
        :loading="loading"

        :context-menu="crudMode"
        :context-menu-selection.sync="selectedRow"
        @row-contextmenu="onRowContextMenu"
      >
        <p-column
          v-if="displayDetailButton"
          headerStyle="width: 3rem; height: 2.5rem; padding: unset; margin: unset;"
          bodyStyle="width: 3rem; height: 2.5rem; padding: unset; margin: unset; text-align: center;"
        >
          <template #body="slotProps">
            <p-button
              class="p-button-sm p-button-text p-button-rounded"
              icon="pi pi-window-maximize"
              @click="$emit('open-detail', slotProps.data.id)"/>
          </template>
        </p-column>
      </p-datatable>

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

        style="width: unset !important;"

        @sort="onSort"

        ref="p-datatable"

        :context-menu="crudMode"
        :context-menu-selection.sync="selectedRow"
        @row-contextmenu="onRowContextMenu"
      >
        <p-column
          v-for="column in definition.columns"
          :key="column.id"
          :field="column.id"
          :headerStyle="{
            width: ( ( column.display && column.display.width ) || '150' ) + 'px',
            overflow: 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'height': '2.5rem'
          }"
          :bodyStyle="{
            width: ( ( column.display && column.display.width ) || '150' ) + 'px',
            'white-space': 'nowrap',
            'position': 'relative',
            'height': '2.5rem'
          }"
          :sortable="isSortableColumn(column)"
        >
          <template #header>
            <span :data-column-id="column.id">
              {{ column.text }}
            </span>
          </template>
          <template #editor="slotProps" v-if="isEditableColumn(crudMode, column)">
            <lck-autocomplete
              v-if="getComponentEditableColumn(column.column_type_id) === 'lck-autocomplete'"
              :dropdown="true"
              :placeholder="$t('components.datatable.placeholder')"
              field="label"
              appendTo="body"
              v-model="autocompleteInput"
              :suggestions="autocompleteSuggestions"
              @search="onComplete(column, $event)"
              @item-select="onAutocompleteEdit(slotProps.data.id, column.id, $event)"
              class="field-editable"
            />
            <p-dropdown
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-dropdown'"
              :options="columnsEnhanced && columnsEnhanced[column.id] && columnsEnhanced[column.id].dropdownOptions"
              optionLabel="label"
              optionValue="value"
              appendTo="body"
              :value="slotProps.data.data[column.id]"
              :showClear="true"
              :placeholder="$t('components.datatable.placeholder')"
              @change="onDropdownEdit(slotProps.data.id, column.id, $event)"
              class="field-editable"
            />
            <lck-multiselect
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'lck-multiselect'"
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
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-calendar'"
              v-model="currentDateToEdit"
              @show="onShowCalendar(column, slotProps.data.data[column.id])"
              @date-select="onCalendarEdit(slotProps.data.id, column.id)"
              :dateFormat="$t('date.dateFormatPrime')"
              appendTo="body"
              class="field-editable"
            />
            <p-input-number
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-input-float'"
              v-model="slotProps.data.data[column.id]"
              mode="decimal"
              :minFractionDigits="2"
            />
            <component
              v-else
              :is="getComponentEditableColumn(column.column_type_id)"
              v-model="slotProps.data.data[column.id]"
              appendTo="body"
              class="field-editable"
            />
          </template>

          <template
            #body="slotProps"
          >
            {{ getValue(column, slotProps.data.data[column.id]) }}
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

        <template #empty>
          {{ $t('components.datatable.noDataToDisplay') }}
        </template>
      </p-datatable>

      <p-context-menu
        :model="menuModel"
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
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/camelcase */

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

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import Paginator from '@/components/ui/Paginator/Paginator.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import {
  formatISO,
  lightFormat,
  parseISO
} from 'date-fns'

import { getComponentEditableColumn, isEditableColumn } from '@/services/lck-utils/columns'

export default {
  name: 'LckDatatable',
  components: {
    'lck-autocomplete': AutoComplete,
    'lck-paginator': Paginator,
    'lck-multiselect': MultiSelect,
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-number': Vue.extend(InputNumber),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-calendar': Vue.extend(Calendar),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-context-menu': Vue.extend(ContextMenu),
    'p-button': Vue.extend(Button)
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
    }
  },
  data () {
    return {
      autocompleteInput: null,
      currentDateToEdit: null,
      multiSelectValues: [],
      selectedRow: null,
      menuModel: [{
        label: this.$t('components.datatable.contextmenu.duplicate'),
        icon: 'pi pi-fw pi-search',
        command: () => this.$emit('row-duplicate', this.selectedRow)
      }, {
        label: this.$t('components.datatable.contextmenu.delete'),
        icon: 'pi pi-fw pi-times',
        command: () => this.$emit('row-delete', this.selectedRow)
      }
      ]
    }
  },
  computed: {
    columnTypeClass () {
      return {
        [COLUMN_TYPE.BOOLEAN]: 'text',
        [COLUMN_TYPE.STRING]: 'text',
        [COLUMN_TYPE.NUMBER]: 'text',
        [COLUMN_TYPE.FLOAT]: 'text',
        [COLUMN_TYPE.DATE]: 'text',
        [COLUMN_TYPE.TEXT]: 'p-textarea',
        [COLUMN_TYPE.USER]: 'p-tag',
        [COLUMN_TYPE.GROUP]: 'p-tag',
        [COLUMN_TYPE.RELATION_BETWEEN_TABLES]: 'p-tag',
        [COLUMN_TYPE.LOOKED_UP_COLUMN]: 'p-tag',
        [COLUMN_TYPE.SINGLE_SELECT]: 'p-tag',
        [COLUMN_TYPE.MULTI_SELECT]: 'p-tag',
        [COLUMN_TYPE.FORMULA]: 'p-tag',
        [COLUMN_TYPE.FILE]: 'text'
      }
    },
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
          result[currentColumn.id].dropdownOptions = Object.keys(currentColumn.settings.values).map(k => ({
            value: k,
            label: currentColumn.settings.values[k].label
          }))
        }
      })
      return result
    },
    tableWidth () {
      if (!this.definition.columns) return '100%'
      const columnsTotalWidth = this.definition.columns.reduce((acc, c) => acc + (c.display?.width || 150), 0)
      return 'calc(3rem + ' + columnsTotalWidth + 'px)'
    }
  },
  methods: {
    getComponentEditableColumn,
    isEditableColumn,
    getValue (column, data = '') {
      if (
        data === '' ||
        data === null
      ) return ''
      try {
        switch (column.column_type_id) {
          case COLUMN_TYPE.USER:
          case COLUMN_TYPE.GROUP:
          case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
          case COLUMN_TYPE.LOOKED_UP_COLUMN:
          case COLUMN_TYPE.FORMULA:
            return data.value
          case COLUMN_TYPE.SINGLE_SELECT:
            return column.settings.values[data]?.label
          case COLUMN_TYPE.MULTI_SELECT:
            if (data.length > 0) {
              return data.map(d => column.settings.values[d]?.label).join(', ')
            } else {
              return ''
            }
          case COLUMN_TYPE.DATE:
          // eslint-disable-next-line no-case-declarations
            return lightFormat(parseISO(data), this.$t('date.dateFormat')) || ''
          default:
            return data
        }
      } catch (error) {
        // eslint-disable no-console
        console.error('Field with bad format', data, error)
        return ''
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
    // eslint-disable-next-line @typescript-eslint/camelcase
    onShowCalendar ({ column_type_id }, value) {
      /**
       * TODO: the event "show" is trigerred right after a calendar is closed... strange.
       * so, from time to time, the currentDateToEdit is scratched with the previous date edited...
       */
      // eslint-disable-next-line @typescript-eslint/camelcase
      switch (column_type_id) {
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
    async onComplete ({ column_type_id, settings }, { query }) {
      this.$emit(
        'update-suggestions',
        { column_type_id, settings },
        { query }
      )
    },
    onColumnResize (event) {
      this.$emit(
        'column-resize',
        event.element.offsetWidth,
        event.element.querySelector('[data-column-id]').attributes['data-column-id'].value
      )
    },
    onColumnReorder (event) {
      // if we are in crud mode, a ref column is displayed
      this.$emit('column-reorder', {
        fromIndex: event.dragIndex,
        toIndex: event.dropIndex
      })
    },
    async onDropdownEdit (rowId, columnId, event) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event.value
      })
    },
    async onMultiSelectEdit (rowId, columnId, event) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event.value // .map(v => v.value)
      })
    },
    async onAutocompleteEdit (rowId, columnId, event) {
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: event.value.value
      })
    },
    async onCalendarEdit (rowId, columnId) {
      /**
       * in case of a Date, value is stored in the currentDateToEdit data
       * we format it in the date representation,
       * we just want to store the date
       */
      this.$emit('update-cell', {
        rowId,
        columnId,
        newValue: this.currentDateToEdit ? formatISO(this.currentDateToEdit, { representation: 'date' }) : null
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
            currentMultiSelectElement.contains(event.originalEvent.target) ||
            currentMultiSelectPanelElement.contains(event.originalEvent.target)
          ) event.preventDefault()
          return
        case COLUMN_TYPE.SINGLE_SELECT:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.USER:
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
          if (this.currentDateToEdit) {
            value = formatISO(this.currentDateToEdit, { representation: 'date' })
          } else {
            value = null
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
      }
    },
    onSort (event) {
      this.$emit('sort', {
        field: event.sortField,
        order: event.sortOrder
      })
    },
    onRowContextMenu (event) {
      this.$refs.cm.show(event.originalEvent)
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
}

.field-editable {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100%;
}

</style>
