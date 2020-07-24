<template>
  <div class="h-full bg-gray-100" v-if="workspaceContent">
    <el-row class="h-full">
      <el-col :sm="8" :lg="6" :xl="4" class="sidebar">
        <div class="sidebar-inner">
          <div class="flex-scroll scroll-styled ">
            <Chapter :chapters="workspaceContent.chapters" />
          </div>
        </div>
      </el-col>
      <el-col :sm="16" :lg="18" :xl="20" class="h-full">
        <router-view />
      </el-col>
    </el-row>
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
