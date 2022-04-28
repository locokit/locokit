<template>
  <layout-with-background class="p-text-left">
    <template slot="title">
      {{ $t('pages.lostpassword.title') }}
    </template>

    <div v-if="!sendResetOK">
      {{ $t('pages.lostpassword.subtitle') }}
      <lost-password
        class="p-mt-4"
        @submit="sendResetPasswordLink"
        :loading="loading"
        :error="error"
        :sendResetOK="sendResetOK"
      />
    </div>
    <div v-else class="p-text-center lostpassword-message">
      <div class="p-d-flex p-ai-center p-px-3 p-pb-3">
        <i style="font-size:2em;" class="pi pi-check-circle p-text-success p-mr-4"></i>
        <p class="p-text-justify">{{ $t('pages.lostpassword.sendResetOK') }}</p>
      </div>
      <router-link :to="{ name: ROUTES_NAMES.HOME }">
        {{ $t('pages.lostpassword.homelink') }}
      </router-link>
    </div>

  </layout-with-background>

</template>

<script lang="ts">
import Vue from 'vue'

import LayoutWithBackground from '@/layouts/WithBackground.vue'
import LostPassword from '@/components/auth/LostPassword/LostPassword.vue'
import { lckClient } from '@/services/lck-api'
import { ROUTES_NAMES } from '@/router/paths'

export default Vue.extend({
  name: 'LostPassword',
  data () {
    return {
      loading: false,
      sendResetOK: false,
      error: null as Error | null,
      ROUTES_NAMES,
    }
  },
  components: {
    'layout-with-background': Vue.extend(LayoutWithBackground),
    'lost-password': Vue.extend(LostPassword),
  },
  methods: {
    async sendResetPasswordLink (email: string) {
      this.loading = true
      try {
        await lckClient.service('authManagement').create({
          action: 'sendResetPwd',
          value: {
            email,
          },
        })
        this.error = null
        this.sendResetOK = true
      } catch (err) {
        this.error = err as Error
      }
      this.loading = false
    },
  },
})

</script>
