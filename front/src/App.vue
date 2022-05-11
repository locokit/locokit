<template>
  <div
    id="app"
    class="p-d-flex p-flex-column"
  >
    <lck-popup-reload
      v-if="displayPopupReload"
      @cancel="displayPopupReload = false"
    />

    <lck-dialog
      :baseZIndex="1101"
      :closable="false"
      :closeOnEscape="false"
      :header="$t('error.expiredToken.header')"
      :visible="authState.data.expiredToken && authState.data.isAuthenticated"
    >
      <p>{{ $t('error.expiredToken.message') }}</p>
      <lck-login
        class="bordered-login"
        :error="authState.error"
        :loading="authState.loading"
        :logInAgain="true"
        @submit="authenticate"
      />
    </lck-dialog>

    <main class="p-d-flex p-flex-column d-flex-1 o-auto w-full">
      <router-view />
    </main>

    <p-toast position="top-right" />
  </div>
</template>

<script lang="ts">
import {
  authState,
  authenticate,
} from '@/store/auth'
import { appState } from '@/store/app'
import Login from '@/components/auth/Login/Login.vue'
import Dialog from './components/ui/Dialog/Dialog.vue'
import PopupReload from '@/components/ui/PopupReload/PopupReload.vue'
import Toast from 'primevue/toast'
import Vue from 'vue'
import { PrimeVueLocaleOptions } from 'primevue/config/PrimeVue'

export default Vue.extend({
  name: 'app',
  components: {
    'lck-dialog': Dialog,
    'lck-login': Login,
    'lck-popup-reload': PopupReload,
    'p-toast': Toast,
  },
  data () {
    return {
      // keep it here in the data to make it reactive
      authState,
      displayPopupReload: false,
      appState,
    }
  },
  computed: {
    displayHeader (): boolean {
      let result = true
      if (this.$route?.meta?.needHeader !== undefined) {
        result = this.$route.meta.needHeader
      }
      return result
    },
  },
  methods: {
    authenticate,
  },
  created () {
    // Listen for swUpdated event and display refresh modal.
    document.addEventListener('swUpdated', () => {
      this.displayPopupReload = true
    }, { once: true })
  },
  watch: {
    '$i18n.locale': {
      handler () {
        this.$primevue.config.locale = this.$t('localePrime') as unknown as PrimeVueLocaleOptions
      },
      immediate: true,
    },
  },

})
</script>

<style lang="scss" src="@/styles/global.scss"></style>

<style lang="scss" scoped>
.bordered-login {
  border: 1px solid var(--primary-color);
  padding: 1em;
}
</style>
