<template>
  <div
    class="p-mx-auto"
  >
    <header class="p-my-4 lck-color-title p-ml-1">
      {{ $t('pages.databases.title')}}
      {{ databaseState.data.text }}
    </header>

    <p-tab-view
      @tab-change="handleTabChange"
      v-if="databaseState.data.tables.length > 0"
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
        <CrudTable
          :block="block"
          @updateContentBlockTableView="updateContentBlock(table.id, $event)"
        />
      </p-tab-panel>
    </p-tab-view>
    <div v-else>
      {{ $t('pages.databases.noDatabase') }}
    </div>
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
import CrudTable from '@/components/store/CrudTable/CrudTable'

export default {
  name: 'Database',
  components: {
    CrudTable,
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel)
  },
  props: {
    databaseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      databaseState,
      block: {
        loading: false
      },
      views: []
    }
  },
  methods: {
    async updateContentBlock (tableId, data) {
      if (this.block.id === data.blockId) {
        this.block.loading = true
        this.block.content = await retrieveTableRows(tableId, data.pageIndexToGo)
        this.block.loading = false
      }
    },
    handleTabChange (event) {
      const tableId = event.tab.$el.dataset?.tableId
      this.loadTable(tableId)
    },
    async loadTable (tableId) {
      this.block.loading = true
      const definition = await retrieveTableColumns(tableId)
      const content = await retrieveTableRows(tableId)
      this.views = await retrieveTableViews(tableId)
      this.block = {
        ...this.block,
        definition: {
          columns: definition
        },
        content
      }
      this.block.loading = false
    }
  },
  async mounted () {
    await retrieveDatabaseByWorkspaceId(this.databaseId)
    // load the first table
    if (this.databaseState.data.tables.length > 0) {
      this.loadTable(this.databaseState.data.tables[0].id)
    }
  }
}
</script>

<style scoped>
/deep/ .p-tabview .p-tabview-panels {
  padding: 2px 0 0 0;
}
/deep/ .p-tabview .p-tabview-nav {
  height: 4rem;
  overflow: auto;
}
/deep/ .p-tabview-nav {
  flex-wrap: unset;
}
/deep/ .p-tabview .p-tabview-nav li {
  white-space: nowrap;
}
</style>
