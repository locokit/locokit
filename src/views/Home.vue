<template>
  <div
    class="Home h-full flex flex-col justify-center items-center"
    :style="{
      'background-image': 'url(' + backgroundImage + ')'
    }"
  >
    <img
      alt="logo"
      :src="logoBgPrimaryURL"
      class="mb-4"
    />
    <Login @submit="authenticate" />
    <div class="text-red-600 h-10">
      {{ authState.error }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/auth/Login/Login.vue'
import { authenticate, authState } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Home',
  components: {
    Login
  },
  data () {
    return {
      authState,
      // eslint-disable-next-line no-undef
      backgroundImage: LCK_SETTINGS.HOME_BACKGROUND_IMAGE_URL,
      // eslint-disable-next-line no-undef
      logoBgPrimaryURL: LCK_SETTINGS.LOGO_BG_PRIMARY_URL
    }
  },
  methods: {
    async authenticate (data) {
      await authenticate(data)
      if (authState.data.isAuthenticated) {
        this.$router.push(ROUTES_PATH.WORKSPACE)
      }
    }
  }
}
</script>

<style scoped>
.Home {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
