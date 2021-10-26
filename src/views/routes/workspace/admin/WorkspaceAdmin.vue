<template>
  <layout-with-header>
    <template v-slot:default="slotProps">
      <div class="lck-layout">
        <nav class="lck-nav" :class="{'lck-nav--active': slotProps.sidebarActive}">
          <ul class="lck-nav-list">
            <li v-for="item in menuItems" :key="item.id" :aria-label="item.label" class="lck-nav-item">
              <router-link :to="item.to" class="lck-nav-item-link">
                <i class="bi" :class="item.icon" />
              </router-link>
            </li>
          </ul>
        </nav>
        <router-view :sidebarActive="slotProps.sidebarActive" />
      </div>
    </template>
  </layout-with-header>
</template>

<script>
import { ROUTES_PATH } from '@/router/paths'
import { LckWorkspace } from '@/services/lck-api/definitions'
import { lckServices } from '@/services/lck-api'
import LayoutWithHeader from '@/layouts/WithHeader.vue'

import Vue from 'vue'

export default {
  name: 'WorkspaceAdmin',
  components: {
    'layout-with-header': Vue.extend(LayoutWithHeader),
  },
  props: {
    workspaceId: {
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
  async mounted () {
    this.loading = true
    this.workspace = await lckServices.workspace.get(this.workspaceId)
    this.loading = false
  },
  computed: {
    menuItems () {
      return [{
        id: 0,
        label: this.$t('pages.workspace.menu.databases'),
        icon: 'bi-server',
        to: `${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.ADMIN}${ROUTES_PATH.DATABASE}`,
      }, {
        id: 1,
        label: this.$t('pages.workspace.menu.visualization'),
        icon: 'bi-layout-text-window-reverse',
        to: `${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.ADMIN}${ROUTES_PATH.CMS}`,
      }, {
        id: 3,
        label: this.$t('pages.workspace.menu.process'),
        icon: 'bi-ui-checks',
        to: `${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.ADMIN}${ROUTES_PATH.PROCESS}`,
      }]
    },
  },
}
</script>
