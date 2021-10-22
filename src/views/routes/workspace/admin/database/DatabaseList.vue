<template>
  <div class="lck-layout-content">
    <p-accordion
        :multiple="true"
        class="lck-bg-sidebar lck-sidebar"
        :activeIndex="[0]"
      >
      <p-accordion-tab
        v-for="item in menuItems"
        :key="item.id"
      >
        <template #header>
          <span>{{item.label}}</span>
        </template>

        <router-link
          v-for="subitem in item.items"
          :key="subitem.id"
          :to="subitem.to"
          class="lck-sidebar-link"
        >
          <i class="bi lck-sidebar-link-icon" :class="subitem.icon" /> <span>{{subitem.label}}</span>
        </router-link>
      </p-accordion-tab>
    </p-accordion>
    <div class="h-full o-auto h-max-full">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ROUTES_PATH } from '@/router/paths'
import { lckHelpers } from '@/services/lck-api'
import { LckWorkspace } from '@/services/lck-api/definitions'
import Vue from 'vue'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

export default {
  name: 'DatabaseList',
  components: {
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab),
  },
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      loading: {
        type: Boolean,
        default: false,
      },
      workspace: {
        type: LckWorkspace,
        default: null,
      },
    }
  },
  mounted () {
    this.getDatabaseList()
  },
  computed: {
    menuItems () {
      return this.workspace.databases?.map(database => ({
        id: database.id,
        label: database.text,
        items: [
          {
            id: 'schema',
            label: this.$t('pages.workspace.menu.schema'),
            icon: 'bi-diagram-2',
            to: `${ROUTES_PATH.WORKSPACE}/${this.groupId}${ROUTES_PATH.DATABASE}/${database.id}${ROUTES_PATH.DATABASESCHEMA}`,
          },
          ...database.tables.map(table => ({
            id: table.id,
            label: table.text,
            icon: 'bi-table',
            to: `${ROUTES_PATH.WORKSPACE}/${this.groupId}${ROUTES_PATH.DATABASE}/${database.id}${ROUTES_PATH.DATABASETABLES}/${table.id}`,
          })),
        ],
      }))
    },
  },
  methods: {
    async getDatabaseList () {
      this.loading = true
      this.workspace = await lckHelpers.retrieveWorkspaceWithDatabases(this.groupId)
      this.loading = false
    },
  },
}
</script>

<style scoped>
.p-panelmenu .p-panelmenu-panel:first-child .p-panelmenu-header > a {
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

.p-panelmenu .p-panelmenu-panel:last-child .p-panelmenu-header > a {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
