<template>
  <div
      class="h-full"
  >
    <div v-if="workspaceContent.length > 0">
      <el-row class="tac">
        <el-col :sm="4" :lg="3">
          <Chapter :chapters="workspaceContent[0].chapters" />
        </el-col>
        <el-col :sm="6" :lg="21">
          <router-view />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { retrieveWorkspacesWithPages } from '@/store/visualize'
import Chapter from '@/components/Chapter'

export default {
  name: 'Workspace',
  components: { Chapter },
  data () {
    return {
      workspaceContent: []
    }
  },
  async mounted () {
    this.workspaceContent = await retrieveWorkspacesWithPages()
  }
}
</script>
