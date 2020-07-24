<template>
  <el-container direction="vertical" class="h-full">
    <lck-header
      v-if="displayHeader"
      :logo-url="logoURL"
    />
    <el-container>
      <el-main class="flex-grow h-full bg-gray-100 overflow-auto">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
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

<style lang="scss" src="@/styles/main.scss" />
