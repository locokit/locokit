<template>
  <div v-if="block.definition">
    <prime-datatable
      :value="dataToDisplay"
      removableSort
      :paginator="true"
      :lazy="true"
      :loading="block.loading"
      :rows="dataTable.limit"
      :totalRecords="dataTable.total"
      @page="onPage($event)"
    >
      <prime-column
        v-for="column in block.definition.columns"
        :key="column.id"
        :header="column.text"
        sortable
        :field="column.id"
        :bodyClass="getClassComponent(column)"
      >
      </prime-column>
    </prime-datatable>
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
    'prime-datatable': Vue.extend(DataTable),
    'prime-column': Vue.extend(Column)
  },
  computed: {
    dataTable () {
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
      return this.block.content.data.map(d => {
        const currentData = {}
        Object.keys(d.data).forEach(currentColumnId => {
          let currentValueForDisplay = d.data[currentColumnId]
          const column = this.block.definition.columns.find(c => c.id === currentColumnId)
          switch (column.column_type_id) {
            case 5:
            case 6:
            case 7:
            case 8:
              currentValueForDisplay = d.data[currentColumnId].value
              break
            case 9:
              currentValueForDisplay = column.settings.values[d.data[currentColumnId]].label
          }
          currentData[currentColumnId] = currentValueForDisplay
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
