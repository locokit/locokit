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
          <span class="p-column-title">{{ column.text }}</span>
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
          let currentValueForDisplay = d.data[currentColumn.id] || ''
          if (currentValueForDisplay === '') return
          switch (currentColumn.column_type_id) {
            case 5:
            case 6:
            case 7:
              currentValueForDisplay = d.data[currentColumn.id].value
              break
            case 9:
              currentValueForDisplay = currentColumn.settings.values[d.data[currentColumn.id]].label
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
        case 5:
        case 6:
        case 7:
        case 8:
          return data.value
        case 9:
          return column.settings.values[data].label
        default:
          return data
      }
    },
    getClassComponent (column) {
      switch (column.column_type_id) {
        case 9:
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
