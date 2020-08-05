<template>
  <div
    class="p-mx-auto"
  >
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ databaseState.data.text }}
    </header>

    <p-tab-view
      @tab-change="handleTab"
    >
      <p-tab-panel
        v-for="table in databaseState.data.tables"
        :key="table.id"
        :data-table-id="table.id"
        :header="table.text"
      >
        <div>

        <span
          class="p-tag p-tag-rounded p-badge-info p-mr-2 p-mb-3"
          v-for="view in views"
          :key="view.id"
        >
          {{ view.text }}
        </span>
        </div>
        <TableView
          :block="block"
          @updateContentBlockTableView="updateContentBlock"
        />
      </p-tab-panel>
    </p-tab-view>
  </div>
</template>

<script>
import {
  retrieveDatabaseByWorkspaceId,
  retrieveTableRows,
  retrieveTableColumns,
  retrieveTableViews,
  databaseState
} from '@/store/database'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Vue from 'vue'
import TableView from '@/components/visualize/TableView/TableView'

export default {
  name: 'Database',
  props: ['databaseId'],
  data () {
    return {
      databaseState,
      block: {},
      views: [],
      tableId: null
    }
  },
  components: {
    TableView,
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel)
  },
  methods: {
    async updateContentBlock (data) {
      if (this.block.id === data.blockId) {
        this.$set(this.block, 'loading', true)
        this.$set(this.block, 'content', await retrieveTableRows(this.tableId, data.pageIndexToGo))
        this.$set(this.block, 'loading', false)
      }
    },
    async handleTab (event) {
      this.tableId = event.tab.$el.dataset?.tableId
      const definition = await retrieveTableColumns(this.tableId)
      const content = await retrieveTableRows(this.tableId)
      this.views = await retrieveTableViews(this.tableId)
      this.block = {
        ...this.block,
        definition: {
          columns: definition
        },
        content
      }
    }
  },
  async mounted () {
    await retrieveDatabaseByWorkspaceId(this.databaseId)
    this.$set(this.block, 'loading', true)
    this.tableId = databaseState.data?.tables[0].id
    const definition = await retrieveTableColumns(this.tableId)
    const content = await retrieveTableRows(this.tableId)
    this.views = await retrieveTableViews(this.tableId)
    this.block = {
      ...this.block,
      definition: {
        columns: definition
      },
      content
    }
    this.$set(this.block, 'loading', false)
  }
}
</script>
