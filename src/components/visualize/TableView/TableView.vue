<template>
  <div v-if="block.definition">
    <header class="text-gray-600 font-medium mb-2">
      {{ block.text }}
    </header>
    <el-table
      stripe
      :data="block.data"
      class="shadow"
    >
      <el-table-column
        v-for="column in block.definition.columns"
        :key="column.id"
        :prop="getPropName(column)"
        :label="column.text"
        sortable
      >
        <template slot-scope="scope">
          <component
            :is="getComponent(column)"
            v-bind="getProperties(column)"
          >
            {{
              scope.row.data[column.id].value
              ? scope.row.data[column.id].value
              : scope.row.data[column.id]
            }}
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
    getPropName (column) {
      switch (column.column_type_id) {
        case 5:
        case 6:
        case 7:
        case 8:
          return `data.${column.id}.value`
        default:
          return `data.${column.id}`
      }
    },
    getComponent (column) {
      switch (column.column_type_id) {
        case 5:
        case 6:
        case 7:
        case 8:
          return 'el-tag'
        default:
          return 'span'
      }
    },
    getProperties (column) {
      switch (column.column_type_id) {
        case 5:
        case 6:
        case 7:
        case 8:
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
