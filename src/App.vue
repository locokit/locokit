<template>
  <div class="flex flex-col h-full">
    <lck-header
      :is-authenticated="state.auth.data.isAuthenticated"
    />
    <main class="flex-grow h-full">
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
      state: appState
    }
  },
  components: {
    'lck-header': Header
  }
}
</script>

<style src="@/styles/main.css" />
