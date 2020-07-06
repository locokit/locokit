<template>
  <div class="flex flex-col">
    <lck-header :is-authenticated="state.auth.data.isAuthenticated" />
    <main class="flex-grow p-2">
      <router-view/>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { appState } from '@/store/index'

export default {
  name: 'app',
  data () {
    return {
      state: appState
    }
  },
  components: {
    'lck-header': Header
  }
}
</script>

<style src="@/styles/main.css" />
