<template>
  <div class="lck-layout">
    <nav class="lck-nav">
      <ul class="lck-nav-list">
        <li v-for="item in menuItems" :key="item.id" :aria-label="item.label" class="lck-nav-item">
          <router-link :to="item.to" class="lck-nav-item-link">
            <i class="bi" :class="item.icon" />
          </router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { ROUTES_PATH } from '@/router/paths'
import { LckWorkspace } from '@/services/lck-api/definitions'

export default {
  name: 'WorkspaceAdmin',
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
        to: `${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.ADMIN}${ROUTES_PATH.VISUALIZATION}`,
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
