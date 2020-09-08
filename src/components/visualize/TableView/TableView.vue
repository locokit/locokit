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
      class="p-datatable-sm p-datatable-striped p-datatable-responsive"
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
          <span :class="getClassComponent(column)">{{ slotProps.data[column.id] }}</span>
        </template>
      </p-column>
    </p-datatable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Vue from 'vue'

const COLUMN_TYPE = {
  BOOLEAN: 1,
  STRING: 2,
  NUMBER: 3,
  FLOAT: 4,
  DATE: 5,
  USER: 6,
  GROUP: 7,
  RELATION_BETWEEN_TABLES: 8,
  LOOKED_UP_COLUMN: 9,
  SINGLE_SELECT: 10,
  MULTI_SELECT: 11,
  FORMULA: 12,
  FILE: 13
}

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
    getClassComponent (column) {
      switch (column.column_type_id) {
        case COLUMN_TYPE.USER:
        case COLUMN_TYPE.GROUP:
        case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
        case COLUMN_TYPE.LOOKED_UP_COLUMN:
        case COLUMN_TYPE.FORMULA:
        case COLUMN_TYPE.SINGLE_SELECT:
          return 'p-tag p-p-2'
        default:
          return 'text'
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

/deep/ .p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
  white-space: nowrap;
}
/deep/ .p-datatable-wrapper {
  overflow: auto;
}

</style>
