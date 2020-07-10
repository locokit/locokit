<template>
  <div>
    <h1>Dashbord</h1>
    <div v-if="page && page.containers.length > 0">
      <div v-for="container in page.containers" :key="container.id">
        <Container :container="container"></Container>
      </div>
    </div>
  </div>
</template>

<script>
import { retrievePageWithContainersAndBlocks } from '@/store/visualize'
import Container from '@/components/visualize/Container/Container'

export default {
  name: 'Page',
  components: { Container },
  props: ['id'],
  data () {
    return {
      page: null
    }
  },
  async mounted () {
    this.page = await retrievePageWithContainersAndBlocks(this.id)
    console.log(this.page)
  }
  // watch () {
  //   getBlockData()
  // }
}
</script>

<style scoped>

</style>
