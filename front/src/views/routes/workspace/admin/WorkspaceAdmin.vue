<template>
  <layout-with-header>
    <template v-slot:default="slotProps">
      <div class="lck-layout-content lck-layout--with-nav">
        <nav class="lck-nav" :class="{'lck-nav--active': slotProps.sidebarActive}">
          <ul class="lck-nav-list">
            <li
              v-for="item in menuItems"
              :key="item.label"
              :aria-label="item.label"
              :title="item.label"
              class="lck-nav-item"
            >
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

<script lang="ts">
import { ROUTES_NAMES } from '@/router/paths'
import { LckWorkspace } from '@/services/lck-api/definitions'
import { lckServices } from '@/services/lck-api'
import LayoutWithHeader from '@/layouts/WithHeader.vue'

import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'

export default Vue.extend({
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
  data (): { loading: boolean; workspace: LckWorkspace | null } {
    return {
      loading: false,
      workspace: null,
    }
  },
  async mounted () {
    this.loading = true
    this.workspace = await lckServices.workspace.get(this.workspaceId)
    this.loading = false
  },
  computed: {
    menuItems (): Array<{
      label: TranslateResult;
      icon: string;
      to: { name: string; params: Record<string, any> };
    }> {
      return [{
        label: this.$t('pages.workspace.menu.databases'),
        icon: 'bi-server',
        to: {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.DATABASE,
          params: {
            workspaceId: this.workspaceId,
          },
        },
      }, {
        label: this.$t('pages.workspace.menu.cms'),
        icon: 'bi-layout-text-window-reverse',
        to: {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS,
          params: {
            workspaceId: this.workspaceId,
          },
        },
      }, {
        label: this.$t('pages.workspace.menu.process'),
        icon: 'bi-lightning',
        to: {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.PROCESS,
          params: {
            workspaceId: this.workspaceId,
          },
        },
      }, {
        label: this.$t('pages.workspace.menu.acl'),
        icon: 'bi-shield-lock',
        to: {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.ACL,
          params: {
            workspaceId: this.workspaceId,
          },
        },
      }, {
        label: this.$t('pages.workspace.menu.groups'),
        icon: 'bi-people',
        to: {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.GROUP,
          params: {
            workspaceId: this.workspaceId,
          },
        },
      }, {
        label: this.$t('pages.workspace.menu.files'),
        icon: 'bi-file-earmark',
        to: {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.FILES,
          params: {
            workspaceId: this.workspaceId,
          },
        },
      }, {
        label: this.$t('pages.workspace.menu.settings'),
        icon: 'bi-gear',
        to: {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.SETTINGS,
          params: {
            workspaceId: this.workspaceId,
          },
        },
      }]
    },
  },
})
</script>
