<template>
  <div class="p-grid h-full" v-if="workspaceContent">
    <div class="sidebar p-col-12 p-md-6 p-lg-3">
      <Chapter :chapters="workspaceContent.chapters" />
    </div>
    <div class="h-full p-col">
      <router-view />
    </div>
  </div>
</template>

<script>
import { retrieveWorkspaceWithChaptersAndPages } from '@/store/visualize'
import Chapter from '@/components/visualize/Chapter/Chapter'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Workspace',
  components: { Chapter },
  props: ['workspaceId'],
  data () {
    return {
      workspaceContent: []
    }
  },
  async mounted () {
    this.workspaceContent = await retrieveWorkspaceWithChaptersAndPages(this.workspaceId)
    if (!this.$route.path.includes('page') && this.workspaceContent.chapters.length > 0 && this.workspaceContent.chapters[0].pages.length > 0) {
      await this.$router.replace(`${ROUTES_PATH.WORKSPACE}/${this.workspaceId}/page/${this.workspaceContent.chapters[0].pages[0].id}`)
    }
  }
}
</script>
