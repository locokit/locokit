<template>
  <div v-if="block.definition">
    <prime-datatable
      :value="block.data"
      removableSort
    >
      <prime-column
        v-for="column in block.definition.columns"
        :key="column.id"
        :header="column.text"
        sortable
      >
        <template #body="slotProps">
          <span :class="getClassComponent(column)"> {{ getValue(column, slotProps.data.data[column.id]) }} </span>
        </template>
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
      default: () => (
        {}
      )
    }
  },
  components: {
    'prime-datatable': Vue.extend(DataTable),
    'prime-column': Vue.extend(Column)
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
          return 'p-tag'
        default:
          return 'text'
      }
    }
  }
}
</script>
