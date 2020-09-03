<template>
  <div class="p-mx-2">
    <div class="lck-color-page-title p-my-4">
      <h1>{{ page && page.text }}</h1>
    </div>
    <div v-if="page && page.containers.length > 0">
      <div
        v-for="container in page.containers"
        :key="container.id"
      >
          <Container
            :container="container"
            @updateContentBlockTableView="updateContentBlock"
          />
      </div>
    </div>
  </div>
</template>

<script>
import {
  retrievePageWithContainersAndBlocks,
  retrieveViewDefinition,
  retrieveViewData
} from '@/store/visualize'
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
        this.page = await retrievePageWithContainersAndBlocks(this.pageId)
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
              this.$set(block, 'content', await retrieveViewData(block.definition.id))
              block.loading = false
              return
            default:
              console.log(block)
          }
        })
      })
    }
  },
  methods: {
    updateContentBlock (data) {
      if (data && data.blockType === 'TableView') {
        this.page.containers.forEach(container => {
          container.blocks.forEach(async block => {
            if (block.id === data.blockId) {
              this.$set(block, 'loading', true)
              this.$set(block, 'content', await retrieveViewData(block.definition.id, data.pageIndexToGo))
              this.$set(block, 'loading', false)
            }
          })
        })
      }
    }
  }
}
</script>
