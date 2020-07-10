<template>
  <p>{{pages}}</p>
</template>

<script>
import { retrievePageWithContainersAndBlocks } from '@/store/visualize'

export default {
  name: 'Page',
  props: ['id'],
  data () {
    return {
      pages: []
    }
  },
  async mounted () {
    this.pages = await retrievePageWithContainersAndBlocks(this.id)
  },
  async beforeRouteUpdate (to, from, next) {
    this.pages = await retrievePageWithContainersAndBlocks(+to.params.id)
    next()
  }
}
</script>

<style scoped>

</style>
