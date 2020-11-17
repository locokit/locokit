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
    <div v-else>
      {{ $t('pages.lostpassword.sendResetOK') }}
    </div>

  </layout-with-background>

</template>

<script lang="ts">
import Vue from 'vue'

import LayoutWithBackground from '@/layouts/WithBackground.vue'
import LostPassword from '@/components/auth/LostPassword/LostPassword.vue'
import { lckClient } from '@/services/lck-api'

export default Vue.extend({
  name: 'LostPassword',
  data () {
    return {
      loading: false,
      sendResetOK: false,
      error: null
    }
  },
  components: {
    'layout-with-background': Vue.extend(LayoutWithBackground),
    'lost-password': Vue.extend(LostPassword)
  },
  methods: {
    async sendResetPasswordLink (email: string) {
      this.loading = true
      try {
        await lckClient.service('authManagement').create({
          action: 'sendResetPwd',
          value: {
            email
          }
        })
        this.error = null
        this.sendResetOK = true
      } catch (err) {
        this.error = err
      }
      this.loading = false
    }
  }
})

</script>
