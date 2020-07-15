<template>
  <div
      class="max-w-4xl mx-auto"
  >
    <header class="my-4 text-gray-600 text-xl">
      {{ $t('pages.profile.title') }}
    </header>
    <section class="mb-4">
      <el-card class="box-card" :header="$t('pages.profile.title')">
        {{ authState.data.user.first_name}}
        {{ authState.data.user.last_name}}
        <br>
        email: {{ authState.data.user.email}}
        <br>
        role: {{ authState.data.user.profile}}
      </el-card>
    </section>
    <section class="mb-4">
      <el-card class="box-card" :header="$t('pages.profile.groups')">
        <div v-for="group in authState.data.groups" :key="group.id">
          {{ group.name }}
        </div>
      </el-card>
    </section>
    <section class="mb-4">
      <el-card class="box-card" :header="$t('pages.profile.workspaces')">
        <ul>
          <router-link
              v-for="workspace in workspaceState.data.workspaces"
              :key="workspace.id"
              :to="'/workspace/' + workspace.id"
          >
           <li>#{{workspace.id}} {{ workspace.text }}</li>
          </router-link>
        </ul>
      </el-card>
    </section>
    <el-button type="warning" @click="logout">
      {{ $t('pages.profile.button-logout') }}
    </el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import { authState, retrieveGroups, logout } from '@/store/auth'
import { workspaceState, retrieveWorkspaces } from '@/store/visualize'
import { ROUTES_PATH } from '../router/paths'

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
  },
  methods: {
    logout () {
      logout()
      this.$router.push(ROUTES_PATH.HOME)
    }
  }
}
</script>
