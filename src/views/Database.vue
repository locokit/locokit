<template>
  <div
    class="generic-view-container p-mx-auto"
  >
    <header class="p-my-4 lck-color-title">
      {{ databaseState.data.text}}
    </header>

    <p-tab-view>
      <p-tab-panel
      v-for="table in databaseState.data.tables"
      :key="table.id"
      :header="table.text">
        {{ table.id }}
      </p-tab-panel>
    </p-tab-view>
  </div>
</template>

<script>
import { retrieveDatabaseByWorkspaceId, databaseState } from '@/store/database'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Vue from 'vue'

export default {
  name: 'Database',
  props: ['workspaceId'],
  data () {
    return {
      databaseState
    }
  },
  components: {
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel)
  },
  async mounted () {
    await retrieveDatabaseByWorkspaceId(this.workspaceId)
  }
}
</script>
