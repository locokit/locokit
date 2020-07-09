<template>
  <div
    class="flex flex-row h-full"
  >
    <img alt="Background" src="/img/bg-intro.jpg" class="w-3/4 object-cover"/>
    <Login class="m-auto" @submit="authenticate" />
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/auth/Login/Login.vue'
import { authenticate } from '@/store/auth'
import { retrieveWorkspaces, workspaceState } from '../store/visualize'

export default {
  name: 'Home',
  components: {
    Login
  },
  methods: {
    async authenticate (data) {
      await authenticate(data)
      await retrieveWorkspaces()
      switch (workspaceState.data.workspaces.length) {
        case 1:
          // go to this workspace
          this.$router.push('/workspace/' + workspaceState.data.workspaces[0].id)
          return
        default:
          // go to a page presenting all workspaces
          // or allowing the creation of one
          this.$router.push('/workspace')
      }
    }
  }
}
</script>
