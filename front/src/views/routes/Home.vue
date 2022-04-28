<template>
  <layout-with-background>
    <template slot="title">
      {{ $t('pages.home.title') }}
    </template>

    {{ $t('pages.home.subtitle') }}

    <lck-login
      class="p-mt-4"
      @submit="authenticate"
      :loading="authState.loading"
      :error="authState.error"
      :displaySignUpLink="appState.allowSignUp"
    />
  </layout-with-background>
</template>

<script lang="ts">
import Vue from 'vue'

import Login from '@/components/auth/Login/Login.vue'

import { AuthDTO, authenticate, authState } from '@/store/auth'
import { appState } from '@/store/app'
import { ROUTES_PATH } from '@/router/paths'
import LayoutWithBackground from '@/layouts/WithBackground.vue'

export default Vue.extend({
  name: 'Home',
  components: {
    'layout-with-background': Vue.extend(LayoutWithBackground),
    'lck-login': Login,
  },
  data () {
    return {
      authState,
      appState,
      // eslint-disable-next-line no-undef
      backgroundImage: LCK_THEME.HOME_BACKGROUND_IMAGE_URL,
      // eslint-disable-next-line no-undef
      logoBgPrimaryURL: LCK_THEME.LOGO_BG_PRIMARY_URL,
      // eslint-disable-next-line no-undef
      version: LCK_VERSION,
    }
  },
  methods: {
    async authenticate (data: AuthDTO) {
      await authenticate(data)

      if (authState.data.isAuthenticated) {
        // We catch the error of Vue router redirect (double redirect)
        // cf: https://stackoverflow.com/a/65326844
        this.$router.push(ROUTES_PATH.WORKSPACE).catch((error: Error) => {
          console.info(error.message)
        })
      }
    },
  },
})
</script>

<style scoped>
.p-error {
  font-weight: var(--font-weight-bold);
  position: relative;
  transition: opacity 0.5s ease-in-out;
  color: var(--color-error);
}
</style>
