<template>
  <layout-with-background>
    <template slot="title">
      {{ $t('pages.home.title') }}
    </template>

    {{ $t('pages.home.subtitle') }}

    <login
      class="p-mt-4"
      @submit="authenticate"
      :loading="authState.loading"
      :error="authState.error"
    />
    <lck-popup-reload />

  </layout-with-background>

</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue'
import Login from '@/components/auth/Login/Login.vue'
import PopupReload from '@/components/ui/PopupReload/PopupReload.vue'
import { AuthDTO, authenticate, authState } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import LayoutWithBackground from '@/layouts/WithBackground.vue'

export default {
  name: 'Home',
  components: {
    'layout-with-background': Vue.extend(LayoutWithBackground),
    login: Vue.extend(Login),
    'lck-popup-reload': Vue.extend(PopupReload)
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
    async authenticate (data: AuthDTO) {
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
.p-error {
  font-weight: bold;
  position: relative;
  transition: opacity 0.5s ease-in-out;
  color: var(--color-error);
}
</style>
