<template>
  <div>
    <lck-header
      :logo-url="logoURL"
      @menuButtonClick="toggleSidebar"
      :logo-mobile-url="logoMobileUrl"
      :is-super-admin="isSuperAdmin"
      @logoutClick="onLogoutClick"
      :has-burger-menu="appState.hasBurgerMenu"
    />
    <slot :sidebarActive="sidebarActive"></slot>
  </div>
</template>

<script lang="ts">
import Header from '@/components/ui/Header/Header.vue'
import { appState } from '@/store/app'
import {
  authState,
  logout,
} from '@/store/auth'
import { USER_PROFILE } from '@locokit/lck-glossary'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'LayoutWithHeader',
  components: {
    'lck-header': Header,
  },
  props: {
    chapters: {
      type: Array,
      default: () => ([]),
    },
  },
  data () {
    return {
      // eslint-disable-next-line no-undef
      logoURL: LCK_THEME.LOGO_BG_WHITE_URL,
      sidebarActive: false,
      // keep it here in the data to make it reactive
      authState,
      appState,
    }
  },
  computed: {
    isSuperAdmin () {
      return authState.data.user?.profile === USER_PROFILE.SUPERADMIN
    },
  },
  methods: {
    toggleSidebar () {
      this.sidebarActive = !this.sidebarActive
    },
    onLogoutClick () {
      logout()
      this.$router.push(ROUTES_PATH.HOME)
    },
  },
}
</script>
