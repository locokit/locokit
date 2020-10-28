<template>
  <div
    v-if="block.definition"
  >
    <!--
    :scrollable="true"
    scrollHeight="500px"
    :virtualScroll="true"
    :virtualRowHeight="38"
    @virtual-scroll="onVirtualScroll"
   -->
    <div
      class="responsive-table-wrapper"
    >
      <p-datatable
        class="
          p-datatable-sm
          p-datatable-gridlines
          p-d-flex
          d-flex-1
          p-flex-column
          justify-between
        "
        :class="{
          'is-reorderable': crudMode
        }"

        :style="{
          width: tableWidth + 'px'
        }"

        :value="block && block.content && block.content.data"

        :lazy="true"
        :loading="block.loading"

        editMode="cell"
        @cell-edit-complete="onCellEditComplete"

        :resizableColumns="true"
        columnResizeMode="expand"
        @column-resize-end="onColumnResize"

        :reorderableColumns="crudMode"
        @column-reorder="onColumnReorder"

        style="width: unset !important;"

        @sort="onSort"
      >
        <p-column
          v-for="column in block.definition.columns"
          :key="column.id"
          :field="column.id"
          :headerStyle="{
            width: ( ( column.settings && column.settings.width ) || '150' ) + 'px',
            overflow: 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis'
          }"
          :bodyStyle="{
            width: ( ( column.settings && column.settings.width ) || '150' ) + 'px',
            overflow: 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'position': 'relative'
          }"
          :sortable="isSortableColumn(column)"
        >
          <template #header>
            <span :data-column-id="column.id">
              {{ column.text }}
            </span>
          </template>
          <template #editor="slotProps" v-if="isEditableColumn(column)">
            <!--
              @focus="autocompleteInput = slotProps.data.data[column.id] && slotProps.data.data[column.id].value"
            -->
            <lck-autocomplete
              v-if="getComponentEditableColumn(column.column_type_id) === 'lck-autocomplete'"
              :dropdown="true"
              :placeholder="$t('components.dropdown.placeholder')"
              field="label"
              appendTo="body"
              v-model="autocompleteInput[column.id]"
              :suggestions="autocompleteSuggestions"
              @complete="onComplete(column, $event)"
              @item-select="onAutocompleteEdit(slotProps.index, column.id, $event)"
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
              :placeholder="$t('components.dropdown.placeholder')"
              @change="onDropdownEdit(slotProps.index, column.id, $event)"
              class="field-editable"
            />
            <lck-multiselect
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'lck-multiselect'"
              :options="columnsEnhanced && columnsEnhanced[column.id] && columnsEnhanced[column.id].dropdownOptions"
              optionLabel="label"
              appendTo="body"
              :value="slotProps.data.data[column.id]"
              :placeholder="$t('components.dropdown.placeholder')"
              @change="onDropdownEdit(slotProps.index, column.id, $event)"
            />
            <p-calendar
              v-else-if="getComponentEditableColumn(column.column_type_id) === 'p-calendar'"
              v-model="currentDateToEdit"
              @show="onShowCalendar(column, slotProps.data.data[column.id])"
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
            <span
              style="pointer-events: none"
              :title="getValue(column, slotProps.data.data[column.id])"
            >
              {{ getValue(column, slotProps.data.data[column.id]) }}
            </span>
          </template>
        </p-column>

        <template #empty>
          {{ $t('components.crudtable.noDataToDisplay') }}
        </template>
      </p-datatable>
    </div>

    <lck-paginator
      :rows="rowsNumber"
      :skip="block && block.content && block.content.skip"
      :limit="block && block.content && block.content.limit"
      :totalRecords="block && block.content && block.content.total"
      v-on="$listeners"
    />
  </div>
  <div v-else>
    {{ $t('components.crudtable.noDefinitionAvailable') }}
  </div>
</template>

<script>
import Vue from 'vue'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Calendar from 'primevue/calendar'
import Column from 'primevue/column'
import InputSwitch from 'primevue/inputswitch'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import Paginator from '@/components/ui/Paginator/Paginator.vue'
import MultiSelect from '@/components/ui/MultiSelect/MultiSelect.vue'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import {
  formatISO,
  lightFormat,
  parseISO
} from 'date-fns'

import { getComponentEditableColumn } from '@/utils/columns'

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
    'p-column': Vue.extend(Column)
  },
  props: {
    block: {
      type: Object,
      required: true
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
    }
  },
  data () {
    return {
      editingCellRows: [],
      autocompleteInput: {},
      currentDateToEdit: null
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
      if (!this.block.definition.columns) return {}
      const result = {}
      this.block.definition.columns.forEach(currentColumn => {
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
      console.log('dropdown', result)
      return result
    },
    tableWidth () {
      if (!this.block.definition.columns) return {}
      return this.block.definition.columns.reduce((acc, c) => acc + (c.settings?.width || 150), 0)
    }
  },
  methods: {
    getComponentEditableColumn,
    getValue (column, data = '') {
      if (
        data === '' ||
        data === null
      ) return ''
      switch (column.column_type_id) {
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.LOOKED_UP_COLUMN:
        case COLUMN_TYPE.FORMULA:
          return data.value
        case COLUMN_TYPE.SINGLE_SELECT:
          return column.settings.values[data]?.label
        case COLUMN_TYPE.DATE:
          // eslint-disable-next-line no-case-declarations
          try {
            return lightFormat(parseISO(data), this.$t('date.dateFormat')) || ''
          } catch (error) {
            // eslint-disable no-console
            console.error('Date with bad format', data, error)
            return ''
          }
        default:
          return data
      }
    },
    isEditableColumn (column) {
      if (this.crudMode) {
        switch (column.column_type_id) {
          case COLUMN_TYPE.LOOKED_UP_COLUMN:
          case COLUMN_TYPE.FORMULA:
            return false
          default:
            return true
        }
      } else {
        return column.editable
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
    // eslint-disable-next-line @typescript-eslint/camelcase
    async onComplete ({ column_type_id, settings }, { query }) {
      this.$emit(
        'update-suggestions',
        column_type_id,
        settings?.tableId,
        query
      )
    },
    onColumnResize (header) {
      this.$emit(
        'column-resize',
        header.element.offsetWidth,
        header.element.querySelector('[data-column-id]').attributes['data-column-id'].value
      )
    },
    onColumnReorder (event) {
      // if we are in crud mode, a ref column is displayed
      this.$emit('column-reorder', {
        fromIndex: event.dragIndex,
        toIndex: event.dropIndex
      })
    },
    async onDropdownEdit (rowIndex, columnId, event) {
      console.log('onDropdownEdit', rowIndex, columnId, event)
      this.$emit('update-cell', {
        rowIndex,
        columnId,
        newValue: event.value
      })
    },
    async onAutocompleteEdit (rowIndex, columnId, event) {
      this.$emit('update-cell', {
        rowIndex,
        columnId,
        newValue: event.value.value
      })
    },
    async onCellEditComplete (event) {
      let value = event.data.data[event.field]
      const currentColumn = this.block.definition.columns.find(c => c.id === event.field)
      switch (currentColumn.column_type_id) {
        case COLUMN_TYPE.SINGLE_SELECT:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
          /**
           * For these type of column
           * the dropdown edit is already here
           * to emit the event
           */
          return
        case COLUMN_TYPE.DATE:
          /**
           * in case of a Date, value is stored in the currentDateToEdit data
           * we format it in the date representation,
           * we just want to store the date
           */
          if (this.currentDateToEdit) {
            value = formatISO(this.currentDateToEdit, { representation: 'date' })
          }
          break
      }
      this.$emit('update-cell', {
        rowIndex: event.index,
        columnId: event.field,
        newValue: value
      })
    },
    onSort (event) {
      this.$emit('sort', {
        field: event.sortField,
        order: event.sortOrder
      })
    }
  }
}
</script>

<style scoped>

/deep/ .p-editable-column.p-cell-editing .p-dropdown {
  border: 1px solid var(--primary-color);
  border-radius: 0;
}

/deep/ .p-datatable-resizable > .p-datatable-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
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
