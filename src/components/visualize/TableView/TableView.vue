<template>
  <div>
    <header>{{ block.text }} {{ block.definition.text }}</header>
    <el-table
      stripe
      :data="block.data">
      <el-table-column
        v-for="column in block.definition.columns"
        :key="column.id"
        :prop="column.id"
        :label="column.text"
      >
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
  }
}
</script>

<style scoped>

</style>
