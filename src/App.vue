<template>
  <div
    id="app"
    class="p-d-flex p-flex-column"
    :class="sidebarActive ? 'sidebar-is-open' : 'sidebar-is-closed'"
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

    <div
      class="layout-sidebar"
      :class="sidebarActive ? 'active' : 'hidden'"
    />
    <lck-header
      v-if="displayHeader"
      :logo-url="logoURL"
      @menu-button-click="toggleSidebar"
      @prevent-opacity-mobile="setStatusSidebar"
      :logo-mobile-url="logoMobileUrl"
      :is-super-admin="isSuperAdmin"
      @logout-click="onLogoutClick"
      :has-burger-menu="appState.hasBurgerMenu"
    />
    <main class="p-d-flex p-flex-column d-flex-1 o-auto w-full">
      <router-view
        @click-sidebar-item="toggleSidebar"
      />
    </main>

    <p-toast position="top-right" />
  </div>
</template>

<script>
import {
  authState,
  authenticate,
  logout,
} from '@/store/auth'
import { appState } from '@/store/app'
import { ROUTES_PATH } from '@/router/paths'
import Login from '@/components/auth/Login/Login.vue'
import Dialog from './components/ui/Dialog/Dialog.vue'
import Header from '@/components/ui/Header/Header'
import PopupReload from '@/components/ui/PopupReload/PopupReload'
import { USER_PROFILE } from '@locokit/lck-glossary'
import Toast from 'primevue/toast'

export default {
  name: 'app',
  components: {
    'lck-header': Header,
    'lck-dialog': Dialog,
    'lck-login': Login,
    'lck-popup-reload': PopupReload,
    'p-toast': Toast,
  },
  data () {
    return {
      // eslint-disable-next-line no-undef
      logoURL: LCK_THEME.LOGO_BG_WHITE_URL,
      // eslint-disable-next-line no-undef
      logoMobileUrl: LCK_THEME.LOGO_MOBILE_URL,
      sidebarActive: false,
      // keep it here in the data to make it reactive
      authState,
      displayPopupReload: false,
      appState,
    }
  },
  computed: {
    displayHeader () {
      let result = true
      if (this.$route.meta.needHeader !== undefined) {
        result = this.$route.meta.needHeader
      }
      return result
    },
    isSuperAdmin () {
      return authState.data.user?.profile === USER_PROFILE.SUPERADMIN
    },
  },
  methods: {
    async authenticate (data) {
      await authenticate(data)
    },
    toggleSidebar () {
      this.sidebarActive = !this.sidebarActive
    },
    setStatusSidebar (value) {
      if (this.sidebarActive !== value) this.sidebarActive = value
    },
    onLogoutClick () {
      logout()
      this.$router.push(ROUTES_PATH.HOME)
    },
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
        this.$primevue.config.locale = this.$t('localePrime')
      },
      immediate: true,
    },
  },

}
</script>

<style lang="scss" src="@/styles/main.scss"></style>

<style lang="scss" scoped>
header {
  height: 4rem;
}

.bordered-login {
  border: 1px solid var(--primary-color);
  padding: 1em;
}
</style>
