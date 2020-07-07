<template>
  <div
    class="h-full"
  >
    <div v-if="workspaceContent.length > 0">
      <h1>{{workspaceContent[0].text}}</h1>
      <Chapter :chapters="workspaceContent[0].chapters" />
    </div>
  </div>
</template>

<script>
import { retrieveWorkspacesWithPagesAndBlocks } from '@/store/visualize'
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
    this.workspaceContent = await retrieveWorkspacesWithPagesAndBlocks()
  }
}
</script>
