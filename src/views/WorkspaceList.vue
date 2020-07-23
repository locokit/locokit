<template>
  <div
    class="max-w-4xl mx-auto"
  >
    <header class="my-4 text-gray-600 text-xl">
      {{ $t('pages.workspaces.title') }}
    </header>

    <router-link
      v-for="workspace in workspaceState.data.workspaces"
      :key="workspace.id"
      :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}`"
    >
      <el-card
        class="box-card mb-4"
        :header="workspace.text"
      >
        <div class="text item">
          <ul>
            <li>#{{workspace.id}}</li>
            <li>
              {{ $t('pages.workspaces.created') }} {{ workspace.createdAt }}
            </li>
            <li>
              {{ $t('pages.workspaces.updated') }} {{ workspace.updatedAt }}
            </li>
          </ul>
        </div>
      </el-card>
    </router-link>
  </div>
</template>

<script>
import { workspaceState, retrieveWorkspaces } from '@/store/visualize'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'WorkspaceList',
  data () {
    return {
      ROUTES_PATH,
      workspaceState
    }
  },
  async beforeRouteEnter (to, from, next) {
    await retrieveWorkspaces()
    if (workspaceState.data.workspaces.length === 1) {
      next({
        path: `${ROUTES_PATH.WORKSPACE}/${workspaceState.data.workspaces[0].id}`
      })
    } else {
      next()
    }
  }
}
</script>

<style scoped>

</style>
