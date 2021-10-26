<template>
  <layout-with-sidebar>
    <template #sidebar>
      <lck-sidebar
        :items="sidebarItems"
        v-on="$listeners"
      />
    </template>
    <template>
      <router-view
        :key="forceUpdateKey"
        :chapters="Array.isArray(workspaceContent.chapters) ? workspaceContent.chapters : []"
        :workspaceId="workspaceId"
        :userId="userId"
      />

      <p-confirm-dialog />
    </template>
  </layout-with-sidebar>
</template>

<script>
import Vue from 'vue'

import LayoutWithSidebar from '@/layouts/WithSidebar.vue'
import { ROUTES_PATH } from '@/router/paths'
import { lckHelpers } from '@/services/lck-api'
import { authState } from '@/store/auth'

import ConfirmDialog from 'primevue/confirmdialog'

import Sidebar from '@/components/visualize/Sidebar/Sidebar.vue'

export default {
  name: 'Workspace',
  components: {
    'layout-with-sidebar': Vue.extend(LayoutWithSidebar),
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
      workspaceContent: null,
    }
  },
  computed: {
    sidebarItems () {
      if (!this.workspaceContent?.chapters) return []
      return this.workspaceContent.chapters.map(({ id, text, pages = [] }) => {
        const subitems = pages.map(({ text, id, hidden }) => (
          {
            id,
            label: text,
            to: `${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${id}`,
            hidden,
          }
        ))
        return (
          {
            id,
            label: text,
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
        this.workspaceContent.chapters.length > 0 &&
        this.workspaceContent.chapters[0].pages.length > 0
      ) {
        const pageNotHidden = this.workspaceContent.chapters[0].pages.find(page => page.hidden !== true)
        if (pageNotHidden) {
          await this.$router.replace(`${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${pageNotHidden.id}`)
        }
      }
    },
  },
  async mounted () {
    this.workspaceContent = await lckHelpers.retrieveWorkspaceWithChaptersAndPages(this.workspaceId)
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

<style scoped>
.lck-edit-button {
  position: fixed;
  bottom: 1em;
  right: 1em;
  z-index: 15;
}
</style>
