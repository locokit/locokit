<template>
  <div class="p-grid h-full" v-if="workspaceContent">
    <div class="sidebar-menu-container p-col p-md-6 p-lg-2 lck-bg-primary o-auto h-max-full">
      <lck-chapters :chapters="workspaceContent.chapters" />
    </div>
    <div class="h-full p-col o-auto h-max-full">
      <router-view />
    </div>
  </div>
</template>

<script>
import { retrieveWorkspaceWithChaptersAndPages } from '@/store/visualize'
import Chapters from '@/components/visualize/Chapters/Chapters'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Workspace',
  components: {
    'lck-chapters': Chapters
  },
  props: ['workspaceId'],
  data () {
    return {
      workspaceContent: []
    }
  },
  async mounted () {
    this.workspaceContent = await retrieveWorkspaceWithChaptersAndPages(this.workspaceId)
    if (!this.$route.path.includes('page') && this.workspaceContent.chapters.length > 0 && this.workspaceContent.chapters[0].pages.length > 0) {
      await this.$router.replace(`${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${this.workspaceContent.chapters[0].pages[0].id}`)
    }
  }
}
</script>
