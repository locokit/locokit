<template>
  <div id="app" :class="sidebarActive ? 'sidebar-is-open' : 'sidebar-is-closed'">
    <div class="layout-sidebar" :class="sidebarActive ? 'active' : 'hidden'"></div>
    <lck-header
      v-if="displayHeader"
      :logo-url="logoURL"
      @menuButtonClick="onMenuButtonClick"
      :is-super-admin="isSuperAdmin"
    />
    <main class="o-auto p-fluid">
      <router-view/>
    </main>
    <p-toast />
  </div>
</template>

<script>
import Vue from 'vue'
import Header from '@/components/layout/Header/Header'
import Toast from 'primevue/toast'

import { appState } from '@/store'
import { authState } from '@/store/auth'

export default {
  name: 'app',
  data () {
    return {
      state: appState,
      // eslint-disable-next-line no-undef
      logoURL: LCK_SETTINGS.LOGO_BG_WHITE_URL,
      sidebarActive: false
    }
  },
  methods: {
    onMenuButtonClick: function () {
      this.sidebarActive = !this.sidebarActive
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
      let result = false
      if (authState.data.user.profile === 'SUPERADMIN') {
        result = true
      }
      return result
    }
  },
  components: {
    'lck-header': Header,
    'p-toast': Vue.extend(Toast)
  }
}
</script>

<style lang="scss" src="@/styles/main.scss"></style>

<style lang="scss" scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  header {
    height: 4rem;
  }
  main {
    flex: 1;
  }
}
</style>
