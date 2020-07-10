<template>
  <header class="h-16 flex bg-white px-2 content-center justify-between">
    <img alt="logo" src="/img/logo.png" class="my-auto pr-2 bg-primary" />
    <div class="my-auto self-center">
      <router-link :to="ROUTES_PATH.PROFILE" v-if="isAuthenticated">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
      </router-link>
    </div>
  </header>
</template>

<script>
import { ROUTES_PATH } from '../../../router/paths'

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
