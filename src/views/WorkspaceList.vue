<template>
  <div
    class="generic-view-container p-mx-auto"
  >
    <header class="p-my-4 lck-color-title">
      {{ $t('pages.workspaces.title') }}
    </header>

    <router-link
      class="no-decoration-link"
      v-for="workspace in workspaceState.data.workspaces"
      :key="workspace.id"
      :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}`"
    >
      <prime-card
        class="p-mb-4"
      >
        <template slot="title">
          {{workspace.text}}
        </template>
        <template slot="content">
          <div>
            <ul class="lck-ul-content">
              <li>#{{workspace.id}}</li>
              <li>
                {{ $t('pages.workspaces.created') }} {{ workspace.createdAt }}
              </li>
              <li>
                {{ $t('pages.workspaces.updated') }} {{ workspace.updatedAt }}
              </li>
            </ul>
          </div>
        </template>
      </prime-card>
    </router-link>
  </div>
</template>

<script>
import Vue from 'vue'
import { retrieveWorkspaces, workspaceState } from '@/store/visualize'
import { ROUTES_PATH } from '@/router/paths'
import Card from 'primevue/card'

export default {
  name: 'WorkspaceList',
  data () {
    return {
      ROUTES_PATH,
      workspaceState
    }
  },
  components: {
    'prime-card': Vue.extend(Card)
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
