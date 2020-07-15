<template>
  <div>
    <div v-if="block.definition">
      <el-table
        stripe
        :data="block.data">
        <el-table-column
            v-for="column in block.definition.columns"
            :key="column.id"
            :prop="`data.${column.id}`"
            :label="column.text"
            sortable
        />
      </el-table>
    </div>
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
  }
}
</script>
