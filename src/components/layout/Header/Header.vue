<template>
  <header
    class="lck-header p-px-2 p-d-flex p-jc-between"
  >
    <a class="menu-button p-my-auto" @click="onToggle">
      <i class="pi pi-bars"></i>
    </a>
    <router-link
      :to="ROUTES_PATH.WORKSPACE"
      class="p-my-auto"
    >      <img
        alt="logo"
        :src="logoUrl"
      />
    </router-link>
    <div class="p-my-auto profile-button">
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
  methods: {
    onToggle (event) {
      this.$emit('menuButtonClick', 'click')
    }
  },
  components: {
    'prime-button': Vue.extend(Button)
  }
}
</script>

<style scoped>
  .lck-header {
    height: var(--header-height) !important;
    border-bottom: 1px solid var(--header-border-bottom-color);
    background-color: var(--header-background-color);
  }
</style>
