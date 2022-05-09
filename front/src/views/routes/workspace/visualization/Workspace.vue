<template>
  <layout-with-header>
    <template v-slot:default="slotProps">
      <div class="lck-layout-content">
        <lck-sidebar
          :items="sidebarItems"
          v-on="$listeners"
          :sidebarActive="slotProps && slotProps.sidebarActive"
        />
        <div class="lck-page">
          <router-view
            :key="forceUpdateKey"
            :chapters="Array.isArray(workspaceUserGroups) ? workspaceUserGroups : []"
            :workspaceId="workspaceId"
            :userId="userId"
            :sidebarItems="sidebarItems"
          />
          <p-confirm-dialog />
        </div>
      </div>
    </template>
  </layout-with-header>
</template>
<script>
import Vue from 'vue'

import LayoutWithHeader from '@/layouts/WithHeader.vue'
import { ROUTES_NAMES, ROUTES_PATH } from '@/router/paths'
import { lckHelpers } from '@/services/lck-api'
import { authState } from '@/store/auth'

import ConfirmDialog from 'primevue/confirmdialog'

import Sidebar from '@/components/visualize/Sidebar/Sidebar.vue'

export default {
  name: 'Workspace',
  components: {
    'layout-with-header': Vue.extend(LayoutWithHeader),
    'lck-sidebar': Sidebar,
    'p-confirm-dialog': Vue.extend(ConfirmDialog),
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      forceUpdateKey: true,
      workspaceUserGroups: [],
    }
  },
  computed: {
    sidebarItems () {
      return this.workspaceUserGroups.map(({ id: groupId, name: groupName, chapter }) => {
        const subitems = chapter?.pages?.map(({ text: pageText, id: pageId, hidden }) => (
          {
            id: pageId,
            label: pageText,
            to: `${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.VISUALIZATION}/${groupId}/page/${pageId}`,
            hidden,
          }
        ))
        return (
          {
            id: groupId,
            label: groupName,
            subitems,
          }
        )
      })
    },
    userId () {
      return authState.data.user?.id
    },
  },
  methods: {
    async goToFirstPage () {
      if (
        !this.$route.path.includes('page') &&
        this.workspaceUserGroups.length > 0 &&
        this.workspaceUserGroups[0].chapter.pages.length > 0
      ) {
        const pageNotHidden = this.workspaceUserGroups[0].chapter.pages.find(page => page.hidden !== true)
        if (pageNotHidden) {
          await this.$router.replace({
            name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE,
            params: {
              workspaceId: this.workspaceId,
              groupId: this.workspaceUserGroups[0].id,
              pageId: pageNotHidden.id,
            },
          })
        }
      }
    },
  },
  async mounted () {
    this.workspaceUserGroups = await lckHelpers.retrieveWorkspaceUserGroupsWithChaptersAndPages(this.workspaceId, authState.data.user.id)
    await this.goToFirstPage()
  },
}
</script>

<style>
.p-grid .main-container .responsive-table-wrapper {
  background: rgb(237, 237, 237) !important;
  background: linear-gradient(
    180deg,
    rgba(237, 237, 237, 1) 2.5rem,
    rgba(255, 255, 255, 1) 2.3rem,
    rgba(255, 255, 255, 1) 100%
  ) !important;
}
</style>

<style scoped lang="scss">
.lck-edit-button {
  position: fixed;
  bottom: 1em;
  right: 1em;
  z-index: 15;
}

@media print {
  .lck-page {
    padding: 0;
    margin: 0;
    overflow: visible !important;
    height: 100%;
    display: block;
    background: #FFF;
    font-size: 12pt;
  }
}

::v-deep .lck-sidebar {
  background-color: var(--sidebar-app-background-color);
  width: var(--sidebar-app-width);
  .p-accordion-header-link {
    color: var(--sidebar-app-text-color);
  }
  &-link {
    color: var(--sidebar-app-text-color);
  }
  .p-accordion-header-link,
  &-link {
    &.router-link-active {
      color: var(--sidebar-app-text-color-active);
      &::before {
        background: var(--sidebar-app-link-hover);
      }
    }
    &:hover {
      &::before {
        background: var(--sidebar-app-link-hover);
      }
    }
  }
}
</style>
