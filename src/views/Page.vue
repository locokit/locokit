<template>
  <p>{{pages}}</p>
</template>

<script>
import { retrievePage } from '@/store/visualize'

export default {
  name: 'Page',
  props: ['id'],
  data () {
    return {
      pages: []
    }
  },
  async mounted () {
    this.pages = await retrievePage(this.id)
  },
  async beforeRouteUpdate (to, from, next) {
    this.pages = await retrievePage(+to.params.id)
    next()
  }
}
</script>

<style scoped>

</style>
