<template>
  <p>{{block}}</p>
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
