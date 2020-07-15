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
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Home',
  components: {
    Login
  },
  methods: {
    async authenticate (data) {
      await authenticate(data)
      await this.$router.push(ROUTES_PATH.WORKSPACE)
    }
  }
}
</script>
