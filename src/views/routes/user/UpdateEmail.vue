<template>
  <layout-with-background>

    <template slot="title">
      <h1>{{ $t('pages.updateEmail.title') }}</h1>
    </template>

    <div v-if="loading" class="p-text-center">
      <p-progress-spinner class="spinner"  />
      <p>{{ $t('pages.updateEmail.loading') }}</p>
    </div>

    <div v-else class="p-px-5">
      <div class="p-d-flex p-ai-center update-email-result">
        <template v-if="updateOK">
          <span class="pi pi-check-circle p-text-success"></span>
          <p>{{ $t('pages.updateEmail.updateOK') }}</p>
        </template>

        <template v-else>
          <span class="pi pi-times-circle p-text-error"></span>
          <p>{{ $t('pages.updateEmail.updateKO') }}</p>
        </template>
      </div>

      <p class="p-text-center">
        <router-link to="/">
          {{ $t('pages.verifysignup.homelink') }}
        </router-link>
      </p>
    </div>

  </layout-with-background>
</template>

<script lang="ts">
import Vue from 'vue'

import ProgressSpinner from 'primevue/progressspinner'

import LayoutWithBackground from '@/layouts/WithBackground.vue'

import { lckClient } from '@/services/lck-api'
import { logout } from '@/store/auth'

export default Vue.extend({
  name: 'UpdateEmail',
  data () {
    return {
      loading: false,
      updateOK: false,
    }
  },
  components: {
    'layout-with-background': Vue.extend(LayoutWithBackground),
    'p-progress-spinner': Vue.extend(ProgressSpinner),
  },
  async mounted () {
    this.loading = true
    try {
      await lckClient.service('authManagement')
        .create({
          action: 'verifySignupLong',
          value: this.$route.query?.token,
        })
      this.updateOK = true
      logout()
    } catch (error) {
      this.updateOK = false
    } finally {
      this.loading = false
    }
  },
})

</script>

<style scoped>
.spinner {
  width: 4em;
  height: 4em;
}

.update-email-result span.pi {
  font-size: 2em;
  margin-right: 0.5em;
}
</style>
