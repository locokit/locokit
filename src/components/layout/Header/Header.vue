<template>
  <header
    class="h-16 flex px-2 content-center justify-between border-b bg-white"
  >
    <router-link
      :to="ROUTES_PATH.WORKSPACE"
      class="my-auto pr-2"
    >
      <img
        alt="logo"
        :src="logoUrl"
      />
    </router-link>
    <div class="my-auto">
      <router-link
        :to="ROUTES_PATH.PROFILE"
      >
        <el-avatar icon="el-icon-user-solid"></el-avatar>
      </router-link>
    </div>
  </el-header>
</template>

<script>
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Header',
  props: {
    logoUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      ROUTES_PATH
    }
  }
}
</script>
