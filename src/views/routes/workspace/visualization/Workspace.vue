<template>
  <div class="p-grid h-full" v-if="workspaceContent">
    <div class="sidebar-menu-container lck-bg-primary o-auto h-max-full">
      <Sidebar :items="sidebarItems" />
    </div>
    <div class="main-container h-full p-col o-auto h-max-full">
      <router-view />
    </div>
  </div>
</template>

<script>
import { retrieveWorkspaceWithChaptersAndPages } from '@/store/visualize'
import Sidebar from '@/components/visualize/Sidebar/Sidebar'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Workspace',
  components: { Sidebar },
  props: ['workspaceId'],
  data () {
    return {
      workspaceContent: []
    }
  },
  computed: {
    sidebarItems () {
      if (!this.workspaceContent?.chapters) return []
      return this.workspaceContent.chapters.map(({ id, text, pages }) => {
        const subitems = pages.map(({ text, id }) => (
          {
            id,
            label: text,
            to: `${ROUTES_PATH.WORKSPACE}/${this.$route.params.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${id}`,
            active: id === this.$route.params.pageId
          }
        ))
        return (
          {
            id,
            label: text,
            subitems,
            active: subitems.some(({ active }) => active)
          }
        )
      })
    }
  },
  methods: {
    async goToFirstPage () {
      if (
        !this.$route.path.includes('page') &&
        this.workspaceContent.chapters.length > 0 &&
        this.workspaceContent.chapters[0].pages.length > 0
      ) {
        await this.$router.replace(`${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${this.workspaceContent.chapters[0].pages[0].id}`)
      }
    }
  },
  async mounted () {
    this.workspaceContent = await retrieveWorkspaceWithChaptersAndPages(this.workspaceId)
    await this.goToFirstPage()
  },
  async updated () {
    await this.goToFirstPage()
  }
}
</script>

<style>
.p-grid .main-container .responsive-table-wrapper {
  background: rgb(237,237,237) !important;
  background: linear-gradient(180deg, rgba(237,237,237,1) 2.3rem, rgba(255,255,255,1) 2.3rem, rgba(255,255,255,1) 100%) !important;
}
</style>
