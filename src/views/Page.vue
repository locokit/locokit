<template>
  <div>
    <h1 class="title-page my-2 bg-white">Dashboard</h1>
    <div v-if="page && page.containers.length > 0">
      <div v-for="container in page.containers" :key="container.id">
        <Container :container="container"></Container>
      </div>
    </div>
  </div>
</template>

<script>
import { retrievePageWithContainersAndBlocks, retrieveViewDefinition } from '@/store/visualize'
import Container from '@/components/visualize/Container/Container'

export default {
  name: 'Page',
  components: { Container },
  props: {
    pageId: {
      type: [String, Number], // param is string because its form url params
      required: true
    }
  },
  data () {
    return {
      page: null
    }
  },
  watch: {
    pageId: {
      immediate: true,
      async handler () {
        this.page = await retrievePageWithContainersAndBlocks(+this.pageId)
      }
    },
    page (newVal) {
      // retrieve for each blocks the definition / data of the block
      if (!newVal || !newVal.containers || !newVal.containers.length > 0) return
      newVal.containers.forEach(container => {
        container.blocks.forEach(async block => {
          switch (block.type) {
            case 'TableView':
              this.$set(block, 'loading', true)
              this.$set(block, 'definition', await retrieveViewDefinition(block.settings?.id))
              this.$set(block, 'data', [])
              block.loading = false
              return
            default:
              console.log(block)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.title-page {
  font-size: 1.4rem;
  padding: 1em;
  font-weight: 600;
  color: #645f5f;
}
</style>
