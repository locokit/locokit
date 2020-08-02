<template>
  <div id="app">
    <lck-header
      v-if="displayHeader"
      :logo-url="logoURL"
    />
    <main class="o-auto p-fluid">
      <router-view/>
    </main>
  </div>
</template>

<script>
import Header from '@/components/layout/Header/Header'
import { appState } from '@/store'

export default {
  name: 'app',
  data () {
    return {
      state: appState,
      // eslint-disable-next-line no-undef
      logoURL: LCK_SETTINGS.LOGO_BG_WHITE_URL
    }
  },
  computed: {
    displayHeader () {
      let result = true
      if (this.$route.meta.needHeader !== undefined) {
        result = this.$route.meta.needHeader
      }
      return result
    }
  },
  components: {
    'lck-header': Header
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
