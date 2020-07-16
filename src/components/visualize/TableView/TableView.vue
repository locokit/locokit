<template>
  <div v-if="block.definition">
    <header class="text-gray-600 font-medium mb-2">
      {{ block.text }}
    </header>
    <el-table
      stripe
      size="medium"
      :data="block.data"
      class="shadow"
    >
      <el-table-column
        v-for="column in block.definition.columns"
        :key="column.id"
        :label="column.text"
        sortable
      >
        <template slot-scope="scope">
          <component
            :is="getComponent(column)"
            v-bind="getProperties(column)"
          >
            {{ getValue(column, scope.row.data[column.id]) }}
          </component>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TableView',
  props: {
    block: {
      type: Object,
      default: () => ({})
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
    getComponent (column) {
      switch (column.column_type_id) {
        case 9:
          return 'el-tag'
        default:
          return 'span'
      }
    },
    getProperties (column) {
      switch (column.column_type_id) {
        case 9:
          return {
            size: 'small',
            type: 'info',
            effect: 'dark'
          }
        default:
          return {}
      }
    }
  }
}
</script>
