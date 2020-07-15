<template>
  <div
      class="h-full"
  >
    <div class="bg-gray-100" v-if="workspaceContent">
      <el-row>
        <el-col :sm="6">
          <Chapter :chapters="workspaceContent.chapters" />
        </el-col>
        <el-col :sm="18">
          <router-view />
        </el-col>
      </el-row>
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
