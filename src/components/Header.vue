<template>
  <header class="h-16 flex bg-primary px-2 justify-around">
    <img alt="logo" src="/img/logo.png" class="my-auto" />
    <router-link :to="ROUTES_PATH.PROFILE" v-if="isAuthenticated">Profil</router-link>
    <router-link :to="ROUTES_PATH.WORKSPACE" v-if="isAuthenticated">Workspace</router-link>
  </header>
</template>

<script>
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Header',
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ROUTES_PATH
    }
  }
}
</script>

<style>

</style>
