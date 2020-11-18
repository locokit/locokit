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
        :autocompleteSuggestions="autocompleteSuggestions"
        :exporting="exporting"
        class="p-mb-4"
        v-on="$listeners"
        @update-cell="onUpdateCell(block, $event)"
        @update-content="onUpdateContentBlockTableView(block, $event)"
        @update-suggestions="onUpdateSuggestions"
        @sort="onSort(block, $event)"
        @open-detail="onPageDetail(block, $event)"
        @create-row="onCreateRow(block, $event)"
        @export-view="onExportView(block)"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'
import saveAs from 'file-saver'
import { lckHelpers } from '@/services/lck-api'

import {
  retrievePageWithContainersAndBlocks,
  retrieveViewDefinition,
  retrieveViewData
} from '@/store/visualize'
import {
  patchTableData, saveTableData
} from '@/store/database'

import Block from '@/components/visualize/Block/Block'
import { formatISO } from 'date-fns'

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
      autocompleteSuggestions: null,
      exporting: false
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
    searchItems: lckHelpers.searchItems,
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
    async onUpdateSuggestions ({ column_type_id, settings }, { query }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId: column_type_id,
        tableId: settings?.tableId,
        query
      })
    },
    async onUpdateCell ({
      id: blockId
    }, {
      rowId,
      columnId,
      newValue
    }) {
      let currentBlock = null
      this.page.containers.forEach(container => {
        const blockIdIndex = container.blocks.findIndex(b => b.id === blockId)
        blockIdIndex > -1 && (currentBlock = container.blocks[blockIdIndex])
      })
      const currentRow = currentBlock.content.data.find(d => d.id === rowId)
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
      await this.$router.push(`${block.settings.pageDetailId}?rowId=${rowId}`)
    },
    async onCreateRow (block, newRow) {
      this.$set(block, 'submitting', true)
      const dataToSubmit = {
        data: {
          ...newRow.data
        }
      }
      /**
       * For date columns, we format the date to ISO, date only
       */
      block.definition.columns
        .filter(c => c.column_type_id === COLUMN_TYPE.DATE)
        .forEach(c => {
          if (newRow.data[c.id] instanceof Date) {
            dataToSubmit.data[c.id] = formatISO(newRow.data[c.id], { representation: 'date' })
          } else {
            dataToSubmit.data[c.id] = null
          }
        })
      await saveTableData({
        ...dataToSubmit,
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: block.definition.table_id
      })
      this.$set(block, 'submitting', false)
      this.$set(block, 'displayNewDialog', false)
      await this.loadBlockTableViewContent(block)
    },
    async onExportView (block) {
      if (!block.settings?.id) return
      this.exporting = true
      const data = await lckHelpers.exportTableRowData(block.settings?.id)
      saveAs(
        new Blob([data]),
        block.title + '.csv',
        {
          type: 'text/csv;charset=utf-8'
        })
      this.exporting = false
    }
  }
}
</script>
