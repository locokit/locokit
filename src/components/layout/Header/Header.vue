<template>
  <header
    class="lck-header p-px-2 p-d-flex p-jc-between"
  >
    <router-link
      :to="ROUTES_PATH.WORKSPACE"
      class="p-my-auto"
    >
      <img
        alt="logo"
        :src="logoUrl"
      />
    </router-link>
    <div class="p-my-auto">
      <router-link
        :to="ROUTES_PATH.PROFILE"
      >
        <prime-button icon="pi pi-user"  class="p-button-rounded"/>
      </router-link>
    </div>
  </header>
</template>

<script>
import Vue from 'vue'
import { ROUTES_PATH } from '@/router/paths'
import Button from 'primevue/button'

export default {
  name: 'Header',
  props: {
    logoUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      ROUTES_PATH
    }
  },
  components: {
    'prime-button': Vue.extend(Button)
  }
}
</script>

<style scoped>
  .lck-header {
    height: 4rem;
    border-bottom: 1px solid #e2e8f0;
  }
</style>
