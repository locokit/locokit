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
import { authenticate, authState } from '@/store/auth'

export default {
  name: 'Home',
  components: {
    Login
  },
  methods: {
    async authenticate (data) {
      await authenticate(data)
      if (authState.data.isAuthenticated) {
        this.$router.push('/profile')
      }
    }
  }
}
</script>
