<template>
  <div>
    {{ block.text }}
    <component
      :is="block.type"
      :block="block"
    />
  </div>
</template>

<script>
import TableView from '../TableView/TableView.vue'

export default {
  name: 'Block',
  components: { TableView },
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
