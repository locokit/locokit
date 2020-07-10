<template>
  <div>
    <component
      :is="block.type"
      :block="block"
    />
  </div>
</template>

<script>
import TableView from '@/components/visualize/TableView/TableView'

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
