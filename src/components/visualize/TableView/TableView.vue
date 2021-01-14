<template>
  <div>
    <div
      class="
        p-py-1
        p-d-flex
        p-jc-between
        p-flex-wrap
        lck-data-toolbar
      "
    >
      <div class="p-d-flex p-flex-wrap">
        <lck-filter-button
          v-if="filterAllowed"
          :disabled="!hasDataToDisplay && currentDatatableFilters.length === 0"
          :definition="columnsDisplayed"
          :columnsDropdownOptions="columnsDropdownOptions"
          v-model="currentDatatableFilters"
          @submit="onSubmitFilters"
          @reset="onResetFilters"
        />
      </div>
      <div class="p-d-flex p-flex-wrap">
        <p-button
          v-if="addAllowed"
          :label="$t('form.add')"
          icon="pi pi-plus-circle"
          class="p-mr-2"
          @click="onClickAddButton"
        />
        <p-button
          v-if="exportAllowed"
          :disabled="!hasDataToDisplay"
          label="Export"
          class="p-button-secondary"
          :icon="exporting ? 'pi pi-spin pi-spinner' : 'pi pi-download'"
          @click="$emit('export-view')"
        />
      </div>
    </div>

    <lck-datatable
      v-if="definition"
      :definition="columnsDisplayed"
      :content="content"
      :crud-mode="false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <lck-dialog
      :visible.sync="displayNewDialog"
      :header="$t('components.datatable.addNewRow')"
      :submitting="submitting"
      :isActionForm="true"
      @close="displayNewDialog = false"
      @input="handleSubmitCreateRow"
    >
      <lck-data-detail
        :crudMode="false"
        :definition="columnsDisplayed"
        :row="newRow"
        :autocompleteSuggestions="$attrs['autocompleteSuggestions']"
        @update-suggestions="$listeners['update-suggestions']"
        @update-row="onUpdateRow"
      />
    </lck-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

import Button from 'primevue/button'
import { formatISO } from 'date-fns'

import DataTable from '@/components/store/DataTable/DataTable.vue'
import Dialog from '@/components/ui/Dialog/Dialog.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'

export default {
  name: 'TableView',
  components: {
    'lck-datatable': DataTable,
    'lck-data-detail': DataDetail,
    'lck-filter-button': FilterButton,
    'lck-dialog': Dialog,
    'p-button': Vue.extend(Button)
  },
  props: {
    addAllowed: {
      type: Boolean,
      default: false
    },
    exportAllowed: {
      type: Boolean,
      default: false
    },
    filterAllowed: {
      type: Boolean,
      default: true
    },
    definition: {
      type: Object
    },
    content: {
      type: Object
    },
    settings: {
      type: Object
    },
    title: {
      type: String,
      default: 'TableView'
    },
    submitting: {
      type: Boolean,
      default: false
    },
    exporting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      displayNewDialog: false,
      newRow: {},
      currentDatatableFilters: []
    }
  },
  computed: {
    hasColumns () {
      return this.definition?.columns?.length > 0
    },
    columnsDisplayed () {
      return this.hasColumns ? { columns: this.definition.columns.filter(currentColumn => currentColumn.displayed === true) } : null
    },
    columnsDropdownOptions () {
      const result = {}
      if (this.hasColumns) {
        this.columnsDisplayed.columns.forEach(currentColumn => {
          if (
            currentColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
            currentColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
          ) {
            result[currentColumn.id] = Object.keys(currentColumn.settings.values).map(k => ({
              value: k,
              label: currentColumn.settings.values[k].label
            }))
          }
        })
      }
      return result
    },
    hasDataToDisplay () {
      return this.hasColumns && this.content?.total > 0
    }
  },
  methods: {
    onClickAddButton () {
      this.newRow = {
        data: {}
      }
      this.definition.columns.forEach(c => {
        if (
          c.column_type_id === COLUMN_TYPE.SINGLE_SELECT &&
          c.settings?.default
        ) {
          this.$set(this.newRow.data, c.id, c.settings.default)
        }
      })
      this.autocompleteInput = {}
      this.displayNewDialog = true
    },
    async onUpdateRow ({ columnId, newValue }) {
      this.$set(this.newRow.data, columnId, newValue)
    },
    onSubmitFilters () {
      this.$emit('update-filters', this.getFormattedFilters())
    },
    onResetFilters () {
      this.currentDatatableFilters = []
      this.onSubmitFilters()
    },
    getFormattedFilters () {
      const formattedFilters = {}
      this.currentDatatableFilters
        .filter(filter => ![filter.column, filter.action, filter.pattern].includes(null))
        .forEach((filter, index) => {
          formattedFilters[
            // Operator
            `${filter.operator}[${index}]` +
            // Field
            (columnType => {
              switch (columnType) {
                case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
                case COLUMN_TYPE.LOOKED_UP_COLUMN:
                  return `[data][${filter.column.value}.value]`
                default:
                  return `[data][${filter.column.value}]`
              }
            })(filter.column.type) +
            // Action
            `[${filter.action.value}]`] =
              (columnType => {
                switch (columnType) {
                  case COLUMN_TYPE.DATE:
                    if (filter.pattern instanceof Date) {
                      try {
                        return formatISO(filter.pattern, { representation: 'date' })
                      } catch (RangeError) {}
                    }
                }
                return ['$ilike', '$notILike'].includes(filter.action.value) ? `%${filter.pattern}%` : filter.pattern
              })(filter.column.type)
        })
      return formattedFilters
    },
    handleSubmitCreateRow () {
      this.$emit('create-row', this.newRow)
      this.displayNewDialog = false
    }
  }
}
</script>

<style scoped>
.lck-data-toolbar {
  border-bottom: 1px solid var(--header-border-bottom-color);
}
</style>
