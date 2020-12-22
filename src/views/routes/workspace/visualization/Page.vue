<template>
  <div
    v-if="page"
    class="p-mx-2"
  >
    <div class="lck-color-page-title p-my-4">
      <h1>{{ page.text }}</h1>
    </div>
    <div
      v-if="page.hidden"
    >
      <p-breadcrumb
        :home="{ icon: 'pi pi-home', to: '/' }"
        :model="breadcrumb"
        />
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
        :cellState="cellState"
        class="p-mb-4"
        v-on="$listeners"
        @update-cell="onUpdateCell(block, $event)"
        @update-content="onUpdateContentBlockTableView(block, $event)"
        @update-suggestions="onUpdateSuggestions"
        @sort="onSort(block, $event)"
        @open-detail="onPageDetail(block, $event)"
        @create-row="onCreateRow(block, $event)"
        @export-view="onExportView(block)"
        @update-filters="onUpdateFilters(block, $event)"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import saveAs from 'file-saver'
import { formatISO, isValid, parseISO } from 'date-fns'

import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'

import Breadcrumb from 'primevue/breadcrumb'

import Block from '@/components/visualize/Block/Block'

import {
  retrievePageWithContainersAndBlocks,
  retrieveViewDefinition,
  retrieveViewData
} from '@/store/visualize'
import {
  patchTableData, saveTableData
} from '@/store/database'
import { lckHelpers } from '@/services/lck-api'

export default {
  name: 'Page',
  components: {
    Block,
    'p-breadcrumb': Vue.extend(Breadcrumb)
  },
  props: {
    pageId: {
      type: [String, Number], // param is string because its form url params
      required: true
    },
    pageDetailId: {
      type: [String, Number], // param is string because its form url params
      required: false
    }
  },
  data () {
    return {
      page: null,
      blocksOptions: {

      },
      autocompleteSuggestions: null,
      exporting: false,
      cellState: {}
    }
  },
  watch: {
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
  computed: {
    breadcrumb: function () {
      const parent = this.$parent.sidebarItems.reduce((acc, chapter) => {
        chapter.subitems.find(page => {
          if (page.id === this.$route.params.pageId) acc = page
        })
        return acc
      }, {})
      return [
        {
          label: parent.label,
          to: this.$route.params.pageId
        },
        {
          label: this.page.text,
          disabled: true
        }
      ]
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
        itemsPerPage: 20,
        filters: {}
      }
      if (this.$route.query.rowId) {
        this.blocksOptions[block.id].filters.rowId = this.$route.query.rowId
      }
      this.$set(block, 'definition', await retrieveViewDefinition(block.settings?.id))
      await this.loadBlockTableViewContent(block)
    },
    async loadBlockTableViewContent (block) {
      const currentOptions = this.blocksOptions[block.id]
      if (this.$route.query.rowId) {
        this.blocksOptions[block.id].filters.rowId = this.$route.query.rowId
      }
      this.$set(block, 'content', await retrieveViewData(
        block.definition.id,
        currentOptions.page * currentOptions.itemsPerPage,
        currentOptions.itemsPerPage,
        currentOptions.sort,
        currentOptions.filters
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
    async onUpdateSuggestions ({ column_type_id: columnTypeId, settings }, { query }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId: columnTypeId,
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
      this.cellState = {
        rowId: currentRow.id,
        columnId,
        waiting: true,
        isValid: false // don't know if we have to set to false or null
      }
      try {
        const res = await patchTableData(currentRow.id, {
          data: {
            [columnId]: newValue
          }
        })
        this.cellState.isValid = true
        currentRow.data = res.data
      } catch (error) {
        this.cellState.isValid = false
      }
      this.cellState.waiting = false
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
    async onUpdateFilters (block, filters) {
      block.loading = true
      switch (block.type) {
        case BLOCK_TYPE.TABLE_VIEW:
          this.blocksOptions[block.id].filters = filters
          await this.loadBlockTableViewContent(block)
          break
      }
      block.loading = false
    },
    async onPageDetail (block, rowId) {
      await this.$router.push({ name: 'PageDetail', params: { pageId: this.$route.params.pageId, pageDetailId: block.settings.pageDetailId }, query: { rowId } })
    },
    async onCreateRow (block, newRow) {
      const data = { ...newRow.data }
      if (this.$route.query.rowId) {
        // Todo: Add property in table_view_has_column to get the column id target
        // Todo: Discuss about the property visible (impossible to find the column is visible has true)
        const columnTargetDetail = block.definition.columns.find(column => !column.editable && !!column.filter)
        data[columnTargetDetail.id] = this.$route.query.rowId
      }
      this.$set(block, 'submitting', true)

      /**
       * For date columns, we format the date to ISO, date only
       */
      block.definition.columns
        .filter(c => c.column_type_id === COLUMN_TYPE.DATE)
        .forEach(c => {
          if (isValid(parseISO(newRow.data[c.id]))) {
            data[c.id] = formatISO(new Date(newRow.data[c.id]), { representation: 'date' })
          } else {
            data[c.id] = null
          }
        })
      await saveTableData({
        data,
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
      const data = await lckHelpers.exportTableRowData(block.settings?.id, this.blocksOptions[block.id]?.filters)
      saveAs(
        new Blob([data]),
        block.title + '.csv',
        {
          type: 'text/csv;charset=utf-8'
        })
      this.exporting = false
    }
  },
  async mounted () {
    if (this.$route.params.pageDetailId) {
      this.page = await retrievePageWithContainersAndBlocks(this.$route.params.pageDetailId)
    } else {
      this.page = await retrievePageWithContainersAndBlocks(this.pageId)
    }
  },
  async beforeRouteUpdate (to, from, next) {
    if (to.params.pageId !== from.params.pageId) {
      this.page = await retrievePageWithContainersAndBlocks(to.params.pageId)
      next()
    }
    if (to.params.pageDetailId !== from.params.pageDetailId) {
      this.page = await retrievePageWithContainersAndBlocks(to.params.pageDetailId)
      next()
    }
  },
  async beforeRouteLeave (to, from, next) {
    if (to.params.pageDetailId) {
      this.page = await retrievePageWithContainersAndBlocks(to.params.pageDetailId)
      next()
    }
    if (from.params.pageDetailId) {
      this.page = await retrievePageWithContainersAndBlocks(to.params.pageId)
      next()
    }
    next()
  }
}
</script>
