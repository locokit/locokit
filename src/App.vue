<template>
  <div
    id="app"
    class="p-d-flex p-flex-column"
    :class="sidebarActive ? 'sidebar-is-open' : 'sidebar-is-closed'"
  >
    <div
      class="layout-sidebar"
      :class="sidebarActive ? 'active' : 'hidden'"
    />
    <lck-header
      v-if="displayHeader"
      :logo-url="logoURL"
      @menuButtonClick="onMenuButtonClick"
      :is-super-admin="isSuperAdmin"
      @logoutClick="onLogoutClick"
    />
    <main class="p-d-flex p-flex-column d-flex-1 o-auto p-fluid w-full">
      <router-view/>
    </main>
  </div>
</template>

<script>
import {
  authState,
  logout
} from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import Header from '@/components/ui/Header/Header'
import { USER_PROFILE } from '@locokit/lck-glossary'

export default {
  name: 'app',
  data () {
    return {
      // eslint-disable-next-line no-undef
      logoURL: LCK_SETTINGS.LOGO_BG_WHITE_URL,
      sidebarActive: false,
      // keep it here in the data to make it reactive
      authState
    }
  },
  methods: {
    onMenuButtonClick: function () {
      this.sidebarActive = !this.sidebarActive
    },
    onLogoutClick: function () {
      logout()
      this.$router.push(ROUTES_PATH.HOME)
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
    }
  },
  components: {
    'lck-header': Header
  }
}
</script>

<style lang="scss" src="@/styles/main.scss"></style>

<style lang="scss" scoped>
header {
  height: 4rem;
}
</style>
