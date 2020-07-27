<template>
  <div
    class="profile-container p-d-flex p-flex-column p-as-center p-mx-auto"
  >
    <header class="lck-color-title p-my-4">
      {{ $t('pages.profile.title') }}
    </header>
    <section class="p-mb-4">
      <prime-card>
        <template slot="title">
          {{$t('pages.profile.title')}}
        </template>
        <template slot="content">
          {{ authState.data.user.first_name}}
          {{ authState.data.user.last_name}}
          <br>
          {{ $t('pages.profile.email') }}&nbsp;{{ authState.data.user.email}}
          <br>
          {{ $t('pages.profile.role') }}&nbsp;{{ authState.data.user.profile}}
        </template>
      </prime-card>
    </section>
    <section class="p-mb-4">
      <prime-card>
        <template slot="title">
          {{$t('pages.profile.groups')}}
        </template>
        <template slot="content">
          <div v-for="group in authState.data.groups" :key="group.id">
            {{ group.name }}
          </div>
        </template>
      </prime-card>
    </section>
    <section class="p-mb-4">
      <prime-card>
        <template slot="title">
          {{$t('pages.profile.workspaces')}}
        </template>
        <template slot="content">
          <ul class="lck-ul-content">
            <li
              v-for="workspace in workspaceState.data.workspaces"
              :key="workspace.id"
            >
              <router-link
                :to="'/workspace/' + workspace.id"
              >
                {{ workspace.text }}
              </router-link>
            </li>
          </ul>
        </template>
      </prime-card>
    </section>
    <div>
      <prime-button
        class="p-button-warning p-jc-end"
        type="button"
        :label="$t('pages.profile.button-logout')"
        icon="pi pi-sign-out"
        iconPos="right"
        @click="logout"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { authState, retrieveGroups, logout } from '@/store/auth'
import { workspaceState, retrieveWorkspaces } from '@/store/visualize'
import { ROUTES_PATH } from '@/router/paths'
import Vue from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'

export default {
  name: 'Profile',
  data () {
    return {
      authState,
      workspaceState
    }
  },
  components: {
    'prime-card': Vue.extend(Card),
    'prime-button': Vue.extend(Button)
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

<style scoped>
  .profile-container {
    max-width: 56rem;
  }
</style>
