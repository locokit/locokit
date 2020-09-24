<template>
  <div v-if="block.definition">
    <p-datatable
      :value="dataToDisplay"
      removableSort
      :paginator="true"
      :lazy="true"
      :loading="block.loading"
      :rows="dataTable.limit"
      :totalRecords="dataTable.total"
      class="p-datatable-sm p-datatable-responsive"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      :currentPageReportTemplate="$t('components.paginator.currentPageReportTemplate')"
      @page="onPage($event)"
    >
      <p-column
        v-for="column in block.definition.columns"
        :key="column.id"
        :header="column.text"
        sortable
        :field="column.id"
      >
        <template #body="slotProps">
          <span :class="columnTypeClass[column.column_type_id]">
            {{ slotProps.data[column.id] }}
          </span>
        </template>
      </p-column>
    </p-datatable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Vue from 'vue'
import { COLUMN_TYPE } from '@locokit/lck-glossary'

export default {
  name: 'TableView',
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  components: {
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column)
  },
  computed: {
    dataTable () {
      if (!this.block.content) return {}
      return { ...this.block.content }
    },
    /**
     * the data to display help DataTable prime component to display the value
     * and sort them by alphabetic order
     * BUT that's not working for Date or other stuff that are not "alphabetical"
     * TODO: make this computed property and the DataTable component able to sort Dates
     * cf https://gitlab.makina-corpus.net/lck/lck-front/-/merge_requests/24#note_214704
     * and https://github.com/primefaces/primevue/issues/412
     */
    dataToDisplay () {
      if (!this.block.content) return []
      return this.block.content.data.map(d => {
        const currentData = {}
        this.block.definition.columns.forEach(currentColumn => {
          let currentValueForDisplay = d.data[currentColumn.id]
          if (currentValueForDisplay === '') return
          switch (currentColumn.column_type_id) {
            case COLUMN_TYPE.USER:
            case COLUMN_TYPE.GROUP:
            case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
            case COLUMN_TYPE.LOOKED_UP_COLUMN:
            case COLUMN_TYPE.FORMULA:
              currentValueForDisplay = d.data[currentColumn.id]?.value
              break
            case COLUMN_TYPE.SINGLE_SELECT:
              currentValueForDisplay = currentColumn.settings.values[d.data[currentColumn.id]]?.label
          }
          currentData[currentColumn.id] = currentValueForDisplay
        })
        return currentData
      })
    },
    columnTypeClass () {
      return {
        [COLUMN_TYPE.BOOLEAN]: 'text',
        [COLUMN_TYPE.STRING]: 'text',
        [COLUMN_TYPE.NUMBER]: 'text',
        [COLUMN_TYPE.FLOAT]: 'text',
        [COLUMN_TYPE.DATE]: 'text',
        [COLUMN_TYPE.USER]: 'p-tag',
        [COLUMN_TYPE.GROUP]: 'p-tag',
        [COLUMN_TYPE.RELATION_BETWEEN_TABLES]: 'p-tag',
        [COLUMN_TYPE.LOOKED_UP_COLUMN]: 'p-tag',
        [COLUMN_TYPE.SINGLE_SELECT]: 'p-tag',
        [COLUMN_TYPE.MULTI_SELECT]: 'p-tag',
        [COLUMN_TYPE.FORMULA]: 'p-tag',
        [COLUMN_TYPE.FILE]: 'text'
      }
    }
  },
  methods: {
    getValue (column, data) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.LOOKED_UP_COLUMN:
        case COLUMN_TYPE.FORMULA:
          return data.value
        case COLUMN_TYPE.SINGLE_SELECT:
          return column.settings.values[data].label
        default:
          return data
      }
    },
    onPage (event) {
      this.$emit('updateContentBlockTableView', {
        blockId: this.block.id,
        blockType: this.block.type,
        blockDefinitionId: this.block.definition.id,
        pageIndexToGo: event.page
      })
    }
  }
}
</script>

<style scoped>
/deep/ .p-datatable table {
  width: unset;
  min-width: 100%;
  max-width: unset;
}

/deep/ .p-datatable.p-datatable-sm .p-datatable-thead > tr > th,
/deep/ .p-datatable-wrapper .p-tag {
  white-space: nowrap;
}
/deep/ .p-datatable-wrapper {
  overflow: auto;
}

</style>
