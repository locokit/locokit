<template>
  <layout-with-background>
    <template slot="title">
      {{ $t('pages.signup.title') }}
    </template>

    <div v-if="!signUpOk">
      <p>{{ $t('pages.signup.subtitle') }}</p>
      <sign-up
        class="p-mt-4"
        :error="error"
        :loading="loading"
        @submit="signUp"
      />
    </div>
    <div v-else class="p-text-center signup-message">
      <div class="p-d-flex p-ai-center p-px-3 p-pb-3">
        <i style="font-size:2em;" class="pi pi-check-circle p-text-success p-mr-4"></i>
        <p class="p-text-justify">{{ $t('pages.signup.signUpOk') }}</p>
      </div>
      <router-link :to="{ name: ROUTES_NAMES.HOME }">
        {{ $t('pages.verifysignup.homelink') }}
      </router-link>
    </div>
  </layout-with-background>

</template>

<script lang="ts">
import Vue from 'vue'

import { lckClient } from '@/services/lck-api'
import { LckSignUp } from '@/services/lck-api/definitions'
import { ROUTES_NAMES } from '@/router/paths'

import { appState } from '@/store/app'

import SignUp from '@/components/auth/SignUp/SignUp.vue'
import LayoutWithBackground from '@/layouts/WithBackground.vue'

export default Vue.extend({
  name: 'SignUp',
  data () {
    return {
      appState,
      error: null,
      loading: false,
      signUpOk: false,
      ROUTES_NAMES,
    }
  },
  components: {
    'layout-with-background': Vue.extend(LayoutWithBackground),
    'sign-up': SignUp,
  },
  methods: {
    async signUp (credentials: Partial<LckSignUp>) {
      if (appState.allowSignUp) {
        this.loading = true
        try {
          await lckClient.service('signup').create(credentials)
          this.signUpOk = true
          this.error = null
        } catch (err) {
          this.error = err
        } finally {
          this.loading = false
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.impossibleOperation'),
          detail: this.$t('pages.signup.forbid'),
          life: 5000,
        })
      }
    },
  },
})

</script>
