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
        <lck-dropdown-button
          :label="$t('components.datatable.toolbar.export.label')"
          v-if="exportAllowed"
          :disabled="!hasDataToDisplay"
          :model="fileExportFormat"
          :icon="exporting ? 'pi pi-spin pi-spinner' : 'pi pi-download'"
          buttonClass="p-button-secondary"
        />
      </div>
    </div>

    <lck-datatable
      v-if="definition"
      :displayCheckIcon="true"
      :actions="definition.actions"
      :definition="columnsDisplayed"
      :content="content"
      :workspaceId="workspaceId"
      :crud-mode="false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <lck-dialog-form
      :visible.sync="displayNewDialog"
      :header="$t('components.datatable.addNewRow')"
      :submitting="submitting.inProgress"
      @close="displayNewDialog = false"
      @input="handleSubmitCreateRow"
    >
      <lck-data-detail
        :crudMode="false"
        :definition="filteredDefinitionColumns"
        :row="newRow"
        mode="creation"
        :autocompleteSuggestions="$attrs['autocompleteSuggestions']"
        :workspaceId="workspaceId"
        @update-suggestions="$listeners['update-suggestions']"
        @update-row="onUpdateRow"
      />
    </lck-dialog-form>
  </div>
</template>

<script>
import Vue from 'vue'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { getCurrentFilters } from '@/services/lck-utils/filter'
import {
  getOriginalColumn,
} from '@/services/lck-utils/columns'

import Button from 'primevue/button'

import DropdownButton from '@/components/ui/DropdownButton/DropdownButton'
import DataTable from '@/components/store/DataTable/DataTable.vue'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import DataDetail from '@/components/store/DataDetail/DataDetail.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'

export default {
  name: 'TableSet',
  components: {
    'lck-datatable': DataTable,
    'lck-data-detail': DataDetail,
    'lck-filter-button': FilterButton,
    'lck-dialog-form': DialogForm,
    'p-button': Vue.extend(Button),
    'lck-dropdown-button': DropdownButton,
  },
  props: {
    addAllowed: {
      type: Boolean,
      default: false,
    },
    exportAllowed: {
      type: Boolean,
      default: false,
    },
    filterAllowed: {
      type: Boolean,
      default: true,
    },
    definition: {
      type: Object,
    },
    content: {
      type: Object,
    },
    title: {
      type: String,
      default: 'TableView',
    },
    submitting: {
      type: Object, // Submitting type : { inProgress: boolean, errors?: Errors[] }
      default: () => ({ inProgress: false }),
    },
    exporting: {
      type: Boolean,
      default: false,
    },
    workspaceId: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      displayNewDialog: false,
      newRow: {},
      currentDatatableFilters: [],
      fileExportFormat: [
        {
          label: this.$t('components.datatable.toolbar.export.exportCSV'),
          icon: 'pi pi-file',
          command: () => {
            this.$emit('export-view-csv')
          },
        },
        {
          label: this.$t('components.datatable.toolbar.export.exportXLS'),
          icon: 'pi pi-file-excel',
          command: () => {
            this.$emit('export-view-xls')
          },
        },
      ],
    }
  },
  computed: {
    hasColumns () {
      return this.definition?.columns?.length > 0
    },
    columnsDisplayed () {
      return this.hasColumns ? { columns: this.definition.columns.filter(currentColumn => currentColumn.displayed === true) } : null
    },
    filteredDefinitionColumns () {
      if (!this.hasColumns) return []
      return {
        columns: this.definition.columns.filter((column) =>
          column.column_type_id !== COLUMN_TYPE.LOOKED_UP_COLUMN && column.column_type_id !== COLUMN_TYPE.FORMULA),
      }
    },
    columnsDropdownOptions () {
      const result = {}
      if (this.hasColumns) {
        this.columnsDisplayed.columns.forEach(currentColumn => {
          const originalColumn = getOriginalColumn(currentColumn)
          if (
            originalColumn.column_type_id === COLUMN_TYPE.SINGLE_SELECT ||
            originalColumn.column_type_id === COLUMN_TYPE.MULTI_SELECT
          ) {
            result[currentColumn.id] = Object.keys(originalColumn.settings?.values || {}).map(k => ({
              value: k,
              label: originalColumn.settings.values[k].label,
            }))
          }
        })
      }
      return result
    },
    hasDataToDisplay () {
      return this.hasColumns && this.content?.total > 0
    },
  },
  methods: {
    getCurrentFilters,
    onClickAddButton () {
      this.newRow = {
        data: {},
      }
      this.definition.columns.forEach(c => {
        if (
          c.column_type_id === COLUMN_TYPE.SINGLE_SELECT &&
          c.settings?.default
        ) {
          this.$set(this.newRow.data, c.id, c.settings.default)
        }
      })
      this.displayNewDialog = true
    },
    async onUpdateRow ({ columnId, newValue }) {
      this.$set(this.newRow.data, columnId, newValue)
    },
    onSubmitFilters () {
      this.$emit('update-filters', this.getCurrentFilters(this.currentDatatableFilters))
    },
    onResetFilters () {
      this.currentDatatableFilters = []
      this.onSubmitFilters()
    },
    handleSubmitCreateRow () {
      this.$emit('create-row', this.newRow)
    },
  },
  watch: {
    submitting (submittingValue) {
      if (!submittingValue.inProgress && !submittingValue.errors) {
        this.displayNewDialog = false
      }
    },
  },
}
</script>

<style scoped>
.lck-data-toolbar {
  border-bottom: 1px solid var(--header-border-bottom-color);
}
</style>
