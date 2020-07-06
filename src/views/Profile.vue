<template>
  <div
    class="flex flex-col h-full"
  >
    <section>
      <header class="font-bold">
        Your profile
      </header>
      {{ authState.data.user }}
    </section>
    <section>
      <header class="font-bold">
        Your groups
      </header>
      <div v-for="group in authState.data.groups" :key="group.id">
        {{ group.name }}
      </div>
    </section>
    <section>
      <header class="font-bold">
        Your workspace
      </header>
      <div v-for="workspace in workspaceState.data.workspaces" :key="workspace.id">
        <router-link :to="'/workspace/' + workspace.id">#{{workspace.id}} {{ workspace.text }}</router-link>
        {{ workspace.permissions }}
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import { authState, retrieveGroups } from '@/store/auth'
import { workspaceState, retrieveWorkspaces } from '@/store/visualize'

export default {
  name: 'Profile',
  data () {
    return {
      authState,
      workspaceState
    }
  },
  mounted () {
    retrieveGroups()
    retrieveWorkspaces()
  }
}
</script>
