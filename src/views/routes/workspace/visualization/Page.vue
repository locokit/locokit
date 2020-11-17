<template>
  <div class="p-mx-2" v-if="page">
    <div class="lck-color-page-title p-my-4">
      <h1>{{ page && page.text }}</h1>
    </div>
    <div
      v-for="container in page.containers"
      :key="container.id"
    >
      <Block
        v-for="block in container.blocks"
        :key="block.id"
        :block="block"
        :autocompleteSuggestions="autocompleteItems"
        class="p-mb-4"
        v-on="$listeners"
        @update-cell="onUpdateCell(block, $event)"
        @update-content="onUpdateContentBlockTableView(block, $event)"
        @update-suggestions="onUpdateSuggestions"
        @sort="onSort(block, $event)"
        @open-detail="onPageDetail(block, $event)"
      />
    </div>
  </div>
</template>

<script>
import {
  retrievePageWithContainersAndBlocks,
  retrieveViewDefinition,
  retrieveViewData
} from '@/store/visualize'
import {
  patchTableData
} from '@/store/database'
import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'
import Block from '@/components/visualize/Block/Block'
import lckClient from '@/services/lck-api'

export default {
  name: 'Page',
  components: { Block },
  props: {
    pageId: {
      type: [String, Number], // param is string because its form url params
      required: true
    }
  },
  data () {
    return {
      page: null,
      blocksOptions: {

      },
      autocompleteItems: null
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
        container.blocks.sort((a, b) => a.position - b.position)
        container.blocks.forEach(async block => {
          switch (block.type) {
            case BLOCK_TYPE.TABLE_VIEW:
              this.$set(block, 'loading', true)
              await this.loadBlockTableViewContentAndDefinition(block)
              this.$set(block, 'loading', false)
              break
          }
        })
      })
    }
  },
  methods: {
    async loadBlockTableViewContentAndDefinition (block) {
      this.blocksOptions[block.id] = {
        sort: {
          createdAt: 1
        },
        page: 0,
        itemsPerPage: 20
      }
      this.$set(block, 'definition', await retrieveViewDefinition(block.settings?.id))
      await this.loadBlockTableViewContent(block)
    },
    async loadBlockTableViewContent (block) {
      const currentOptions = this.blocksOptions[block.id]
      this.$set(block, 'content', await retrieveViewData(
        block.definition.id,
        currentOptions.page * currentOptions.itemsPerPage,
        currentOptions.itemsPerPage,
        currentOptions.sort
      ))
    },
    async onUpdateContentBlockTableView (block, pageIndexToGo) {
      block.loading = true
      switch (block.type) {
        case BLOCK_TYPE.TABLE_VIEW:
          this.blocksOptions[block.id].page = pageIndexToGo
          await this.loadBlockTableViewContent(block)
          break
      }
      block.loading = false
    },
    async onUpdateSuggestions (columnTypeId, tableId, query) {
      this.autocompleteItems = await this.searchItems({
        columnTypeId,
        tableId,
        query
      })
    },
    async searchItems ({ columnTypeId, tableId, query }) {
      let items = null
      if (columnTypeId === COLUMN_TYPE.USER) {
        const result = await lckClient.service('user').find({
          query: {
            blocked: false,
            name: {
              $ilike: `%${query}%`
            }
          }
        })
        items = result.data.map(d => ({
          label: d.name,
          value: d.id
        }))
      } else if (columnTypeId === COLUMN_TYPE.GROUP) {
        const result = await lckClient.service('group').find({
          query: {
            name: {
              $ilike: `%${query}%`
            }
          }
        })
        items = result.data.map(d => ({
          label: d.name,
          value: d.id
        }))
      // eslint-disable-next-line @typescript-eslint/camelcase
      } else if (columnTypeId === COLUMN_TYPE.RELATION_BETWEEN_TABLES) {
        const result = await lckClient.service('row').find({
          query: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            table_id: tableId,
            text: {
              $ilike: `%${query}%`
            }
          }
        })
        items = result.data.map(d => ({
          label: d.text,
          value: d.id
        }))
      }
      return items
    },
    async onUpdateCell ({
      id: blockId
    }, {
      rowIndex,
      columnId,
      newValue
    }) {
      let currentBlock = null
      this.page.containers.forEach(container => {
        const blockIdIndex = container.blocks.findIndex(b => b.id === blockId)
        blockIdIndex > -1 && (currentBlock = container.blocks[blockIdIndex])
      })
      const currentRow = currentBlock.content.data[rowIndex]
      const data = {
        data: {
          [columnId]: newValue
        }
      }
      const res = await patchTableData(currentRow.id, data)
      currentRow.data = res.data
    },
    async onSort (block, { field, order }) {
      block.loading = true
      switch (block.type) {
        case BLOCK_TYPE.TABLE_VIEW:
          this.blocksOptions[block.id].sort = {}
          // find the matching column_type_id to adapt
          this.blocksOptions[block.id].sort[`ref(data:${field})`] = order
          await this.loadBlockTableViewContent(block)
          break
      }
      block.loading = false
    },
    async onPageDetail (block, rowId) {
      await this.$router.push(`${block.settings.detail_page_id}?rowId=${rowId}`)
    }
  }
}
</script>
