<template>
  <layout-with-background class="p-text-left p-fluid">
    <template slot="title">
      {{ $t('pages.verifysignup.title') }}
    </template>

    <div v-if="!verifyOK">
      {{ $t('pages.verifysignup.subtitle') }}
      <reset-password
        class="p-mt-4"
        @submit="verifySignupAndSetPassword"
        :loading="loading"
        :error="error"
        :reset="false"
      />

    </div>
    <div v-else>
      <p>
      {{ $t('pages.verifysignup.verifyOK') }}
      </p>

      <router-link to="/">
        {{ $t('pages.verifysignup.homelink') }}
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
  name: 'VerifySignup',
  data () {
    return {
      loading: false,
      verifyOK: false,
      error: null,
    }
  },
  components: {
    'layout-with-background': Vue.extend(LayoutWithBackground),
    'reset-password': Vue.extend(ResetPassword),
  },
  methods: {
    async verifySignupAndSetPassword (password: string) {
      this.loading = true
      try {
        await lckClient.service('authManagement').create({
          action: 'verifySignupSetPasswordLong',
          value: {
            token: this.$route.query?.token,
            password,
          },
        })
        this.error = null
        this.verifyOK = true
      } catch (err) {
        this.error = err as any
      }
      this.loading = false
    },
  },
})

</script>
