<template>
  <header
    class="h-16 flex px-2 content-center justify-between border-b"
    :class="{
      'bg-white': isAuthenticated,
      'bg-primary': !isAuthenticated
    }"
  >
    <router-link
      :to="isAuthenticated ? ROUTES_PATH.WORKSPACE : ROUTES_PATH.HOME"
      class="my-auto pr-2"
    >
      <img
        alt="logo"
        :src="'/img/logo-bg-' + (isAuthenticated ? 'white' : 'primary') + '.png'"
      />
    </router-link>
    <div class="my-auto">
      <router-link
        :to="ROUTES_PATH.PROFILE"
        v-if="isAuthenticated"
      >
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
