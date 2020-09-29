<template>
  <div
    class="home p-grid p-jc-center p-ai-center vertical-container w-full"
    :style="{
      'background-image': 'url(' + backgroundImage + ')'
    }"
  >
    <div class="login-block p-col-11 p-sm-5 p-md-6 p-xl-4">
      <img
        alt="logo"
        :src="logoBgPrimaryURL"
        class="p-mb-4"
      />
      <div class="p-error" :class="{ 'errorActive' : authState.error }"><p>{{ authState.error }}</p></div>

      <Login
        @submit="authenticate"
        :loading="authState.loading"
        :error="authState.error"
      />

    </div>
    <PopupReload />
    <div class="version-block p-p-2">
      {{ version }}
    </div>

  </div>

</template>

<script>
// @ is an alias to /src
import Login from '@/components/ui/Login/Login.vue'
import PopupReload from '@/components/ui/PopupReload/PopupReload.vue'
import { authenticate, authState } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Home',
  components: {
    Login,
    PopupReload
  },
  data () {
    return {
      authState,
      // eslint-disable-next-line no-undef
      backgroundImage: LCK_SETTINGS.HOME_BACKGROUND_IMAGE_URL,
      // eslint-disable-next-line no-undef
      logoBgPrimaryURL: LCK_SETTINGS.LOGO_BG_PRIMARY_URL,
      // eslint-disable-next-line no-undef
      version: LCK_VERSION
    }
  },
  methods: {
    async authenticate (data) {
      await authenticate(data)
      if (authState.data.isAuthenticated) {
        // Do not remove the await to prevent Error: Redirected from X to Y via a navigation guard.
        // It's necessary to reach the path before switching to another path.
        await this.$router.push(ROUTES_PATH.WORKSPACE)
      }
    }
  }
}
</script>

<style scoped>
.home {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
}
.login-block {
  text-align: center;
  margin-top: -45px;
}
.version-block {
  position: absolute;
  right: 0;
  bottom: 0;
  color: var(--surface-d);
}
</style>
