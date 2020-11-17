<template>
  <layout-with-background class="p-text-left">
    <template slot="title">
      {{ $t('pages.resetpassword.title') }}
    </template>

    <div v-if="!resetOK">
      {{ $t('pages.resetpassword.subtitle') }}
      <reset-password
        class="p-mt-4"
        @submit="resetPassword"
        :loading="loading"
        :error="error"
      />
    </div>
    <div v-else>
      <p>
        {{ $t('pages.resetpassword.resetOK') }}
      </p>

      <router-link to="/">
        {{ $t('pages.resetpassword.homelink') }}
      </router-link>
    </div>

  </layout-with-background>

</template>

<script lang="ts">
import Vue from 'vue'

import LayoutWithBackground from '@/layouts/WithBackground.vue'
import ResetPassword from '@/components/auth/ResetPassword/ResetPassword.vue'
import { lckClient } from '@/services/lck-api'

export default Vue.extend({
  name: 'ResetPassword',
  data () {
    return {
      loading: false,
      resetOK: false,
      error: null
    }
  },
  components: {
    'layout-with-background': Vue.extend(LayoutWithBackground),
    'reset-password': Vue.extend(ResetPassword)
  },
  methods: {
    async resetPassword (password: string) {
      this.loading = true
      try {
        await lckClient.service('authManagement').create({
          action: 'resetPwdLong',
          value: {
            token: this.$route.query?.token, // compares to .resetToken
            password // new password
          }
        })
        this.error = null
        this.resetOK = true
      } catch (err) {
        this.error = err
      }
      this.loading = false
    }
  }
})

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
