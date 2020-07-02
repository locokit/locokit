<template>
  <div class="flex flex-row h-full">
    <img alt="Background" src="/img/bg-intro.jpg" class="w-3/4 object-cover"/>
    <Login class="m-auto" />
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/auth/Login/Login.vue'

export default {
  name: 'Home',
  components: {
    Login
  }
}
</script>
