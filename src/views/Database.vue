<template>
  <div
    class="generic-view-container p-mx-auto"
  >
    <header class="p-my-4 lck-color-title">
      {{ databaseState.data.text }}
    </header>

    <p-tab-view>
      <p-tab-panel
        v-for="table in databaseState.data.tables"
        :key="table.id"
        :header="table.text"
      >
        {{ table.id }}
        <TableView
          :block="block"
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
      block: {}
    }
  },
  components: {
    TableView,
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel)
  },
  async mounted () {
    await retrieveDatabaseByWorkspaceId(this.databaseId)
    this.$set(this.block, 'loading', true)
    const definition = await retrieveTableColumns(databaseState.data?.tables[0].id)
    const content = await retrieveTableRows(databaseState.data?.tables[0].id)
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
